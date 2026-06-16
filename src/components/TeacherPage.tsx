"use client";

import { Download, Upload } from "lucide-react";
import { lessons } from "@/data/lessons";
import { Shell } from "@/components/Shell";
import { useProgress } from "@/components/AppProviders";
import { appConfig } from "@/lib/config";
import { createEmptyProgress } from "@/lib/progress";

export function TeacherPage() {
  const { progress, setProgress } = useProgress();

  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "infs1101-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importProgress(file: File) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (
      parsed.schemaVersion !== appConfig.schemaVersion ||
      parsed.contentVersion !== appConfig.contentVersion
    ) {
      window.alert("This progress file is not compatible with this build.");
      return;
    }
    setProgress(parsed);
  }

  return (
    <Shell>
      <main className="panel p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Teacher View</h1>
            <p className="mt-1 max-w-3xl text-[var(--muted)]">
              This page reveals answers. It is obscure, not secure, and should be
              built only for local or teacher-only deployments.
            </p>
          </div>
          <div className="control-row end">
            <button className="button" type="button" onClick={exportProgress}>
              <Download size={18} /> Export progress
            </button>
            <label className="button">
              <Upload size={18} /> Import progress
              <input
                className="sr-only"
                type="file"
                accept="application/json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) importProgress(file);
                }}
              />
            </label>
            <button className="button" type="button" onClick={() => setProgress(createEmptyProgress())}>
              Reset local view
            </button>
          </div>
        </div>
        <section className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-[var(--border)] p-2 text-left">Lesson</th>
                <th className="border border-[var(--border)] p-2 text-left">Activity</th>
                <th className="border border-[var(--border)] p-2 text-left">Kind</th>
                <th className="border border-[var(--border)] p-2 text-left">Answer</th>
                <th className="border border-[var(--border)] p-2 text-left">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {lessons.flatMap((lesson) =>
                lesson.activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="border border-[var(--border)] p-2">{lesson.id}</td>
                    <td className="border border-[var(--border)] p-2">{activity.prompt}</td>
                    <td className="border border-[var(--border)] p-2">{activity.kind}</td>
                    <td className="border border-[var(--border)] p-2">
                      <Answer activity={activity} />
                    </td>
                    <td className="border border-[var(--border)] p-2">{activity.explanation}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </Shell>
  );
}

function Answer({ activity }: { activity: (typeof lessons)[number]["activities"][number] }) {
  if (activity.kind === "mcq") return <span>{activity.correctIndexes.join(", ")}</span>;
  if (activity.kind === "fillGaps") return <span>{activity.gaps.map((gap) => gap.accepted[0]).join(", ")}</span>;
  if (activity.kind === "orderLines") return <pre className="code-block">{activity.lines.join("\n")}</pre>;
  if (activity.kind === "matching") return <span>{activity.pairs.map((pair) => `${pair.left}: ${pair.right}`).join("; ")}</span>;
  if (activity.kind === "predictOutput") return <span>{activity.expectedStdout || activity.expectedError?.type}</span>;
  if (activity.kind === "traceTable") return <span>{JSON.stringify(activity.rows)}</span>;
  if (activity.kind === "shortAnswer") return <span>{activity.accepted.join(", ")}</span>;
  if (activity.kind === "fixCode") return <pre className="code-block">{activity.fixedCode}</pre>;
  return <pre className="code-block">{activity.sampleSolution}</pre>;
}
