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
import { useState } from "react";
import { runPythonActivity } from "@/lib/pythonRunner";
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

  function finish(correct: boolean, message: string) {
    setState({ checked: true, correct, message });
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
              <div
                className="mt-3 rounded-lg border p-3 text-sm"
                style={{
                  borderColor: state.correct ? "var(--good)" : "var(--bad)",
                  background: state.correct ? "var(--good-soft)" : "var(--bad-soft)"
                }}
              >
                {activity.explanation}
              </div>
              {activity.commonMistake && (
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
  const options = activity.options || activity.codeOptions || [];

  function toggle(index: number) {
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
    const correct =
      selected.length === activity.correctIndexes.length &&
      selected.every((item) => activity.correctIndexes.includes(item));
    finish(correct, correct ? "You selected the right option." : "Look again at each option.");
  }

  return (
    <div>
      <div className="grid gap-3">
        {options.map((option, index) => (
          <label
            className={`answer-tile ${selected.includes(index) ? "selected" : ""}`}
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

  function check() {
    const correct = activity.gaps.every((gap) => {
      const answer = answers[gap.id] || "";
      return gap.accepted.some((accepted) => same(answer, accepted, gap.caseSensitive));
    });
    finish(correct, correct ? "Every gap matches." : "One or more gaps needs another look.");
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
            <input
              aria-label={`Gap ${id}`}
              className="mx-1 w-32 rounded border border-[var(--accent)] bg-[var(--surface)] px-2 py-1 font-bold text-[var(--text)]"
              key={part}
              value={answers[id] || ""}
              onChange={(event) => setAnswers({ ...answers, [id]: event.target.value })}
            />
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
  const rightOptions = activity.pairs.map((pair) => pair.right);

  function check() {
    const correct = activity.pairs.every((pair) => answers[pair.left] === pair.right);
    finish(correct, correct ? "Every item matches." : "At least one match is in the wrong bucket.");
  }

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-[var(--muted)]">
        Choose the best match for each item.
      </p>
      <div className="grid gap-3">
        {activity.pairs.map((pair) => (
          <label className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] sm:grid-cols-[1fr_14rem] sm:items-center" key={pair.left}>
            <span className="font-bold">{pair.left}</span>
            <select
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-2 font-bold"
              value={answers[pair.left] || ""}
              onChange={(event) => setAnswers({ ...answers, [pair.left]: event.target.value })}
            >
              <option value="">Choose</option>
              {rightOptions.map((option, optionIndex) => (
                <option key={`${option}-${optionIndex}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
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

  function check() {
    const correct = activity.rows.every((row, rowIndex) =>
      row.every((cell, colIndex) => same(answers[`${rowIndex}-${colIndex}`] || "", String(cell), true))
    );
    finish(correct, correct ? "The trace table is correct." : "Trace one line at a time and update the changed value.");
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
                  <td className="border-b border-[var(--border)] p-2" key={colIndex}>
                    <input
                      aria-label={`Row ${rowIndex + 1}, ${activity.columns[colIndex]}`}
                      className="w-full rounded border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-1"
                      value={answers[`${rowIndex}-${colIndex}`] || ""}
                      onChange={(event) =>
                        setAnswers({ ...answers, [`${rowIndex}-${colIndex}`]: event.target.value })
                      }
                    />
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
      <div className="mb-3 flex items-center gap-3 text-sm font-bold text-[var(--muted)]">
        <AlertCircle size={16} /> Edit the smallest part that fixes the bug.
      </div>
      <textarea className="code-editor" value={answer} onChange={(event) => setAnswer(event.target.value)} />
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
  const [report, setReport] = useState<string[]>([]);

  async function check() {
    setRunning(true);
    setReport(["Loading Python if needed. This can take a moment the first time."]);
    const result = await runPythonActivity(activity, source, lesson.number);
    setRunning(false);
    const messages = [
      ...(result.loadError ? [result.loadError] : []),
      ...result.standards.messages.map((message) => message.message),
      ...result.tests.map((test, index) =>
        test.passed
          ? `Test ${index + 1} passed.`
          : `Test ${index + 1} expected ${String(test.expected)}, got ${String(test.actual)}.`
      )
    ];
    setReport(messages);
    finish(
      result.ok,
      result.ok
        ? "Your code passed the checks."
        : "The checker found something to improve. Read the report below."
    );
    if (solutionViewed) setSolutionViewed(true);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-[var(--muted)]">Python workspace</p>
        <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-black text-[var(--accent)]">
          Runs in browser
        </span>
      </div>
      <textarea
        className="code-editor"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        spellCheck={false}
      />
      <div className="control-row mt-4">
        <button className="button primary" type="button" onClick={check} disabled={running}>
          <Play size={18} /> {running ? "Running" : "Run checks"}
        </button>
      </div>
      {report.length > 0 && (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm">
          {report.map((line, lineIndex) => (
            <p key={`${line}-${lineIndex}`}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
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
