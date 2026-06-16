"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Lock,
  Medal,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy
} from "lucide-react";
import { lessons } from "@/data/lessons";
import { Shell } from "@/components/Shell";
import { useProgress } from "@/components/AppProviders";
import { lessonStats } from "@/lib/progress";
import { appConfig } from "@/lib/config";

export function HomePage() {
  const { progress } = useProgress();
  const lessonSummaries = lessons.map((lesson) => ({
    lesson,
    stats: lessonStats(lesson, progress)
  }));
  const completedLessons = lessonSummaries.filter((item) => item.stats.percent === 100).length;
  const reviewNeeded = lessonSummaries.reduce((total, item) => {
    const records = progress.lessons[item.lesson.id] || {};
    return (
      total +
      item.lesson.activities.filter((activity) => {
        const record = records[activity.id];
        return record?.attempted && (!record.correct || record.solutionViewed);
      }).length
    );
  }, 0);
  const continueLesson =
    lessons.find((lesson) => lesson.id === progress.lastVisitedLesson) ||
    lessonSummaries.find((item) => item.stats.percent < 100)?.lesson ||
    lessons[0];
  const continueStats = lessonStats(continueLesson, progress);
  const nextActivityNumber = Math.min(continueStats.correct + 1, continueLesson.activities.length);

  return (
    <Shell>
      <main className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <section className="grid gap-5">
          <div className="soft-panel overflow-hidden p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-end">
              <div>
                <p className="small-label text-[var(--accent)]">Resume practice</p>
                <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
                  Continue {continueLesson.id}: {continueLesson.title}
                </h1>
                <p className="mt-3 max-w-2xl text-[var(--muted)]">
                  Your next activity is ready. Keep the session short, focused,
                  and useful.
                </p>
                <div className="control-row mt-6">
                  <Link className="button primary" href={`/lessons/${continueLesson.id}`}>
                    Continue activity {nextActivityNumber}
                    <ArrowRight size={18} />
                  </Link>
                  <Link className="button" href="/lessons/L03">
                    Practise input and output
                  </Link>
                </div>
              </div>
              <div className="reward-panel p-4">
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles size={20} color="var(--gold)" />
                  <h2 className="font-black">Today’s boost</h2>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Metric label="XP" value={progress.xp} icon={<Star size={18} />} />
                  <Metric label="Streak" value={progress.streak} icon={<Flame size={18} />} />
                  <Metric label="Badges" value={completedLessons} icon={<Medal size={18} />} />
                </div>
              </div>
            </div>
          </div>

          <section className="soft-panel p-4 sm:p-5" aria-labelledby="learning-path-title">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="small-label text-[var(--blue)]">Learning path</p>
                <h2 id="learning-path-title" className="mt-1 text-2xl font-black">
                  Your 12-step Python route
                </h2>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-bold">
                {appConfig.lockLessons ? "Unlocking on" : "All lessons open"}
              </div>
            </div>
            <div className="relative grid gap-3 sm:pl-16">
              <div className="path-line absolute bottom-4 left-[1.875rem] top-4 hidden w-1 rounded-full sm:block" />
              {lessonSummaries.map(({ lesson, stats }, index) => {
                const previous = lessons[index - 1];
                const previousStats = previous ? lessonStats(previous, progress) : null;
                const locked =
                  appConfig.lockLessons &&
                  Boolean(previousStats && previousStats.percent < appConfig.passThreshold);
                const state = lessonState(stats.percent, lesson.id === continueLesson.id);
                return (
                  <Link
                    key={lesson.id}
                    href={locked ? "#" : `/lessons/${lesson.id}`}
                    aria-disabled={locked}
                    className={`group relative grid grid-cols-[2rem_1fr] gap-3 rounded-lg border p-3 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)] sm:grid-cols-[1fr_8rem] sm:items-center ${
                      state === "current"
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border)] bg-[var(--surface)]"
                    }`}
                  >
                    <span
                      className={`status-dot sm:absolute sm:-left-12 sm:top-1/2 sm:z-10 sm:-translate-y-1/2 ${
                        state === "complete" ? "complete" : state === "current" ? "current" : ""
                      }`}
                    >
                      {state === "complete" ? "✓" : lesson.number}
                    </span>
                    <span>
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="font-black">
                          {lesson.id} {lesson.title}
                        </span>
                        {locked && <Lock size={16} />}
                        {state === "current" && (
                          <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-black text-[var(--accent)]">
                            Continue
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">{lesson.blurb}</span>
                    </span>
                    <span>
                      <span className="mb-1 flex items-center justify-between text-xs font-bold text-[var(--muted)]">
                        <span>{stats.percent}%</span>
                        <span>
                          {stats.correct}/{stats.total}
                        </span>
                      </span>
                      <span className="block h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                        <span
                          className="block h-full rounded-full bg-[var(--accent)]"
                          style={{ width: `${stats.percent}%` }}
                        />
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </section>

        <aside className="grid h-fit gap-4">
          <section className="reward-panel p-5">
            <div className="flex items-center gap-3">
              <Trophy size={22} color="var(--gold)" />
              <h2 className="text-lg font-black">Reward Shelf</h2>
            </div>
            <div className="mt-4 grid gap-3">
              <RewardRow label="Lesson badges" value={`${completedLessons} of 12`} />
              <RewardRow label="XP earned" value={`${progress.xp} XP`} />
              <RewardRow label="Current streak" value={`${progress.streak} day`} />
            </div>
          </section>

          <section className="soft-panel p-5">
            <div className="flex items-center gap-3">
              <Target size={20} color="var(--accent)" />
              <h2 className="text-lg font-black">Study Focus</h2>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Review activities marked incorrect or completed with a model answer
              before moving too far ahead.
            </p>
            <Link
              className="button mt-4 w-full justify-between"
              href={`/lessons/${continueLesson.id}`}
            >
              {reviewNeeded > 0 ? `${reviewNeeded} to review` : "Start a fresh activity"}
              <RotateCcw size={18} />
            </Link>
          </section>

          <section className="soft-panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle2 size={20} color="var(--good)" />
              <h2 className="text-lg font-black">Course Progress</h2>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--gold))]"
                style={{ width: `${Math.round((completedLessons / lessons.length) * 100)}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {completedLessons} lessons completed. Keep each session small and
              steady.
            </p>
          </section>
        </aside>
      </main>
    </Shell>
  );
}

function Metric({
  label,
  value,
  icon
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[color-mix(in_srgb,var(--gold)_32%,var(--border))] bg-[var(--surface)] p-3">
      <div className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full bg-[var(--gold-soft)] text-[var(--gold)]">
        {icon}
      </div>
      <div className="metric-value">{value}</div>
      <div className="mt-1 text-xs font-bold text-[var(--muted)]">{label}</div>
    </div>
  );
}

function RewardRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}

function lessonState(percent: number, current: boolean) {
  if (percent === 100) return "complete";
  if (current || percent > 0) return "current";
  return "upcoming";
}
