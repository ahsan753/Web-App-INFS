"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createEmptyProgress, loadProgress, saveProgress } from "@/lib/progress";
import type { ProgressState } from "@/lib/types";

type ContextValue = {
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
};

export const ProgressContext = React.createContext<ContextValue | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => createEmptyProgress());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = progress.theme;
    saveProgress(progress);
  }, [hydrated, progress]);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/sw.js`);
    }
  }, []);

  const value = useMemo(() => ({ progress, setProgress }), [progress]);

  return (
    <ProgressContext.Provider value={value}>
      <div className="app-shell">{children}</div>
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = React.useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress must be used inside AppProviders.");
  }
  return value;
}
