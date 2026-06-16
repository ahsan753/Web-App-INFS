import { writeFileSync } from "node:fs";
import { lessons } from "../src/data/lessons";
import { codeFieldsForActivity } from "./rules";

const lines = [
  "# INFS 1101 Content Audit",
  "",
  "| Lesson | Activities | Types | New concepts | Python features seen |",
  "|---|---:|---|---|---|"
];

for (const lesson of lessons) {
  const kinds = [...new Set(lesson.activities.map((activity) => activity.kind))].join(", ");
  const code = lesson.activities
    .flatMap((activity, index) => codeFieldsForActivity(lesson, activity, index))
    .map((field) => field.code)
    .join("\n");
  const features = detectFeatures(code).join(", ") || "No Python snippets";
  lines.push(
    `| ${lesson.id} ${lesson.title} | ${lesson.activities.length} | ${kinds} | ${lesson.newSkills.join(
      ", "
    )} | ${features} |`
  );
}

writeFileSync("CONTENT_AUDIT.md", `${lines.join("\n")}\n`);
console.log("Generated CONTENT_AUDIT.md");

function detectFeatures(code: string) {
  const found = new Set<string>();
  const patterns: [string, RegExp][] = [
    ["input", /\binput\(/],
    ["print", /\bprint\(/],
    ["if", /\bif\b/],
    ["elif", /\belif\b/],
    ["while", /\bwhile\b/],
    ["def", /\bdef\b/],
    ["return", /\breturn\b/],
    ["import math", /\bimport math\b/],
    ["import random", /\bimport random\b/],
    ["string indexing/slicing", /\[[^\]]+\]/],
    ["math calls", /math\./],
    ["random calls", /random\./],
    ["extra string methods", /\.(replace|find|startswith|endswith|isspace|isalnum|capitalize)\(/]
  ];
  for (const [label, pattern] of patterns) {
    if (pattern.test(code)) found.add(label);
  }
  return [...found];
}
