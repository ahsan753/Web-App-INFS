"use client";

import { appConfig } from "@/lib/config";
import type { ActivityResult, Lesson, ProgressState } from "@/lib/types";

const key = `${appConfig.storagePrefix}progress`;

export function createEmptyProgress(): ProgressState {
  return {
    schemaVersion: appConfig.schemaVersion,
    contentVersion: appConfig.contentVersion,
    xp: 0,
    streak: 0,
    theme: "light",
    lessons: {}
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return createEmptyProgress();
  const raw = window.localStorage.getItem(key);
  if (!raw) return createEmptyProgress();
  try {
    const parsed = JSON.parse(raw) as ProgressState;
    if (parsed.schemaVersion !== appConfig.schemaVersion) {
      return createEmptyProgress();
    }
    return { ...createEmptyProgress(), ...parsed };
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(progress: ProgressState) {
  window.localStorage.setItem(key, JSON.stringify(progress));
}

export function clearProgress() {
  window.localStorage.removeItem(key);
}

export function defaultActivityResult(): ActivityResult {
  return {
    attempted: false,
    correct: false,
    attempts: 0,
    solutionViewed: false,
    xpAwarded: false
  };
}

export function lessonStats(lesson: Lesson, progress: ProgressState) {
  const records = progress.lessons[lesson.id] || {};
  const total = lesson.activities.length;
  const correct = lesson.activities.filter(
    (activity) => records[activity.id]?.correct
  ).length;
  const helped = lesson.activities.filter(
    (activity) => records[activity.id]?.solutionViewed
  ).length;
  const attempted = lesson.activities.filter(
    (activity) => records[activity.id]?.attempted
  ).length;

  return {
    total,
    correct,
    helped,
    attempted,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100)
  };
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function previousDayKey(dayKey: string) {
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function computeStreak(
  previousStreak: number,
  lastStudyDate: string | undefined,
  today: string
) {
  if (lastStudyDate === today) {
    return Math.max(1, previousStreak);
  }
  if (lastStudyDate && lastStudyDate === previousDayKey(today)) {
    return previousStreak + 1;
  }
  return 1;
}
