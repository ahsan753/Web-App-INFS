import assert from "node:assert/strict";
import { test } from "node:test";
import { computeStreak, previousDayKey } from "../src/lib/progress";

test("previousDayKey returns the day before, across boundaries", () => {
  assert.equal(previousDayKey("2026-06-16"), "2026-06-15");
  assert.equal(previousDayKey("2026-01-01"), "2025-12-31");
  assert.equal(previousDayKey("2026-03-01"), "2026-02-28");
  assert.equal(previousDayKey("2024-03-01"), "2024-02-29");
});

test("streak starts at 1 on the first day of study", () => {
  assert.equal(computeStreak(0, undefined, "2026-06-16"), 1);
});

test("streak is unchanged when studying again the same day", () => {
  assert.equal(computeStreak(5, "2026-06-16", "2026-06-16"), 5);
});

test("streak increments after a consecutive day", () => {
  assert.equal(computeStreak(5, "2026-06-15", "2026-06-16"), 6);
});

test("streak resets to 1 after a missed day", () => {
  assert.equal(computeStreak(5, "2026-06-13", "2026-06-16"), 1);
});
