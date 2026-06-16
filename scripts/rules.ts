import type { Activity, Lesson } from "../src/lib/types";

export const approvedBuiltins = [
  "print",
  "input",
  "int",
  "float",
  "str",
  "type",
  "len",
  "round",
  "abs",
  "pow"
];

export const shadowedBuiltins = [
  "sum",
  "min",
  "max",
  "list",
  "str",
  "dict",
  "print",
  "input",
  "float",
  "int",
  "set",
  "tuple"
];

export type CodeField = {
  lesson: Lesson;
  activity: Activity;
  index: number;
  field: string;
  code: string;
  modelAnswer: boolean;
  brokenCode: boolean;
  requiredFunction?: string;
  inline?: boolean;
};

export function codeFieldsForActivity(
  lesson: Lesson,
  activity: Activity,
  index: number
): CodeField[] {
  const fields: CodeField[] = [];
  const add = (
    field: string,
    code: string | undefined,
    options: Partial<CodeField> = {}
  ) => {
    if (!code) return;
    fields.push({
      lesson,
      activity,
      index,
      field,
      code,
      modelAnswer: false,
      brokenCode: false,
      ...options
    });
  };

  add("displayCode", activity.displayCode);
  for (const ref of activity.inlineCodeRefs || []) {
    add("inlineCodeRefs", ref, { inline: true });
  }

  if (activity.kind === "writeCode") {
    add("starterCode", activity.starterCode);
    add("sampleSolution", activity.sampleSolution, {
      modelAnswer: true,
      requiredFunction: activity.requireFunctionName
    });
  }
  if (activity.kind === "predictOutput") add("code", activity.code);
  if (activity.kind === "fixCode") {
    add("brokenCode", activity.brokenCode, { brokenCode: true });
    add("fixedCode", activity.fixedCode, { modelAnswer: true });
  }
  if (activity.kind === "orderLines") add("lines", activity.lines.join("\n"), { modelAnswer: true });
  if (activity.kind === "traceTable") add("code", activity.code);
  if (activity.kind === "fillGaps") {
    let filled = activity.template;
    for (const gap of activity.gaps) {
      filled = filled.replace(`{{${gap.id}}}`, gap.accepted[0] || "");
    }
    add("template", filled, { modelAnswer: true });
  }
  if (activity.kind === "shortAnswer" && activity.expectedAnswerIsCode) {
    for (const accepted of activity.accepted) {
      const callMatch = accepted.match(/^([a-z][a-z0-9_]*)\(/);
      add("accepted", accepted, {
        inline: true,
        requiredFunction: callMatch?.[1]
      });
    }
  }
  if (activity.kind === "mcq") {
    for (const option of activity.codeOptions || []) add("codeOptions", option, { inline: true });
  }
  if (activity.kind === "matching") {
    for (const label of activity.codeLabels || []) add("codeLabels", label, { inline: true });
  }

  return fields;
}

export function proseLooksLikeCode(value: string) {
  return /`|(^|\n)\s*(if |while |def |import |print\(|[a-z_]+\s*=)/.test(value);
}
