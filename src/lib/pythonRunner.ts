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

// Kick off the one-time Pyodide download/init ahead of the first run so the
// first "Run checks" is not racing an ~8 MB cold load against the execution
// timeout. Safe to call repeatedly: the worker caches the Pyodide promise.
export function warmUpPython() {
  const activeWorker = getWorker();
  activeWorker.postMessage({
    kind: "warmup",
    id: 0,
    payload: { basePath: appConfig.basePath }
  });
}

const loadTimeoutResult: WorkerResult = {
  ok: false,
  standards: { ok: false, messages: [] },
  tests: [],
  loadError:
    "Python is taking a while to load. Check your connection, then run the checks again."
};

const runTimeoutResult: WorkerResult = {
  ok: false,
  standards: { ok: false, messages: [] },
  tests: [],
  loadError: "Your program took too long. Check your loop condition."
};

export function runPythonActivity(
  activity: WriteCode,
  source: string,
  lessonNumber: number
): Promise<WorkerResult> {
  const activeWorker = getWorker();
  const id = nextId;
  nextId += 1;

  return new Promise((resolve) => {
    let executionTimer: number | null = null;

    function cleanup() {
      window.clearTimeout(loadTimer);
      if (executionTimer !== null) window.clearTimeout(executionTimer);
      activeWorker.removeEventListener("message", listener);
    }

    // The cold-load phase gets a generous timeout. The strict execution
    // timeout only starts once the worker reports Pyodide is ready, so a slow
    // first download is never misreported as a slow loop.
    const loadTimer = window.setTimeout(() => {
      cleanup();
      terminatePythonWorker();
      resolve(loadTimeoutResult);
    }, appConfig.pyodideLoadTimeoutMs);

    const listener = (
      event: MessageEvent<{ id: number; phase?: "ready"; result?: WorkerResult }>
    ) => {
      if (event.data.id !== id) return;

      if (event.data.phase === "ready") {
        window.clearTimeout(loadTimer);
        executionTimer = window.setTimeout(() => {
          cleanup();
          terminatePythonWorker();
          resolve(runTimeoutResult);
        }, appConfig.pyodideTimeoutMs);
        return;
      }

      if (event.data.result) {
        cleanup();
        resolve(event.data.result);
      }
    };

    activeWorker.addEventListener("message", listener);
    activeWorker.postMessage({
      kind: "run",
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
