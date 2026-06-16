"use client";

import { appConfig, withBasePath } from "@/lib/config";
import type { WriteCode } from "@/lib/types";

export type WorkerResult = {
  ok: boolean;
  standards: {
    ok: boolean;
    messages: { level: "error" | "warning"; code: string; message: string }[];
  };
  tests: {
    passed: boolean;
    expected?: unknown;
    actual?: unknown;
    errorType?: string;
    errorMessage?: string;
  }[];
  loadError?: string;
};

let worker: Worker | null = null;
let nextId = 1;

function getWorker() {
  if (!worker) {
    worker = new Worker(withBasePath("/python-worker.js"));
  }
  return worker;
}

export function terminatePythonWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

export function runPythonActivity(
  activity: WriteCode,
  source: string,
  lessonNumber: number
): Promise<WorkerResult> {
  const activeWorker = getWorker();
  const id = nextId;
  nextId += 1;

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      terminatePythonWorker();
      resolve({
        ok: false,
        standards: { ok: false, messages: [] },
        tests: [],
        loadError: "Your program took too long. Check your loop condition."
      });
    }, appConfig.pyodideTimeoutMs);

    const listener = (event: MessageEvent<{ id: number; result: WorkerResult }>) => {
      if (event.data.id !== id) return;
      window.clearTimeout(timer);
      activeWorker.removeEventListener("message", listener);
      resolve(event.data.result);
    };

    activeWorker.addEventListener("message", listener);
    activeWorker.postMessage({
      id,
      payload: {
        basePath: appConfig.basePath,
        source,
        lessonNumber,
        requireFunctionName: activity.requireFunctionName,
        programTests: activity.programTests,
        functionTests: activity.functionTests,
        randomMode: activity.randomMode
      }
    });
  });
}
