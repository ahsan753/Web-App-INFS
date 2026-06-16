import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const teacherDir = join(process.cwd(), "app", "teacher");
const enabled = process.env.NEXT_PUBLIC_TEACHER_MODE === "on";

if (!enabled) {
  if (existsSync(teacherDir)) {
    rmSync(teacherDir, { recursive: true, force: true });
  }
  console.log("Teacher mode off: /teacher route excluded from build.");
  process.exit(0);
}

mkdirSync(teacherDir, { recursive: true });
writeFileSync(
  join(teacherDir, "page.tsx"),
  `import { TeacherPage } from "@/components/TeacherPage";\n\nexport default function Page() {\n  return <TeacherPage />;\n}\n`
);
console.log("Teacher mode on: /teacher route prepared.");
