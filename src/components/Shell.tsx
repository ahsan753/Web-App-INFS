"use client";

import Link from "next/link";
import { Moon, RotateCcw, Sun, Trophy } from "lucide-react";
import { appConfig } from "@/lib/config";
import { clearProgress } from "@/lib/progress";
import { useProgress } from "@/components/AppProviders";

export function Shell({
  children,
  compact = false
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  const { progress, setProgress } = useProgress();

  function toggleTheme() {
    setProgress((current) => ({
      ...current,
      theme: current.theme === "light" ? "dark" : "light"
    }));
  }

  function reset() {
    if (!window.confirm("Reset all saved progress for this browser?")) return;
    clearProgress();
    window.location.reload();
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-4 sm:px-6 lg:px-8">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-3 shadow-[var(--shadow-soft)] backdrop-blur sm:px-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-[linear-gradient(135deg,var(--accent),var(--blue))] font-black text-white shadow-[var(--shadow-soft)]">
            1101
          </span>
          <span>
            <span className="block text-lg font-black">{appConfig.appName}</span>
            <span className="block text-sm text-[var(--muted)]">
              Guided Python practice for INFS 1101
            </span>
          </span>
        </Link>
        <div className="icon-button-row">
          {!compact && (
            <div className="reward-panel hidden items-center gap-2 px-3 py-2 text-sm sm:flex">
              <Trophy size={17} color="var(--gold)" />
              <span>
                <strong>{progress.xp}</strong> XP · <strong>{progress.streak}</strong> day streak
              </span>
            </div>
          )}
          <button className="button ghost icon-only" type="button" onClick={toggleTheme}>
            {progress.theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            <span className="sr-only">Toggle theme</span>
          </button>
          <button className="button ghost icon-only" type="button" onClick={reset}>
            <RotateCcw size={18} />
            <span className="sr-only">Reset progress</span>
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
