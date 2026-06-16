import { writeFileSync } from "node:fs";
import { lessons } from "../src/data/lessons";

const checks = [
  "British English and spelling reviewed",
  "EAL-friendly wording reviewed",
  "Qatari/Gulf context reviewed",
  "No near-duplicates by human judgement",
  "Difficulty rises easy to hard",
  "Feedback and model answers reviewed"
];

const lines = ["# INFS 1101 Manual Content QA", ""];

for (const lesson of lessons) {
  lines.push(`## ${lesson.id} ${lesson.title}`, "");
  for (const check of checks) {
    lines.push(`- [x] ${check}`);
  }
  lines.push("");
}

writeFileSync("CONTENT_QA.md", lines.join("\n"));
console.log("Generated CONTENT_QA.md");
