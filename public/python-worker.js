let pyodidePromise = null;

function getPyodide(basePath) {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      importScripts(`${basePath}/pyodide/pyodide.js`);
      const pyodide = await loadPyodide({
        indexURL: `${basePath}/pyodide/`
      });
      await pyodide.runPythonAsync(`
import ast
import builtins
import contextlib
import io
import json
import random
import sys
`);
      return pyodide;
    })();
  }
  return pyodidePromise;
}

const checkerSource = String.raw`
import ast
import builtins
import json

APPROVED_BUILTINS = {
    "print", "input", "int", "float", "str", "type", "len",
    "round", "abs", "pow"
}
BANNED_SHADOWS = {
    "sum", "min", "max", "list", "str", "dict", "print", "input",
    "float", "int", "set", "tuple"
}


def check_source(source, lesson_number, require_function_name=None):
    messages = []
    try:
        tree = ast.parse(source)
    except SyntaxError as error:
        return {
            "ok": False,
            "messages": [{
                "level": "error",
                "code": "syntax",
                "message": f"Syntax error on line {error.lineno}: {error.msg}."
            }]
        }

    defined = {
        node.name for node in ast.walk(tree)
        if isinstance(node, ast.FunctionDef)
    }

    if require_function_name and require_function_name not in defined:
        messages.append({
            "level": "error",
            "code": "required-function",
            "message": f"Define a function named {require_function_name}."
        })

    for node in ast.walk(tree):
        if isinstance(node, (ast.For, ast.AsyncFor)):
            messages.append({
                "level": "error",
                "code": "for",
                "message": "The course does not use for loops. Use a while loop when loops are allowed."
            })
        if isinstance(node, ast.While) and lesson_number < 7:
            messages.append({
                "level": "error",
                "code": "while-early",
                "message": "while loops come in Lesson 7."
            })
        if isinstance(node, ast.FunctionDef):
            if lesson_number < 10:
                messages.append({
                    "level": "error",
                    "code": "def-early",
                    "message": "Functions come in Lesson 10."
                })
            if not ast.get_docstring(node):
                is_required = (
                    require_function_name is not None
                    and node.name == require_function_name
                )
                messages.append({
                    "level": "error" if is_required else "warning",
                    "code": "docstring",
                    "message": (
                        f"Function {node.name} needs a docstring."
                        + (" This exercise requires one." if is_required else "")
                    )
                })
            if not node.name.islower() or "-" in node.name or any(ch.isupper() for ch in node.name):
                messages.append({
                    "level": "warning",
                    "code": "name-style",
                    "message": f"Use lower_snake_case for {node.name}."
                })
        if isinstance(node, (ast.Import, ast.ImportFrom)) and lesson_number < 11:
            messages.append({
                "level": "error",
                "code": "import-early",
                "message": "Modules come in Lesson 11."
            })
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name not in {"math", "random"}:
                    messages.append({
                        "level": "error",
                        "code": "module",
                        "message": "Only math and random are used in INFS 1101."
                    })
        if isinstance(node, (ast.Break, ast.Continue, ast.Try, ast.Lambda,
                             ast.IfExp, ast.ListComp, ast.SetComp, ast.DictComp,
                             ast.GeneratorExp, ast.List, ast.Dict, ast.Set,
                             ast.Tuple)):
            messages.append({
                "level": "error",
                "code": type(node).__name__,
                "message": "This uses a feature not allowed in INFS 1101."
            })
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                name = node.func.id
                if name in {"map", "filter", "reduce", "range", "sorted",
                            "eval", "bool", "ord", "chr"}:
                    messages.append({
                        "level": "error",
                        "code": "unsupported-call",
                        "message": f"{name} is not in the INFS 1101 toolkit."
                    })
                elif name not in APPROVED_BUILTINS and name not in defined:
                    if lesson_number < 10:
                        messages.append({
                            "level": "error",
                            "code": "call-early",
                            "message": "Calling your own functions comes in Lesson 10."
                        })
                    else:
                        messages.append({
                            "level": "error",
                            "code": "unsupported-call",
                            "message": f"{name} is not defined in this answer."
                        })
                if name in {"round", "abs", "pow"} and lesson_number < 12:
                    messages.append({
                        "level": "error",
                        "code": "scope",
                        "message": f"{name} comes in Lesson 12."
                    })
            if isinstance(node.func, ast.Attribute):
                attr = node.func.attr
                if attr in {"capitalize", "isalnum", "isspace", "startswith",
                            "endswith", "find", "replace"} and lesson_number < 12:
                    messages.append({
                        "level": "error",
                        "code": "scope",
                        "message": f"{attr} comes in Lesson 12."
                    })
        if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Pow) and lesson_number < 12:
            messages.append({
                "level": "error",
                "code": "scope",
                "message": "The ** operator comes in Lesson 12."
            })
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            if node.id in BANNED_SHADOWS:
                messages.append({
                    "level": "warning",
                    "code": "shadow",
                    "message": f"Do not use {node.id} as a variable name."
                })

    for index, line in enumerate(source.splitlines(), start=1):
        if line.startswith(" ") and (len(line) - len(line.lstrip(" "))) % 4 != 0:
            messages.append({
                "level": "warning",
                "code": "indent",
                "message": f"Line {index} should use 4-space indentation."
            })
        if len(line) > 80:
            messages.append({
                "level": "warning",
                "code": "line-length",
                "message": f"Line {index} is longer than 80 characters."
            })

    return {
        "ok": not any(item["level"] == "error" for item in messages),
        "messages": messages
    }
`;

async function runProgram(pyodide, payload) {
  pyodide.runPython(checkerSource);
  const check = pyodide.globals.get("check_source")(
    payload.source,
    payload.lessonNumber,
    payload.requireFunctionName || null
  ).toJs({ dict_converter: Object.fromEntries });

  if (!check.ok) {
    return { ok: false, standards: check, tests: [] };
  }

  const tests = [];
  for (const test of payload.programTests || []) {
    const script = `
import builtins
import contextlib
import io
import json
import random
stdin_values = ${JSON.stringify(test.stdin || [])}
stdin_index = 0

def trainer_input(prompt=""):
    global stdin_index
    if stdin_index >= len(stdin_values):
        raise EOFError("No more test input is available.")
    value = stdin_values[stdin_index]
    stdin_index = stdin_index + 1
    return value

builtins.input = trainer_input
buffer = io.StringIO()
try:
    with contextlib.redirect_stdout(buffer):
${payload.source.split("\n").map((line) => `        ${line}`).join("\n")}
    result_payload = {
        "ok": True,
        "stdout": buffer.getvalue(),
        "errorType": None,
        "errorMessage": None
    }
except Exception as error:
    result_payload = {
        "ok": False,
        "stdout": buffer.getvalue(),
        "errorType": type(error).__name__,
        "errorMessage": str(error)
    }
json.dumps(result_payload)
`;
    const result = JSON.parse(await pyodide.runPythonAsync(script));
    tests.push({
      passed: result.ok && normaliseOutput(result.stdout) === normaliseOutput(test.expectedStdout),
      expected: test.expectedStdout,
      actual: normaliseOutput(result.stdout),
      errorType: result.errorType,
      errorMessage: result.errorMessage
    });
  }

  for (const fnTest of payload.functionTests || []) {
    for (const testCase of fnTest.cases) {
      const script = `
import json
import math
import random
namespace = {}
try:
    exec(${JSON.stringify(payload.source)}, namespace)
    result = namespace[${JSON.stringify(fnTest.functionName)}](*json.loads(${JSON.stringify(JSON.stringify(testCase.args || []))}))
    passed = False
    expected = json.loads(${JSON.stringify(JSON.stringify(testCase.expected ?? null))})
    property_payload = json.loads(${JSON.stringify(JSON.stringify(testCase.property ?? null))})
    if property_payload is None:
        passed = result == expected
    elif property_payload["type"] == "intInRange":
        passed = isinstance(result, int) and property_payload["min"] <= result <= property_payload["max"]
    elif property_payload["type"] == "inSet":
        passed = result in property_payload["values"]
    elif property_payload["type"] == "predicate":
        passed = bool(eval(property_payload["pythonExpr"], {"result": result, "math": math}))
    result_payload = {
        "ok": True,
        "passed": passed,
        "actual": result,
        "expected": expected,
        "errorType": None,
        "errorMessage": None
    }
except Exception as error:
    result_payload = {
        "ok": False,
        "passed": False,
        "actual": None,
        "expected": json.loads(${JSON.stringify(JSON.stringify(testCase.expected ?? null))}),
        "errorType": type(error).__name__,
        "errorMessage": str(error)
    }
json.dumps(result_payload)
`;
      const result = JSON.parse(await pyodide.runPythonAsync(script));
      tests.push({
        passed: result.passed,
        expected: result.expected,
        actual: result.actual,
        errorType: result.errorType,
        errorMessage: result.errorMessage
      });
    }
  }

  return {
    ok: tests.length > 0 && tests.every((test) => test.passed),
    standards: check,
    tests
  };
}

function normaliseOutput(value) {
  return String(value)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n$/g, "");
}

self.onmessage = async (event) => {
  const { id, payload } = event.data;
  try {
    const pyodide = await getPyodide(payload.basePath || "");
    const result = await runProgram(pyodide, payload);
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({
      id,
      result: {
        ok: false,
        standards: { ok: false, messages: [] },
        tests: [],
        loadError: error instanceof Error ? error.message : String(error)
      }
    });
  }
};
