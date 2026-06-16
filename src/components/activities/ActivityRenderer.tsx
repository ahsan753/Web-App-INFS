"use client";

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  Eye,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  XCircle
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { CodeEditor, type LineFocusRequest } from "@/components/activities/CodeEditor";
import { getCoachingMessage } from "@/lib/coachingMessages";
import { runPythonActivity } from "@/lib/pythonRunner";
import type { WorkerResult } from "@/lib/pythonRunner";
import type {
  Activity,
  FillGaps,
  FixCode,
  Lesson,
  Matching,
  MultipleChoice,
  OrderLines,
  PredictOutput,
  ShortAnswer,
  TraceTable,
  WriteCode
} from "@/lib/types";

type Props = {
  activity: Activity;
  lesson: Lesson;
  position: number;
  total: number;
  onComplete: (correct: boolean, solutionViewed: boolean) => void;
  onNext: () => void;
};

type CheckState = {
  checked: boolean;
  correct: boolean;
  message: string;
};

export function ActivityRenderer({
  activity,
  lesson,
  position,
  total,
  onComplete,
  onNext
}: Props) {
  const [state, setState] = useState<CheckState>({
    checked: false,
    correct: false,
    message: ""
  });
  const [solutionViewed, setSolutionViewed] = useState(false);
  const [failedChecks, setFailedChecks] = useState(0);
  const [revealedHintCount, setRevealedHintCount] = useState(0);
  const hints = (activity.hints || []).map((hint) => hint.trim()).filter(Boolean);
  const shownHints = hints.slice(0, revealedHintCount);

  function finish(correct: boolean, message: string) {
    setState({ checked: true, correct, message });
    if (!correct) {
      setFailedChecks((current) => current + 1);
    }
    onComplete(correct, solutionViewed);
  }

  function tryAgain() {
    setState({ checked: false, correct: false, message: "" });
  }

  return (
    <article className="activity-shell overflow-hidden">
      <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="small-label text-[var(--accent)]">
              Step {position} of {total} · {kindName(activity.kind)}
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight">{activity.prompt}</h2>
            {activity.inlineCodeRefs && (
              <div className="mt-3 flex flex-wrap gap-3">
                {activity.inlineCodeRefs.map((ref) => (
                  <code className="chip" key={ref}>
                    {ref}
                  </code>
                ))}
              </div>
            )}
          </div>
          <div className="min-w-44">
            <div className="mb-1 flex justify-between text-xs font-bold text-[var(--muted)]">
              <span>Lesson progress</span>
              <span>{Math.round((position / total) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--gold))]"
                style={{ width: `${Math.round((position / total) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          {activity.displayCode && <pre className="code-block mb-4">{activity.displayCode}</pre>}
          {activity.kind === "mcq" && <Mcq activity={activity} finish={finish} />}
          {activity.kind === "fillGaps" && <FillGapsView activity={activity} finish={finish} />}
          {activity.kind === "orderLines" && <OrderLinesView activity={activity} finish={finish} />}
          {activity.kind === "matching" && <MatchingView activity={activity} finish={finish} />}
          {activity.kind === "predictOutput" && <PredictOutputView activity={activity} finish={finish} />}
          {activity.kind === "traceTable" && <TraceTableView activity={activity} finish={finish} />}
          {activity.kind === "shortAnswer" && <ShortAnswerView activity={activity} finish={finish} />}
          {activity.kind === "fixCode" && <FixCodeView activity={activity} finish={finish} />}
          {activity.kind === "writeCode" && (
            <WriteCodeView
              activity={activity}
              lesson={lesson}
              finish={finish}
              solutionViewed={solutionViewed}
              setSolutionViewed={setSolutionViewed}
            />
          )}
          <div className="bottom-actions">
            {state.checked && !state.correct && (
              <button className="button" type="button" onClick={tryAgain}>
                <RotateCcw size={18} /> Try again
              </button>
            )}
            <button
              className="button primary"
              type="button"
              disabled={!state.checked}
              onClick={onNext}
            >
              {state.correct ? "Next activity" : "Next"}
              <ArrowDown className="-rotate-90" size={18} />
            </button>
          </div>
        </div>
        <aside className="coaching-panel h-fit p-4" aria-live="polite">
          <div className="flex items-center gap-3">
            {state.checked ? (
              state.correct ? (
                <CheckCircle2 size={22} color="var(--good)" />
              ) : (
                <XCircle size={22} color="var(--bad)" />
              )
            ) : (
              <Lightbulb size={22} color="var(--gold)" />
            )}
            <h3 className="font-black">
              {state.checked ? (state.correct ? "Nice work" : "Coach tip") : "Before you check"}
            </h3>
          </div>
          {state.checked ? (
            <>
              <p className="mt-3 text-sm font-bold">{state.message}</p>
              {state.correct ? (
                <div
                  className="mt-3 rounded-lg border p-3 text-sm"
                  style={{
                    borderColor: "var(--good)",
                    background: "var(--good-soft)"
                  }}
                >
                  {activity.explanation}
                </div>
              ) : (
                <p className="mt-3 rounded-lg border border-[var(--bad)] bg-[var(--bad-soft)] p-3 text-sm">
                  Use the marked item or checker report to make one small change, then check again.
                </p>
              )}
              {!state.correct && failedChecks >= 2 && activity.commonMistake && (
                <p className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--gold)_45%,var(--border))] bg-[var(--gold-soft)] p-3 text-sm text-[var(--warn)]">
                  {activity.commonMistake}
                </p>
              )}
            </>
          ) : (
            <div className="mt-3 grid gap-3 text-sm text-[var(--muted)]">
              <p>Answer the current step, then use Check for instant feedback.</p>
              <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                Focus on one idea. You can try again without losing progress.
              </p>
            </div>
          )}
          {shownHints.length > 0 && (
            <div className="mt-4 grid gap-2">
              <p className="text-sm font-black">Hints</p>
              {shownHints.map((hint, index) => (
                <p
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--muted)]"
                  key={`${activity.id}-hint-${index}`}
                >
                  {hint}
                </p>
              ))}
            </div>
          )}
          {revealedHintCount < hints.length && (
            <button
              className="button mt-4 w-full"
              type="button"
              onClick={() => {
                setRevealedHintCount((current) => Math.min(current + 1, hints.length));
              }}
            >
              <Lightbulb size={18} /> {revealedHintCount === 0 ? "Show a hint" : "Show another hint"}
            </button>
          )}
          {activity.kind === "writeCode" && (
            <button
              className="button mt-4 w-full"
              type="button"
              onClick={() => {
                setSolutionViewed(true);
              }}
            >
              <Eye size={18} /> Show a model answer
            </button>
          )}
          {activity.kind === "writeCode" && solutionViewed && (
            <div className="mt-4">
              <p className="mb-3 flex items-center gap-3 text-sm font-bold">
                <Sparkles size={16} color="var(--gold)" /> One way to write this
              </p>
              <pre className="code-block">{activity.sampleSolution}</pre>
              <p className="mt-2 text-xs text-[var(--muted)]">
                This activity can still be completed, but it will not award XP.
              </p>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

function Mcq({
  activity,
  finish
}: {
  activity: MultipleChoice;
  finish: (correct: boolean, message: string) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [marks, setMarks] = useState<Record<number, boolean | undefined>>({});
  const options = activity.options || activity.codeOptions || [];

  function toggle(index: number) {
    setMarks({});
    setSelected((current) => {
      if (activity.multi) {
        return current.includes(index)
          ? current.filter((item) => item !== index)
          : [...current, index];
      }
      return [index];
    });
  }

  function check() {
    const correct = activity.multi
      ? sameIndexSet(selected, activity.correctIndexes)
      : selected.length === 1 && activity.correctIndexes.includes(selected[0]);
    const nextMarks: Record<number, boolean | undefined> = {};

    if (activity.multi) {
      selected.forEach((index) => {
        nextMarks[index] = activity.correctIndexes.includes(index);
      });
    } else if (selected.length === 1) {
      nextMarks[selected[0]] = correct;
    }

    setMarks(nextMarks);
    finish(correct, correct ? "You selected the right option." : mcqSummary(activity, selected));
  }

  return (
    <div>
      <div className="grid gap-3">
        {options.map((option, index) => (
          <label
            className={`answer-tile ${selected.includes(index) ? "selected" : ""} ${markClass(marks[index])}`}
            key={`${option}-${index}`}
          >
            <input
              className="h-5 w-5 accent-[var(--accent)]"
              checked={selected.includes(index)}
              type={activity.multi ? "checkbox" : "radio"}
              name={activity.id}
              onChange={() => toggle(index)}
            />
            {activity.codeOptions ? (
              <code className="text-base font-bold">{option}</code>
            ) : (
              <span className="font-bold">{option}</span>
            )}
            <ItemMark correct={marks[index]} label={`Option ${index + 1}`} />
          </label>
        ))}
      </div>
      <CheckButton onClick={check} disabled={selected.length === 0} />
    </div>
  );
}

function FillGapsView({
  activity,
  finish
}: {
  activity: FillGaps;
  finish: (correct: boolean, message: string) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marks, setMarks] = useState<Record<number, boolean | undefined>>({});

  function check() {
    const nextMarks = Object.fromEntries(
      activity.gaps.map((gap) => {
        const answer = answers[gap.id] || "";
        const gapCorrect = gap.accepted.some((accepted) => same(answer, accepted, gap.caseSensitive));
        return [gap.id, gapCorrect];
      })
    );
    const correct = activity.gaps.every((gap) => nextMarks[gap.id]);
    const correctCount = activity.gaps.filter((gap) => nextMarks[gap.id]).length;
    setMarks(nextMarks);
    finish(
      correct,
      correct
        ? "Every gap matches."
        : `${correctCount} of ${activity.gaps.length} gaps correct — the ones in red need another look.`
    );
  }

  const parts = activity.template.split(/(\{\{\d+\}\})/g);

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-[var(--muted)]">
        Type into each blank, then check the completed line.
      </p>
      <div className="code-block whitespace-pre-wrap">
        {parts.map((part) => {
          const match = part.match(/\{\{(\d+)\}\}/);
          if (!match) return <span key={part}>{part}</span>;
          const id = Number(match[1]);
          return (
            <span className="inline-flex items-center gap-1" key={part}>
              <input
                aria-label={`Gap ${id}`}
                className={`mx-1 w-32 rounded border bg-[var(--surface)] px-2 py-1 font-bold text-[var(--text)] ${inputMarkClass(marks[id], "border-[var(--accent)]")}`}
                value={answers[id] || ""}
                onChange={(event) => {
                  setAnswers({ ...answers, [id]: event.target.value });
                  setMarks(({ [id]: _changed, ...rest }) => rest);
                }}
              />
              <ItemMark correct={marks[id]} label={`Gap ${id}`} />
            </span>
          );
        })}
      </div>
      <CheckButton onClick={check} />
    </div>
  );
}

function OrderLinesView({
  activity,
  finish
}: {
  activity: OrderLines;
  finish: (correct: boolean, message: string) => void;
}) {
  const [lines, setLines] = useState(() => [...activity.lines].reverse());

  function move(index: number, offset: number) {
    const next = [...lines];
    const target = index + offset;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setLines(next);
  }

  function check() {
    const correct = lines.every((line, index) => line === activity.lines[index]);
    finish(correct, correct ? "The order is right." : "Use the move buttons to adjust the order.");
  }

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-[var(--muted)]">
        Use the arrows to arrange the code into the correct sequence.
      </p>
      <ol className="grid gap-3">
        {lines.map((line, index) => (
          <li className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] sm:grid-cols-[2rem_1fr_auto_auto]" key={`${line}-${index}`}>
            <span className="status-dot">{index + 1}</span>
            <code className="flex-1 whitespace-pre-wrap">{line}</code>
            <span className="icon-button-row col-span-3 justify-end sm:col-span-1 sm:justify-start">
              <button className="button ghost icon-only compact" type="button" onClick={() => move(index, -1)}>
                <ArrowUp size={16} />
                <span className="sr-only">Move up</span>
              </button>
              <button className="button ghost icon-only compact" type="button" onClick={() => move(index, 1)}>
                <ArrowDown size={16} />
                <span className="sr-only">Move down</span>
              </button>
            </span>
          </li>
        ))}
      </ol>
      <CheckButton onClick={check} />
    </div>
  );
}

function MatchingView({
  activity,
  finish
}: {
  activity: Matching;
  finish: (correct: boolean, message: string) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<Record<string, boolean | undefined>>({});
  const rightOptions = activity.pairs.map((pair) => pair.right);

  function check() {
    const nextMarks = Object.fromEntries(
      activity.pairs.map((pair) => [pair.left, answers[pair.left] === pair.right])
    );
    const correct = activity.pairs.every((pair) => nextMarks[pair.left]);
    const correctCount = activity.pairs.filter((pair) => nextMarks[pair.left]).length;
    setMarks(nextMarks);
    finish(
      correct,
      correct
        ? "Every item matches."
        : `${correctCount} of ${activity.pairs.length} matches correct — the rows in red need another look.`
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-[var(--muted)]">
        Choose the best match for each item.
      </p>
      <div className="grid gap-3">
        {activity.pairs.map((pair) => (
          <label className={`grid gap-3 rounded-lg border bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] sm:grid-cols-[1fr_14rem_auto] sm:items-center ${inputMarkClass(marks[pair.left], "border-[var(--border)]")}`} key={pair.left}>
            <span className="font-bold">{pair.left}</span>
            <select
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-2 font-bold"
              value={answers[pair.left] || ""}
              onChange={(event) => {
                setAnswers({ ...answers, [pair.left]: event.target.value });
                setMarks(({ [pair.left]: _changed, ...rest }) => rest);
              }}
            >
              <option value="">Choose</option>
              {rightOptions.map((option, optionIndex) => (
                <option key={`${option}-${optionIndex}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ItemMark correct={marks[pair.left]} label={pair.left} />
          </label>
        ))}
      </div>
      <CheckButton onClick={check} />
    </div>
  );
}

function PredictOutputView({
  activity,
  finish
}: {
  activity: PredictOutput;
  finish: (correct: boolean, message: string) => void;
}) {
  const [answer, setAnswer] = useState("");

  function check() {
    const expected = activity.expectedStdout || activity.expectedError?.type || "";
    const correct = same(answer, expected, true);
    finish(correct, correct ? "Your prediction matches." : "Compare your answer with the code path.");
  }

  return (
    <div>
      <pre className="code-block mb-3">{activity.code}</pre>
      <textarea
        className="min-h-28 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3"
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Type the output or error type"
      />
      <CheckButton onClick={check} disabled={!answer.trim()} />
    </div>
  );
}

function TraceTableView({
  activity,
  finish
}: {
  activity: TraceTable;
  finish: (correct: boolean, message: string) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<Record<string, boolean | undefined>>({});

  function check() {
    const nextMarks: Record<string, boolean> = {};
    activity.rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        nextMarks[key] = same(answers[key] || "", String(cell), true);
      });
    });
    const correct = activity.rows.every((row, rowIndex) =>
      row.every((_, colIndex) => nextMarks[`${rowIndex}-${colIndex}`])
    );
    const totalCells = activity.rows.length * activity.columns.length;
    const correctCount = Object.values(nextMarks).filter(Boolean).length;
    setMarks(nextMarks);
    finish(
      correct,
      correct
        ? "The trace table is correct."
        : `${correctCount} of ${totalCells} cells correct — the ones in red need another look.`
    );
  }

  return (
    <div>
      <pre className="code-block mb-4">{activity.code}</pre>
      <p className="mb-3 text-sm font-bold text-[var(--muted)]">
        Fill one row per step. Leave a cell blank if the variable has no value yet.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg border border-[var(--border)] text-sm">
          <thead>
            <tr>
              {activity.columns.map((column) => (
                <th className="border-b border-[var(--border)] bg-[var(--surface-strong)] p-2 text-left" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activity.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((_, colIndex) => (
                  <td className={`border-b border-[var(--border)] p-2 ${cellMarkClass(marks[`${rowIndex}-${colIndex}`])}`} key={colIndex}>
                    <input
                      aria-label={`Row ${rowIndex + 1}, ${activity.columns[colIndex]}`}
                      className={`w-full rounded border bg-[var(--surface-soft)] px-2 py-1 ${inputMarkClass(marks[`${rowIndex}-${colIndex}`], "border-[var(--border)]")}`}
                      value={answers[`${rowIndex}-${colIndex}`] || ""}
                      onChange={(event) => {
                        const key = `${rowIndex}-${colIndex}`;
                        setAnswers({ ...answers, [key]: event.target.value });
                        setMarks(({ [key]: _changed, ...rest }) => rest);
                      }}
                    />
                    <div className="mt-1 flex justify-end">
                      <ItemMark
                        correct={marks[`${rowIndex}-${colIndex}`]}
                        label={`Row ${rowIndex + 1}, ${activity.columns[colIndex]}`}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CheckButton onClick={check} />
    </div>
  );
}

function ShortAnswerView({
  activity,
  finish
}: {
  activity: ShortAnswer;
  finish: (correct: boolean, message: string) => void;
}) {
  const [answer, setAnswer] = useState("");

  function check() {
    const caseSensitive = activity.caseSensitive ?? activity.expectedAnswerIsCode;
    const correct = activity.accepted.some((accepted) =>
      answerMatches(answer, accepted, activity.expectedAnswerIsCode, caseSensitive)
    );
    finish(correct, correct ? "That answer works." : "Check spelling, spacing, or the requested expression.");
  }

  return (
    <div>
      <input
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-lg font-bold"
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Type your answer"
      />
      <CheckButton onClick={check} disabled={!answer.trim()} />
    </div>
  );
}

function FixCodeView({
  activity,
  finish
}: {
  activity: FixCode;
  finish: (correct: boolean, message: string) => void;
}) {
  const [answer, setAnswer] = useState(activity.brokenCode);

  function check() {
    const target = normalise(answer);
    const accepted = [activity.fixedCode, ...(activity.acceptedFixes || [])];
    const correct = accepted.some((option) => normalise(option) === target);
    finish(correct, correct ? "That is a correct fix." : "Look for the smallest change that fixes the bug.");
  }

  return (
    <div>
      <TaskBriefCard activity={activity} />
      <FixFailureBanner activity={activity} />
      <div className="mb-3 flex items-center gap-3 text-sm font-bold text-[var(--muted)]">
        <AlertCircle size={16} /> Edit the smallest part that fixes the bug.
      </div>
      <CodeEditor value={answer} onChange={setAnswer} ariaLabel="Fix the Python code" />
      <CheckButton onClick={check} />
    </div>
  );
}

function WriteCodeView({
  activity,
  lesson,
  finish,
  solutionViewed,
  setSolutionViewed
}: {
  activity: WriteCode;
  lesson: Lesson;
  finish: (correct: boolean, message: string) => void;
  solutionViewed: boolean;
  setSolutionViewed: (value: boolean) => void;
}) {
  const [source, setSource] = useState(activity.starterCode || "");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<WorkerResult | null>(null);
  const [lineFocus, setLineFocus] = useState<LineFocusRequest | null>(null);

  function focusEditorLine(line: number) {
    setLineFocus((current) => ({
      line,
      token: (current?.token ?? 0) + 1
    }));
  }

  async function check() {
    setRunning(true);
    setResult(null);
    const nextResult = await runPythonActivity(activity, source, lesson.number);
    setRunning(false);
    setResult(nextResult);
    finish(
      nextResult.ok,
      nextResult.ok
        ? "Your code passed the checks."
        : "The checker found something to improve. Read the report below."
    );
    if (solutionViewed) setSolutionViewed(true);
  }

  return (
    <div>
      <TaskBriefCard activity={activity} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-[var(--muted)]">Python workspace</p>
        <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-black text-[var(--accent)]">
          Runs in browser
        </span>
      </div>
      <CodeEditor
        value={source}
        onChange={setSource}
        ariaLabel="Write Python code"
        lineFocus={lineFocus}
      />
      <div className="control-row mt-4">
        <button className="button primary" type="button" onClick={check} disabled={running}>
          <Play size={18} /> {running ? "Running" : "Run checks"}
        </button>
      </div>
      {(running || result) && (
        <PythonCheckReport result={result} running={running} onLineClick={focusEditorLine} />
      )}
    </div>
  );
}

type WorkedExample = {
  summary: ReactNode;
  input?: string;
  output: string;
  outputLabel: string;
  note?: string;
};

function TaskBriefCard({ activity }: { activity: WriteCode | FixCode }) {
  const workedExample = getWorkedExample(activity);

  return (
    <section className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-soft)]">
      <p className="small-label text-[var(--accent)]">What to build</p>
      <div className="mt-2 grid gap-2 text-sm">
        <p>
          <span className="font-black">Goal: </span>
          {activity.taskGoal || activity.prompt}
        </p>
        {activity.reads && (
          <p>
            <span className="font-black">Reads: </span>
            {activity.reads}
          </p>
        )}
        {activity.produces && (
          <p>
            <span className="font-black">Produces: </span>
            {activity.produces}
          </p>
        )}
      </div>
      {workedExample && <WorkedExamplePanel example={workedExample} />}
    </section>
  );
}

function WorkedExamplePanel({ example }: { example: WorkedExample }) {
  return (
    <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm">
      <p className="mb-2 font-black">Worked example</p>
      <p className="text-[var(--muted)]">{example.summary}</p>
      <div className={`mt-3 grid gap-3 ${example.input ? "sm:grid-cols-2" : ""}`}>
        {example.input && (
          <div>
            <p className="mb-1 text-xs font-black uppercase text-[var(--muted)]">Input</p>
            <pre className="code-block border-[var(--border)] bg-[var(--code-bg)] p-2 text-xs">
              {example.input}
            </pre>
          </div>
        )}
        <div>
          <p className="mb-1 text-xs font-black uppercase text-[var(--muted)]">
            {example.outputLabel}
          </p>
          <pre className="code-block border-[var(--border)] bg-[var(--code-bg)] p-2 text-xs">
            {example.output}
          </pre>
        </div>
      </div>
      {example.note && <p className="mt-2 text-xs text-[var(--muted)]">{example.note}</p>}
    </div>
  );
}

function FixFailureBanner({ activity }: { activity: FixCode }) {
  const failureText = activity.expectedErrorType
    ? `It currently fails with ${activity.expectedErrorType}.`
    : "It currently does not meet the goal.";

  return (
    <div className="mb-4 rounded-lg border border-[var(--bad)] bg-[var(--bad-soft)] p-3 text-sm">
      <p className="flex items-center gap-2 font-black text-[var(--bad)]">
        <AlertCircle size={17} aria-hidden="true" /> It currently fails with...
      </p>
      <p className="mt-1">{failureText}</p>
    </div>
  );
}

function getWorkedExample(activity: WriteCode | FixCode): WorkedExample | null {
  if (activity.example) {
    return {
      summary: "Use this example to check the shape of your answer.",
      input: activity.example.input,
      output: activity.example.output,
      outputLabel:
        (activity.kind === "writeCode" && activity.functionTests) ||
        (activity.kind === "fixCode" && activity.fixedCode.trimStart().startsWith("def "))
          ? "Return value"
          : "Output",
      note: activity.example.note
    };
  }

  if (activity.kind !== "writeCode") return null;

  const firstProgramTest = activity.programTests?.[0];
  if (firstProgramTest) {
    const input = firstProgramTest.stdin.join("\n");
    return {
      summary:
        firstProgramTest.stdin.length > 1
          ? "If the input has these lines, the program prints this output."
          : "If the input is this value, the program prints this output.",
      input,
      output: firstProgramTest.expectedStdout,
      outputLabel: "Output"
    };
  }

  const firstFunctionTest = activity.functionTests?.[0];
  const firstCase = firstFunctionTest?.cases[0];
  if (firstFunctionTest && firstCase) {
    const call = `${firstFunctionTest.functionName}(${firstCase.args.map(formatPythonValue).join(", ")})`;
    return {
      summary: (
        <>
          <code>{call}</code> returns this value.
        </>
      ),
      output: describeFunctionExpected(firstCase),
      outputLabel: "Return value"
    };
  }

  return null;
}

function describeFunctionExpected(
  testCase: NonNullable<WriteCode["functionTests"]>[number]["cases"][number]
) {
  if ("expected" in testCase && testCase.expected !== undefined) {
    return formatPythonValue(testCase.expected);
  }
  if (!testCase.property) return "A value accepted by the checker.";
  if (testCase.property.type === "intInRange") {
    return `A whole number from ${testCase.property.min} to ${testCase.property.max}.`;
  }
  if (testCase.property.type === "inSet") {
    return `One of: ${testCase.property.values.map(formatPythonValue).join(", ")}.`;
  }
  return "A value that passes the checker rule.";
}

function formatPythonValue(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (value === null) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (Array.isArray(value)) return `[${value.map(formatPythonValue).join(", ")}]`;
  return String(value);
}

function PythonCheckReport({
  result,
  running,
  onLineClick
}: {
  result: WorkerResult | null;
  running: boolean;
  onLineClick?: (line: number) => void;
}) {
  if (running && !result) {
    return (
      <section className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm">
        <p className="font-bold">Loading Python if needed. This can take a moment the first time.</p>
      </section>
    );
  }

  if (!result) return null;

  const errorMessages = result.standards.messages.filter((message) => message.level === "error");
  const warningMessages = result.standards.messages.filter((message) => message.level === "warning");
  const hasContent =
    Boolean(result.loadError) ||
    errorMessages.length > 0 ||
    warningMessages.length > 0 ||
    result.tests.length > 0;

  return (
    <section className="mt-4 grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm">
      <div className="flex items-center gap-2 font-black">
        {result.ok ? (
          <CheckCircle2 size={18} color="var(--good)" aria-hidden="true" />
        ) : (
          <XCircle size={18} color="var(--bad)" aria-hidden="true" />
        )}
        <h3>{result.ok ? "Checks passed" : "Checks need attention"}</h3>
      </div>

      {!hasContent && (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          The checker did not return any tests or standards messages.
        </p>
      )}

      {result.loadError && (
        <ReportSection
          tone="bad"
          title="Load / timeout error"
          icon={<AlertCircle size={17} aria-hidden="true" />}
        >
          <p>{result.loadError}</p>
        </ReportSection>
      )}

      {errorMessages.length > 0 && (
        <ReportSection
          tone="bad"
          title="Won't run yet — fix these first"
          icon={<XCircle size={17} aria-hidden="true" />}
        >
          <ul className="grid gap-2">
            {errorMessages.map((message, index) => (
              <li key={`${message.code}-${message.message}-${index}`}>
                <StandardsMessage message={message} onLineClick={onLineClick} />
              </li>
            ))}
          </ul>
        </ReportSection>
      )}

      {warningMessages.length > 0 && (
        <ReportSection
          tone="warn"
          title="Style polish"
          subtitle="Won't fail the exercise, but loses marks in class."
          icon={<AlertCircle size={17} aria-hidden="true" />}
        >
          <ul className="grid gap-2">
            {warningMessages.map((message, index) => (
              <li key={`${message.code}-${message.message}-${index}`}>
                <StandardsMessage message={message} onLineClick={onLineClick} />
              </li>
            ))}
          </ul>
        </ReportSection>
      )}

      {result.tests.length > 0 && (
        <ReportSection
          tone={result.tests.every((test) => test.passed) ? "good" : "neutral"}
          title="Test results"
          icon={<CheckCircle2 size={17} aria-hidden="true" />}
        >
          <div className="grid gap-3">
            {result.tests.map((test, index) => (
              <TestResultItem key={`${index}-${String(test.expected)}-${String(test.actual)}`} test={test} index={index} />
            ))}
          </div>
        </ReportSection>
      )}
    </section>
  );
}

function ReportSection({
  title,
  subtitle,
  tone,
  icon,
  children
}: {
  title: string;
  subtitle?: string;
  tone: "bad" | "warn" | "good" | "neutral";
  icon: ReactNode;
  children: ReactNode;
}) {
  const styles = {
    bad: {
      border: "var(--bad)",
      background: "var(--bad-soft)",
      color: "var(--bad)"
    },
    warn: {
      border: "var(--gold)",
      background: "var(--gold-soft)",
      color: "var(--warn)"
    },
    good: {
      border: "var(--good)",
      background: "var(--good-soft)",
      color: "var(--good)"
    },
    neutral: {
      border: "var(--border)",
      background: "var(--surface)",
      color: "var(--text)"
    }
  }[tone];

  return (
    <section
      className="rounded-lg border p-3"
      style={{ borderColor: styles.border, background: styles.background }}
    >
      <div className="mb-2 flex items-start gap-2">
        <span style={{ color: styles.color }}>{icon}</span>
        <div>
          <h4 className="font-black" style={{ color: styles.color }}>
            {title}
          </h4>
          {subtitle && <p className="text-xs font-bold text-[var(--muted)]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function StandardsMessage({
  message,
  onLineClick
}: {
  message: WorkerResult["standards"]["messages"][number];
  onLineClick?: (line: number) => void;
}) {
  const lineNumber = extractLineNumber(message.message);
  const coaching = getCoachingMessage(message.code);

  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-2">
      <p className="font-bold">{message.message}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <span>Checker code: {message.code}</span>
        {lineNumber && onLineClick && (
          <button
            className="line-jump-button"
            type="button"
            onClick={() => onLineClick(lineNumber)}
          >
            Go to line {lineNumber}
          </button>
        )}
      </div>
      {coaching && (
        <div className="mt-3 grid gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-2 text-sm">
          <p>
            <span className="font-black">Why this matters: </span>
            {coaching.why}
          </p>
          <p>
            <span className="font-black">How to fix it: </span>
            {coaching.fix}
          </p>
        </div>
      )}
    </div>
  );
}

function extractLineNumber(message: string) {
  const match = message.match(/\bline\s+(\d+)\b/i);
  return match ? Number(match[1]) : null;
}

function TestResultItem({
  test,
  index
}: {
  test: WorkerResult["tests"][number];
  index: number;
}) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3">
      <div className="flex items-center gap-2 font-bold">
        {test.passed ? (
          <CheckCircle2 size={17} color="var(--good)" aria-hidden="true" />
        ) : (
          <XCircle size={17} color="var(--bad)" aria-hidden="true" />
        )}
        <p>
          Test {index + 1}: {test.passed ? "passed" : "needs another look"}
        </p>
      </div>

      {!test.passed && test.errorType && (
        <p className="mt-3 rounded-md border border-[var(--bad)] bg-[var(--bad-soft)] p-2">
          Your code raised <strong>{test.errorType}</strong>
          {test.errorMessage ? `: ${test.errorMessage}` : "."}
        </p>
      )}

      {!test.passed && !test.errorType && (
        <ExpectedActualDiff expected={test.expected} actual={test.actual} />
      )}
    </div>
  );
}

function ExpectedActualDiff({
  expected,
  actual
}: {
  expected: unknown;
  actual: unknown;
}) {
  const expectedText = stringifyForReport(expected);
  const actualText = stringifyForReport(actual);
  const firstDifferentLine = findFirstDifferentLine(expectedText, actualText);

  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      <OutputBlock label="Expected" text={expectedText} highlightLine={firstDifferentLine} />
      <OutputBlock label="Actual" text={actualText} highlightLine={firstDifferentLine} />
    </div>
  );
}

function OutputBlock({
  label,
  text,
  highlightLine
}: {
  label: string;
  text: string;
  highlightLine: number | null;
}) {
  const displayText = text.length > 0 ? text : "(empty output)";

  return (
    <div>
      <p className="mb-1 text-xs font-black uppercase text-[var(--muted)]">{label}</p>
      <pre className="code-block border-[var(--border)] bg-[var(--code-bg)] p-2 text-xs">
        {displayText.split("\n").map((line, index) => {
          const shouldHighlight = highlightLine === index;
          return (
            <span
              className={shouldHighlight ? "block rounded bg-[var(--bad-soft)] px-1 text-[var(--bad)]" : "block px-1"}
              key={`${label}-${index}-${line}`}
            >
              {line || " "}
            </span>
          );
        })}
      </pre>
    </div>
  );
}

function stringifyForReport(value: unknown) {
  if (typeof value === "string") return value;
  if (value === undefined) return "";
  if (value === null) return "None";
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function findFirstDifferentLine(left: string, right: string) {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const maxLength = Math.max(leftLines.length, rightLines.length);
  for (let index = 0; index < maxLength; index += 1) {
    if ((leftLines[index] ?? "") !== (rightLines[index] ?? "")) return index;
  }
  return null;
}

function ItemMark({
  correct,
  label
}: {
  correct: boolean | undefined;
  label: string;
}) {
  if (correct === undefined) return <span className="item-mark-spacer" aria-hidden="true" />;

  return (
    <span className={`item-mark ${correct ? "correct" : "incorrect"}`}>
      {correct ? <CheckCircle2 size={17} aria-hidden="true" /> : <XCircle size={17} aria-hidden="true" />}
      <span className="sr-only">{label} is {correct ? "correct" : "incorrect"}</span>
    </span>
  );
}

function sameIndexSet(left: number[], right: number[]) {
  if (left.length !== right.length) return false;
  return left.every((item) => right.includes(item));
}

function mcqSummary(activity: MultipleChoice, selected: number[]) {
  if (!activity.multi) return "That option is not correct. Try another one.";
  const correctSelected = selected.filter((index) => activity.correctIndexes.includes(index)).length;
  const wrongSelected = selected.length - correctSelected;
  return `${correctSelected} of ${activity.correctIndexes.length} correct options chosen, and ${wrongSelected} wrong ${wrongSelected === 1 ? "one" : "ones"} selected.`;
}

function markClass(correct: boolean | undefined) {
  if (correct === true) return "mark-correct";
  if (correct === false) return "mark-incorrect";
  return "";
}

function inputMarkClass(correct: boolean | undefined, fallback: string) {
  if (correct === true) return "border-[var(--good)] bg-[var(--good-soft)]";
  if (correct === false) return "border-[var(--bad)] bg-[var(--bad-soft)]";
  return fallback;
}

function cellMarkClass(correct: boolean | undefined) {
  if (correct === true) return "bg-[var(--good-soft)]";
  if (correct === false) return "bg-[var(--bad-soft)]";
  return "";
}

function CheckButton({
  onClick,
  disabled = false
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="button primary mt-5" type="button" onClick={onClick} disabled={disabled}>
      <Check size={18} /> Check
    </button>
  );
}

function kindName(kind: Activity["kind"]) {
  return (
    {
      mcq: "multiple choice",
      fillGaps: "fill in the gaps",
      orderLines: "ordering",
      matching: "matching",
      predictOutput: "predict the output",
      traceTable: "trace table",
      shortAnswer: "short answer",
      fixCode: "find the bug",
      writeCode: "write code"
    } satisfies Record<Activity["kind"], string>
  )[kind];
}

function same(actual: string, expected: string, caseSensitive = false) {
  const left = actual.trim();
  const right = expected.trim();
  return caseSensitive ? left === right : left.toLowerCase() === right.toLowerCase();
}

function answerMatches(
  actual: string,
  expected: string,
  isCode: boolean,
  caseSensitive = false
) {
  let left = actual;
  let right = expected;
  if (isCode) {
    // Code answers: spacing should not decide correctness, but identifier
    // case should (lower_snake_case matters), so default to case-sensitive.
    left = left.replace(/\s+/g, "");
    right = right.replace(/\s+/g, "");
  } else {
    left = left.trim();
    right = right.trim();
  }
  if (!caseSensitive) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }
  return left === right;
}

function normalise(value: string) {
  return value.trim().replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "");
}
