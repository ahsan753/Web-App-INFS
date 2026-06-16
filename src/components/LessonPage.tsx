"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Flame,
  Medal,
  RotateCcw,
  Sparkles,
  Star,
  Trophy
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ActivityRenderer } from "@/components/activities/ActivityRenderer";
import { Shell } from "@/components/Shell";
import { useProgress } from "@/components/AppProviders";
import { appConfig } from "@/lib/config";
import { computeStreak, defaultActivityResult, lessonStats, todayKey } from "@/lib/progress";
import type { Activity, Lesson } from "@/lib/types";

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const { progress, setProgress } = useProgress();
  const [index, setIndex] = useState(0);
  const [reviewOnly, setReviewOnly] = useState(false);
  const records = progress.lessons[lesson.id] || {};
  const stats = lessonStats(lesson, progress);
  const reviewActivities = useMemo(
    () =>
      lesson.activities.filter((activity) => {
        const record = records[activity.id];
        return record?.attempted && (!record.correct || record.solutionViewed);
      }),
    [lesson.activities, records]
  );
  const activeList = reviewOnly && reviewActivities.length > 0 ? reviewActivities : lesson.activities;
  const activity = activeList[Math.min(index, activeList.length - 1)];
  const potentialXp = lesson.activities.filter((item) => !records[item.id]?.xpAwarded).length *
    appConfig.xpPerActivity;

  useEffect(() => {
    setProgress((current) => ({ ...current, lastVisitedLesson: lesson.id }));
  }, [lesson.id, setProgress]);

  function recordActivity(activityItem: Activity, correct: boolean, solutionViewed: boolean) {
    setProgress((current) => {
      const lessonRecords = current.lessons[lesson.id] || {};
      const previous = lessonRecords[activityItem.id] || defaultActivityResult();
      const shouldAwardXp = correct && !solutionViewed && !previous.xpAwarded;
      const today = todayKey();
      const streak = computeStreak(current.streak, current.lastStudyDate, today);

      return {
        ...current,
        xp: current.xp + (shouldAwardXp ? appConfig.xpPerActivity : 0),
        streak,
        lastStudyDate: today,
        lessons: {
          ...current.lessons,
          [lesson.id]: {
            ...lessonRecords,
            [activityItem.id]: {
              attempted: true,
              correct: previous.correct || correct,
              attempts: previous.attempts + 1,
              solutionViewed: previous.solutionViewed || solutionViewed,
              xpAwarded: previous.xpAwarded || shouldAwardXp
            }
          }
        }
      };
    });
  }

  function next() {
    setIndex((current) => Math.min(current + 1, activeList.length));
  }

  const done = index >= activeList.length;

  return (
    <Shell compact>
      <main className="grid min-h-[calc(100vh-6rem)] gap-4 xl:grid-cols-[19rem_1fr]">
        <aside className="soft-panel h-fit p-4 xl:sticky xl:top-4">
          <Link className="mb-4 inline-flex items-center gap-3 text-sm font-bold text-[var(--muted)]" href="/">
            <ArrowLeft size={16} /> Lesson map
          </Link>

          <div className="rounded-lg bg-[var(--accent-soft)] p-4">
            <p className="small-label text-[var(--accent)]">{lesson.id}</p>
            <h1 className="mt-1 text-xl font-black">{lesson.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{lesson.blurb}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--surface)_62%,var(--accent)_14%)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${stats.percent}%` }} />
            </div>
            <p className="mt-2 text-sm font-bold">
              {stats.correct} of {stats.total} complete · {stats.percent}%
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <MiniReward label="XP left" value={potentialXp} icon={<Star size={16} />} />
            <MiniReward label="Helped" value={stats.helped} icon={<Medal size={16} />} />
            <MiniReward label="Review" value={reviewActivities.length} icon={<RotateCcw size={16} />} />
          </div>

          <nav className="mt-5 grid gap-3" aria-label="Lesson activities">
            {lesson.activities.map((item, itemIndex) => {
              const record = records[item.id];
              const isCurrent = !reviewOnly && itemIndex === index;
              return (
                <button
                  key={item.id}
                  className={`grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition hover:border-[var(--accent)] ${
                    isCurrent
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--border)] bg-[var(--surface)]"
                  }`}
                  type="button"
                  onClick={() => {
                    setReviewOnly(false);
                    setIndex(itemIndex);
                  }}
                >
                  <ActivityStatus
                    complete={Boolean(record?.correct)}
                    helped={Boolean(record?.solutionViewed)}
                    current={isCurrent}
                    number={itemIndex + 1}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black">{kindLabel(item.kind)}</span>
                    <span className="block truncate text-xs text-[var(--muted)]">
                      {record?.correct ? "Completed" : record?.attempted ? "Needs review" : "Ready"}
                    </span>
                  </span>
                  {record?.correct ? <CheckCircle2 size={17} color="var(--good)" /> : <Circle size={15} />}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="grid gap-4">
          <div className="soft-panel p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="small-label text-[var(--blue)]">
                  {reviewOnly ? "Review mode" : "Guided practice"}
                </p>
                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  {done
                    ? "Lesson summary"
                    : `Activity ${index + 1}: ${kindLabel(activity.kind)}`}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <HeaderMetric label="Progress" value={`${stats.percent}%`} icon={<Sparkles size={17} />} />
                <HeaderMetric label="Streak" value={`${progress.streak}`} icon={<Flame size={17} />} />
                <HeaderMetric label="Reward" value={`+${appConfig.xpPerActivity}`} icon={<Star size={17} />} />
              </div>
            </div>
          </div>

          {done ? (
            <div className="activity-shell grid min-h-[30rem] place-items-center p-6 text-center">
              <div>
                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-[var(--gold-soft)] text-[var(--gold)]">
                  <Trophy size={44} />
                </div>
                <h2 className="text-3xl font-black">Lesson complete</h2>
                <p className="mx-auto mt-2 max-w-xl text-[var(--muted)]">
                  You completed {stats.correct} activities. {stats.helped} were
                  completed with a model answer viewed.
                </p>
                <div className="control-row center mt-6">
                  <Link className="button primary" href="/">
                    Back to map
                  </Link>
                  <button
                    className="button"
                    type="button"
                    disabled={reviewActivities.length === 0}
                    onClick={() => {
                      setReviewOnly(true);
                      setIndex(0);
                    }}
                  >
                    Review mistakes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ActivityRenderer
              key={activity.id}
              activity={activity}
              lesson={lesson}
              position={index + 1}
              total={activeList.length}
              onComplete={(correct, solutionViewed) => {
                recordActivity(activity, correct, solutionViewed);
              }}
              onNext={next}
            />
          )}
        </section>
      </main>
    </Shell>
  );
}

function ActivityStatus({
  complete,
  helped,
  current,
  number
}: {
  complete: boolean;
  helped: boolean;
  current: boolean;
  number: number;
}) {
  const className = complete ? "complete" : helped ? "helped" : current ? "current" : "";
  return <span className={`status-dot ${className}`}>{complete ? "✓" : number}</span>;
}

function MiniReward({
  label,
  value,
  icon
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="reward-panel p-2 text-center">
      <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-full bg-[var(--surface)] text-[var(--gold)]">
        {icon}
      </div>
      <div className="text-lg font-black">{value}</div>
      <div className="text-[0.7rem] font-bold text-[var(--muted)]">{label}</div>
    </div>
  );
}

function HeaderMetric({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
      <div className="flex items-center gap-1 text-[var(--gold)]">{icon}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
      <div className="text-xs font-bold text-[var(--muted)]">{label}</div>
    </div>
  );
}

function kindLabel(kind: Activity["kind"]) {
  return (
    {
      mcq: "Question",
      fillGaps: "Fill gaps",
      orderLines: "Order lines",
      matching: "Match ideas",
      predictOutput: "Predict output",
      traceTable: "Trace table",
      shortAnswer: "Short answer",
      fixCode: "Fix code",
      writeCode: "Write code"
    } satisfies Record<Activity["kind"], string>
  )[kind];
}
