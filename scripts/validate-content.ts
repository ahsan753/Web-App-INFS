import { execFileSync } from "node:child_process";
import { lessons } from "../src/data/lessons";
import type { Activity, Lesson } from "../src/lib/types";
import { codeFieldsForActivity, proseLooksLikeCode } from "./rules";

type Finding = {
  level: "ERROR" | "WARN";
  rule: string;
  lesson: string;
  activity?: string;
  field?: string;
  message: string;
};

type PythonFinding = {
  level: "ERROR" | "WARN";
  rule: string;
  line?: number;
  message: string;
};

const args = new Set(process.argv.slice(2));
const allowIncomplete = args.has("--allow-incomplete");
const strict = args.has("--strict");
const selfTest = args.has("--self-test");

if (selfTest) {
  runSelfTest();
  process.exit(0);
}

const findings: Finding[] = [];

for (const lesson of lessons) {
  if (!allowIncomplete) {
    if (lesson.activities.length < 8) {
      findings.push({
        level: "ERROR",
        rule: "E-MIN-ACTIVITIES",
        lesson: lesson.id,
        message: `lesson has ${lesson.activities.length} activities; minimum is 8.`
      });
    }

    const kinds = new Set(lesson.activities.map((activity) => activity.kind));
    if (kinds.size < 4) {
      findings.push({
        level: "ERROR",
        rule: "E-MIN-TYPES",
        lesson: lesson.id,
        message: `lesson uses ${kinds.size} activity types; minimum is 4.`
      });
    }
  }

  lesson.activities.forEach((activity, index) => {
    if (!activity.explanation.trim()) {
      findings.push({
        level: "ERROR",
        rule: "E-NO-EXPLANATION",
        lesson: lesson.id,
        activity: activity.id,
        message: "activity has no explanation."
      });
    }

    checkProse(lesson, activity);

    for (const field of codeFieldsForActivity(lesson, activity, index)) {
      const result = analysePython(
        field.inline ? normaliseInline(field.code) : field.code,
        lesson.number,
        field.modelAnswer && !field.brokenCode,
        field.requiredFunction || "",
        field.brokenCode
      ).filter((item) => !(field.brokenCode && item.rule === "E-PARSE"));

      for (const item of result) {
        findings.push({
          level: item.level,
          rule: item.rule,
          lesson: lesson.id,
          activity: activity.id,
          field: field.field,
          message: `${item.line ? `L${item.line}: ` : ""}${item.message}`
        });
      }

      if (activity.kind === "writeCode" && field.field === "sampleSolution") {
        if (activity.requireFunctionName && !field.code.includes(`def ${activity.requireFunctionName}(`)) {
          findings.push({
            level: "ERROR",
            rule: "E-FUNC-NAME",
            lesson: lesson.id,
            activity: activity.id,
            field: "sampleSolution",
            message: `sample solution does not define ${activity.requireFunctionName}.`
          });
        }
        if (
          activity.docstring?.exactText &&
          !field.code.includes(`"""${activity.docstring.exactText}"""`)
        ) {
          findings.push({
            level: "ERROR",
            rule: "E-EXACT-DOCSTRING",
            lesson: lesson.id,
            activity: activity.id,
            field: "sampleSolution",
            message: "sample solution docstring does not match exact text."
          });
        }
      }
    }
  });
}

printReport(findings);

const errors = findings.filter((finding) => finding.level === "ERROR").length;
const warnings = findings.length - errors;
process.exit(errors > 0 || (strict && warnings > 0) ? 1 : 0);

function checkProse(lesson: Lesson, activity: Activity) {
  const proseFields = [
    ["prompt", activity.prompt],
    ["explanation", activity.explanation],
    ["commonMistake", activity.commonMistake || ""]
  ];
  for (const [field, value] of proseFields) {
    if (value && proseLooksLikeCode(value)) {
      findings.push({
        level: "WARN",
        rule: "W-CODE-IN-PROSE",
        lesson: lesson.id,
        activity: activity.id,
        field,
        message: "move learner-facing code out of prose and into a code field."
      });
    }
  }
}

function normaliseInline(code: string) {
  if (code.startsWith(".")) return `"text"${code}()`;
  if (/^(if|elif|else|while|def|import)$/.test(code)) return "pass";
  if (code === "return") return "def temporary_function():\n    return True";
  if (/^[a-zA-Z_][\w.]*$/.test(code) && !code.includes(".")) return `${code} = 1`;
  return code;
}

function analysePython(
  code: string,
  lessonNumber: number,
  modelAnswer: boolean,
  requiredFunction: string,
  brokenCode = false
): PythonFinding[] {
  const python = String.raw`
import ast
import json
import re
import sys

payload = json.loads(sys.stdin.read())
code = payload["code"]
lesson = payload["lesson"]
model_answer = payload["modelAnswer"]
required_function = payload["requiredFunction"]
findings = []
approved = {"print", "input", "int", "float", "str", "type", "len", "round", "abs", "pow"}
shadowed = {"sum", "min", "max", "list", "str", "dict", "print", "input", "float", "int", "set", "tuple"}

def add(level, rule, node, message):
    findings.append({
        "level": level,
        "rule": rule,
        "line": getattr(node, "lineno", None),
        "message": message
    })

try:
    tree = ast.parse(code)
except SyntaxError as error:
    print(json.dumps([{
        "level": "ERROR",
        "rule": "E-PARSE",
        "line": error.lineno,
        "message": error.msg
    }]))
    raise SystemExit

defined = {node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)}

for node in ast.walk(tree):
    if isinstance(node, (ast.For, ast.AsyncFor)):
        add("ERROR", "E-FOR", node, "for loops are never used in INFS 1101.")
    if isinstance(node, ast.Break):
        add("ERROR", "E-BREAK", node, "break is not used in INFS 1101.")
    if isinstance(node, ast.Continue):
        add("ERROR", "E-CONTINUE", node, "continue is not used in INFS 1101.")
    if isinstance(node, ast.Lambda):
        add("ERROR", "E-LAMBDA", node, "lambda is not used in INFS 1101.")
    if isinstance(node, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)):
        add("ERROR", "E-COMP", node, "comprehensions are not used in INFS 1101.")
    if isinstance(node, ast.IfExp):
        add("ERROR", "E-TERNARY", node, "inline if expressions are banned.")
    if isinstance(node, ast.Try):
        add("ERROR", "E-TRY", node, "try statements are not used in INFS 1101.")
    if isinstance(node, (ast.List, ast.Dict, ast.Set, ast.Tuple)):
        add("ERROR", "E-COLLECTION", node, "collections are not taught in this course.")
    if isinstance(node, ast.While) and lesson < 7:
        add("ERROR", "E-WHILE-EARLY", node, "while is introduced in L07.")
    if isinstance(node, ast.FunctionDef):
        if lesson < 10:
            add("ERROR", "E-DEF-EARLY", node, "functions are introduced in L10.")
        if model_answer and not ast.get_docstring(node):
            add("ERROR", "E-SOLUTION-STYLE", node, f"function {node.name} has no docstring.")
        if model_answer and not re.match(r"^[a-z][a-z0-9_]*$", node.name):
            add("ERROR", "E-SOLUTION-STYLE", node, f"{node.name} is not lower_snake_case.")
    if isinstance(node, (ast.Import, ast.ImportFrom)):
        if lesson < 11:
            add("ERROR", "E-IMPORT-EARLY", node, "imports are introduced in L11.")
        module_names = []
        if isinstance(node, ast.Import):
            module_names = [alias.name for alias in node.names]
        elif node.module:
            module_names = [node.module]
        for name in module_names:
            if name not in {"math", "random"}:
                add("ERROR", "E-UNSUPPORTED-CALL", node, "only math and random are used.")
            if name == "random" and lesson < 12:
                add("WARN", "W-SCOPE", node, "random is introduced in L12.")
    if isinstance(node, ast.Call):
        if isinstance(node.func, ast.Name):
            name = node.func.id
            if name in {"map", "filter", "reduce"}:
                add("ERROR", "E-FUNCTIONAL", node, f"{name} is not allowed.")
            elif name in {"range", "sorted", "eval", "bool", "ord", "chr"}:
                add("ERROR", "E-UNSUPPORTED-CALL", node, f"{name} is not in the toolkit.")
            elif name not in approved and name not in defined and name != required_function:
                if lesson < 10:
                    add("ERROR", "E-CALL-EARLY", node, "user-defined calls are introduced in L10.")
                else:
                    add("ERROR", "E-UNSUPPORTED-CALL", node, f"{name} is not defined.")
            if name in {"round", "abs", "pow"} and lesson < 12:
                add("WARN", "W-SCOPE", node, f"{name} is introduced in L12.")
            if name == "print":
                for keyword in node.keywords:
                    if keyword.arg in {"sep", "end"} and lesson < 12:
                        add("WARN", "W-SCOPE", node, "print sep/end are introduced in L12.")
        if isinstance(node.func, ast.Attribute):
            attr = node.func.attr
            if attr == "capitalize" and lesson < 11:
                add("WARN", "W-SCOPE", node, f"{attr} is introduced in L11.")
            if attr in {"isalnum", "isspace", "startswith", "endswith", "find", "replace"} and lesson < 12:
                add("WARN", "W-SCOPE", node, f"{attr} is introduced in L12.")
            if attr in {"exp", "factorial", "gcd"} and lesson < 12:
                add("WARN", "W-SCOPE", node, f"math.{attr} is introduced in L12.")
    if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Pow) and lesson < 12:
        add("WARN", "W-SCOPE", node, "the ** operator is introduced in L12.")
    if model_answer and isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
        if node.id in shadowed:
            add("ERROR", "E-SOLUTION-STYLE", node, f"{node.id} shadows a built-in.")
        if len(node.id) == 1 and node.id not in {"i", "j", "k"}:
            add("WARN", "W-SINGLE-LETTER", node, f"{node.id} is not meaningful.")
        if not re.match(r"^[a-z][a-z0-9_]*$", node.id):
            add("ERROR", "E-SOLUTION-STYLE", node, f"{node.id} is not lower_snake_case.")

if model_answer:
    lines = code.splitlines()
    function_lines = [node.lineno for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
    for line_no, line in enumerate(lines, 1):
        if len(line) > 80:
            findings.append({"level": "WARN", "rule": "W-LINE-LENGTH", "line": line_no, "message": "line exceeds 80 characters."})
        leading = len(line) - len(line.lstrip(" "))
        if leading and leading % 4 != 0:
            findings.append({"level": "ERROR", "rule": "E-SOLUTION-STYLE", "line": line_no, "message": "indentation is not a multiple of 4 spaces."})
    for function_line in function_lines:
        if function_line > 2 and lines[function_line - 2].strip() != "":
            findings.append({"level": "WARN", "rule": "W-BLANK-LINES", "line": function_line, "message": "top-level function should have two blank lines before it."})

print(json.dumps(findings))
`;

  const output = execFileSync("python3", ["-c", python], {
    input: JSON.stringify({ code, lesson: lessonNumber, modelAnswer, requiredFunction, brokenCode }),
    encoding: "utf8"
  });

  return JSON.parse(output) as PythonFinding[];
}

function printReport(items: Finding[]) {
  console.log("INFS 1101 - content validation");
  console.log("================================");
  console.log("");

  for (const lesson of lessons) {
    const lessonItems = items.filter((item) => item.lesson === lesson.id);
    console.log(
      `${lesson.id}  ${lesson.title}  (${lesson.activities.length} activities, ${
        new Set(lesson.activities.map((activity) => activity.kind)).size
      } types)`
    );
    if (lessonItems.length === 0) {
      console.log("  OK");
    } else {
      for (const item of lessonItems) {
        console.log(
          `  ${item.level.padEnd(5)} ${item.rule.padEnd(18)} ${item.activity || ""} ${
            item.field || ""
          } ${item.message}`
        );
      }
    }
    console.log("");
  }

  const errors = items.filter((item) => item.level === "ERROR").length;
  const warnings = items.length - errors;
  console.log("--------------------------------------------------------------------------");
  console.log(`Summary: ${errors} ERROR(s), ${warnings} WARNING(s) across ${lessons.length} lessons.`);
  console.log(`Result: ${errors > 0 || (strict && warnings > 0) ? "FAIL" : "PASS"}.`);
}

function runSelfTest() {
  const samples = [
    ["for item in data:\n    print(item)", 7, "E-FOR"],
    ["items = [1, 2, 3]", 7, "E-COLLECTION"],
    ["count = 0\nwhile count < 3:\n    count = count + 1", 6, "E-WHILE-EARLY"],
    ["def add_one(value):\n    return value + 1", 9, "E-DEF-EARLY"],
    ["import math\nprint(math.sqrt(4))", 10, "E-IMPORT-EARLY"]
  ] as const;

  for (const [code, lesson, rule] of samples) {
    const result = analysePython(code, lesson, true, "");
    if (!result.some((item) => item.rule === rule)) {
      throw new Error(`Expected ${rule} for sample: ${code}`);
    }
  }
  console.log("Validator self-test passed.");
}
