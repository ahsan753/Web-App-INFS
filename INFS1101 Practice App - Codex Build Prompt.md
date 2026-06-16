# Codex Build Prompt — "INFS 1101 Python Trainer"

> Copy everything inside the horizontal rules below and paste it into Codex as a
> single build prompt. It is self-contained: it carries the full curriculum,
> the allowed-skill boundaries, and the coding standards, so Codex does not need
> any other files. (You can rename the app or tweak the defaults — they are
> called out in the "Configurable defaults" section.)

---

You are an expert full-stack engineer and instructional designer. Build a
complete, polished, self-paced **practice web application** that lets a student
work through an introductory Python course (**INFS 1101**, 12 lessons) using
many different interactive activity types. Produce a finished, fully populated
app — not a skeleton.

## 1. Product summary

- **Name:** "INFS 1101 Python Trainer" (configurable in one constants file).
- **Audience:** first-year university students learning Python from scratch.
  Many are EAL (English as an additional language), so all wording must be
  clear, friendly, step-by-step, and jargon-light. Use **British English**
  spelling throughout the UI and all content (e.g. "analyse", "colour",
  "organise", "practise" as a verb).
- **Goal:** a Duolingo-style trainer where a student picks a lesson, completes a
  sequence of bite-sized activities, gets **instant feedback with explanations**,
  earns progress, and can write and **run real Python in the browser**.
- **Context flavour:** the course is at a university in Doha, Qatar. Use Qatari/
  Gulf context in examples — currency **QAR**, names like Ahmed, Fatima, Aisha,
  Mohammed, Noora, Yousef, places like Doha, Al Wakrah, university course codes
  in the format **four uppercase letters + four digits** (e.g. `INFS1101`).

## 2. Tech stack & architecture (required)

- **Next.js** with the **App Router**, plus **TypeScript** and **React**. Use the
  current stable Next.js version available when you create the project, then
  **pin exact versions** in `package.json` (no `^`/`~` floating ranges) and list
  the exact versions of Next.js, React, Tailwind, and Pyodide in the README, so
  the build is reproducible.
- **Tailwind CSS** for styling. Clean, modern, accessible, responsive (works on
  phone, tablet, laptop). Support **light and dark mode**.
- **No backend, no database, no login.** Everything runs client-side. All
  progress is stored in the browser via **`localStorage`**.
- **In-browser Python** via **Pyodide**, loaded lazily (only when a code
  activity is first opened) and run inside a **Web Worker** so the UI never
  freezes and so a student's infinite loop can be killed (see §6).
- **Pyodide asset strategy (be concrete — do not hand-wave offline):** **self-host
  Pyodide**. At build time, copy the pinned Pyodide distribution (the `.js`,
  `.wasm`, and the Python `.whl` wheels actually used) into **`public/pyodide/`**,
  load it from there using the base-path-aware URL (never a bare CDN URL, which
  cannot be reliably precached for offline), and have the service worker
  precache/runtime-cache exactly those files. If a CDN is used instead, the README
  must document precisely which URLs the service worker caches and prove offline
  works. State the exact Pyodide version in the README.
- **Offline & PWA:** implement a **service worker** (a PWA: web app manifest +
  service worker) that precaches the app shell and lesson content, and caches the
  self-hosted Pyodide files on first use. Be precise about what works when:
  **after the first app load, all non-code activities work offline; Pyodide-backed
  code activities work offline only after Pyodide has successfully loaded once
  online.** Degrade gracefully: if Pyodide is not yet cached and the user is
  offline, non-code activities must still work and code activities show a clear
  "connect once to enable code" message (see §6).
- **Static export & GitHub Pages:** structure the app so it can be built as a
  **static export** (`output: "export"` / `next build`) with no server-only
  features (no server actions, no dynamic/SSR routes, no `next/image` optimisation
  server, no middleware). **All lesson routes must be statically generated at
  build time** — use a static route like **`/lessons/L03`** with
  `generateStaticParams()` enumerating all 12 lesson ids, so every lesson is a
  pre-rendered HTML file that deep-links and survives a hard refresh. No
  runtime-only dynamic route may be assumed. Because teachers may host it on a
  GitHub Pages project subpath, make the base path configurable: read `basePath`
  and `assetPrefix` from an env var (e.g. `NEXT_PUBLIC_BASE_PATH`), and make
  **all asset, worker, service worker, manifest, and Pyodide URLs
  base-path-aware** (never hard-code a leading `/`). Document how to set the base
  path for GitHub Pages vs root hosting in the README.
- Strong code quality: typed throughout, componentised, no dead code, sensible
  file structure, a helpful `README.md` with run/build/deploy instructions.

## 3. Hard pedagogical constraints (this is the most important section)

This app teaches a course with a **strict, limited syllabus and strict coding
standards**. ALL generated content, every model answer, every example, and the
behaviour of the code checker MUST respect the following. Treat violations as
bugs.

> **Scope of these bans:** the Python feature bans below (no `for`, lists,
> dictionaries, comprehensions, etc.) apply **only to learner-facing Python** —
> the example snippets, the model answers, the checker rules, and anything a
> student reads or writes. They do **not** apply to your TypeScript/React
> implementation, which will of course use arrays, objects, `map`, etc. normally.

### 3a. Cumulative scope — only teach what has been introduced

Each lesson may only use concepts introduced **in that lesson or an earlier
one**. Never use a concept "from the future". The per-lesson scope is in §7.
Global rules that hold for the WHOLE course:

- **Loops:** `while` loops **only**. **`for` loops are never used.** `while`
  loops are introduced in Lesson 7 — lessons 1–6 contain no loops at all.
- **`break` / `continue`: never used** (the course keeps them out of all
  exercises). Sentinel loops use the read-before / read-at-end-of-loop pattern.
- **Collections:** **no lists, tuples as data structures, sets, or
  dictionaries** — they belong to the next course. (Returning two values via a
  tuple is *not* used either; keep functions returning a single value.)
- **No files, no `try`/`except`.**
- **Forbidden Python features at all times** (these are "instant zero" in the
  course): list/set/dict **comprehensions**, `map()`, `filter()`, `reduce()`,
  `lambda`, and **inline/ternary `if`** (`a if c else b`). Use explicit
  `while`/`if`/`elif`/`else` instead.
- **Functions** first appear in Lesson 10; lessons 1–9 are written as a single
  "main program" with no `def`.
- **Modules** (`math`, `random`) first appear in Lessons 11–12.

### 3b. The 9 coding standards (model answers must follow them; the checker enforces them)

1. **`lower_snake_case`** for all variable and function names. No `camelCase`,
   no `UPPER_SNAKE_CASE`.
2. **Meaningful names.** No single-letter names except a sensible loop counter.
3. **A docstring in every function** describing what it does, its parameters and
   its return value.
4. **No comprehensions or functional constructs** (`map`/`filter`/`reduce`/
   `lambda`) — and no comprehensions of any kind.
5. **No inline/ternary `if`.** Use full `if`/`elif`/`else`.
6. **Indentation is 4 spaces.**
7. **Two blank lines around each top-level function.**
8. **Lines ≤ 80 characters.**
9. **Do not shadow built-ins** — never name a variable `sum`, `min`, `max`,
   `list`, `str`, `print`, etc.

Model answers shown to students must be perfect exemplars of these rules.
`input()` and `print()` belong in the main program, not inside functions, unless
an activity explicitly requires otherwise.

### 3c. The full "allowed toolkit" (everything available by Lesson 12)

I/O and f-strings (`input()` returns a string; `print()` with `sep=`/`end=`);
types `int`/`float`/`str` and casting; `type()`; arithmetic `+ - * /` plus `//`,
`%`, `**`; `round()` (incl. `round(x, n)`), `abs()`, `pow()`; comparison
operators and `and`/`or`/`not`; `if`/`elif`/`else` and nested `if`; string
length, indexing (incl. negative), slicing, `in`, and methods `.upper`,
`.lower`, `.strip`, `.capitalize`, `.replace`, `.find`, `.startswith`,
`.endswith`, and the boolean checks `.isdigit`, `.isnumeric`, `.isalpha`,
`.isalnum`, `.isupper`, `.islower`, `.isspace`; **`while` loops** (counted,
sentinel, validation); the four patterns (counting, accumulation/summation,
flag, maximum/minimum); **functions** (`def`, parameters, `return`, docstrings,
local vs global scope); the **`math`** module (`math.pi`, `math.sqrt`,
`math.pow`, `math.exp`, `math.factorial`, `math.gcd`) and **`random`** module
(`random.randint(a, b)`).

This list is the *cumulative* total by Lesson 12 — the timing in §7 governs when
each item becomes available. In particular: **`math` arrives in Lesson 11**;
and **`random`, the `**` operator, `round()`/`abs()`/`pow()`, `print()` with
`sep=`/`end=`, and the extra string methods (`.capitalize`, `.isalnum`,
`.isspace`, `.startswith`, `.endswith`, `.find`, `.replace`) arrive in Lesson
12**. **Before Lesson 12, use plain `print()` only** (no `sep=`/`end=`), and do
not use `math` before L11 or `random` before L12. The companion validation spec's
scope table is the single source of truth for these timings — keep them in sync.

## 4. Activity types (build all of these as reusable components)

Each activity has: a prompt/question, the interaction, **immediate marking**, a
short **explanation shown after answering** (why the answer is right, and a hint
on the common mistake), and it contributes to the lesson score. Provide a
**"Check"** then **"Next"** flow, a **"Try again"** option, and keyboard support.

1. **Multiple choice** (single or multi-correct) — e.g. "What does `input()`
   return?". When the options are themselves Python code (e.g.
   `total = total + amount`), put them in a `codeOptions` field (not plain text)
   so the validator can scope-check them (see the validation spec).
2. **Fill in the gaps** — a code snippet with one or more blanks the student
   types into; accept sensible variants (trim whitespace; configurable
   case-sensitivity). e.g. complete `total = total ___ amount`.
3. **Drag and drop — ordering / Parsons problems** — shuffled code lines the
   student drags into the correct order (with correct indentation for code).
   Must also be operable by keyboard (move up/down buttons) for accessibility.
4. **Drag and drop — matching/categorising** — match items to buckets, e.g.
   match each string method to its result, or sort names into "valid variable
   name" vs "invalid". When labels are Python code, put them in a `codeLabels`
   field so the validator can scope-check them.
5. **Predict the output** — show code, student types what it prints. Support
   **two expected outcomes**: `expectedStdout` (normal output, compared against
   the real Pyodide run) **or** `expectedError` (the code is meant to raise — the
   student predicts the exception, e.g. a scope `NameError` in L11). See the
   `PredictOutput` shape in §5.
6. **Trace tables** — student fills a table of variable values step by step as a
   `while` loop or function runs; mark each cell.
7. **Short-answer typing** — student types a single expression, value, or line
   (e.g. "write a slice that reverses `word`").
8. **Find the bug / fix the code** — show broken code, student identifies the
   error type or edits the code to fix it.
9. **Write code (run in Pyodide)** — the flagship activity. Student writes a
   program or a function; the app runs it and checks it (see §5 and §6).

Make activity components **data-driven** so content is just data (see §5). Add
gentle gamification: per-activity correctness, a per-lesson progress bar, XP
points, a daily streak, lesson completion badges, and a celebratory state when a
lesson is finished. Keep it tasteful, not noisy.

## 5. Content data model

Define clear TypeScript types and store ALL lesson content as typed data
(co-located content files are fine). Suggested shapes:

```ts
type Lesson = {
  id: string;            // "L03"
  number: number;        // 3
  title: string;         // "Input, Output & Variables"
  blurb: string;         // one friendly sentence
  newSkills: string[];   // skills introduced here
  activities: Activity[];
};

type Activity =
  | MultipleChoice | FillGaps | OrderLines | Matching
  | PredictOutput | TraceTable | ShortAnswer | FixCode | WriteCode;
```

**Keep learner-facing Python out of prose.** `prompt`, `explanation`, and
`commonMistake` are natural-language only — never put code snippets in them. Code
the student should *see* goes in a dedicated, validator-scanned field. Every
activity extends this base:

```ts
type ActivityBase = {
  id: string;                  // stable, unique within the lesson
  kind: string;                // discriminant
  prompt: string;              // NATURAL LANGUAGE ONLY — no code snippets
  displayCode?: string;        // optional read-only code shown with the prompt
  inlineCodeRefs?: string[];   // short inline tokens referenced in prose,
                               //   e.g. ["input()", "while"] — validator-scanned
  explanation: string;         // shown after answering (required, non-empty)
  commonMistake?: string;
};
```

**How to keep prompts natural without hiding code from the validator.** The UI may
render `inlineCodeRefs` as inline `code` chips and `displayCode` as a read-only
block, so prompts still read naturally. Examples:

- ❌ `prompt: "What does \`input()\` return?"`
  ✅ `prompt: "What value type does the input function give back?"`,
  `inlineCodeRefs: ["input()"]`
- ❌ `prompt: "What is printed by \`print(name[0])\`?"`
  ✅ `prompt: "What does this snippet print?"`, `displayCode: "print(name[0])"`
  (a `PredictOutput` would put it in `code` instead)
- ❌ `prompt: "Complete: \`total = total + amount\`"`
  ✅ a `FillGaps` with `template: "total = total {{1}} amount"` and the gap's
  accepted answers — the code lives in `template`, not the prompt.

Rule of thumb: if a phrase contains a Python operator, call, keyword, or
expression, it belongs in a code field (`displayCode` / `code` / `template` /
`codeOptions` / `codeLabels`) or in `inlineCodeRefs`, never inside `prompt`.

Every concrete type below adds `...ActivityBase`. **The validator scans every
code-bearing field** (`displayCode`, `inlineCodeRefs`, and the per-type code
fields named below); it ignores `prompt`/`explanation`/`commonMistake`.

```ts
type MultipleChoice = ActivityBase & {
  kind: "mcq";
  multi?: boolean;
  options?: string[];          // plain-text options (not scanned)
  codeOptions?: string[];      // code options — validator scope-checks these
  correctIndexes: number[];
};

type Matching = ActivityBase & {
  kind: "matching";
  pairs: { left: string; right: string }[]; // plain-text labels (not scanned)
  codeLabels?: string[];       // any labels that are code — validator scans these
};

type FillGaps = ActivityBase & {
  kind: "fillGaps";
  // Template with numbered gaps, e.g. "total = total {{1}} amount".
  template: string;            // CODE — validator scans it with gaps filled in
  gaps: {
    id: number;
    accepted: string[];        // accepted answers (each is code)
    caseSensitive?: boolean;   // default from config
  }[];
};

type OrderLines = ActivityBase & {   // drag-and-drop / Parsons
  kind: "orderLines";
  lines: string[];             // CODE lines in CORRECT order (app shuffles them)
  // Validator scans `lines` joined in correct order as one program.
};

type TraceTable = ActivityBase & {
  kind: "traceTable";
  code: string;                // CODE being traced; validator scans it
  columns: string[];           // variable names tracked, in order
  rows: (string | number)[][]; // expected value per step per column
};

type ShortAnswer = ActivityBase & {
  kind: "shortAnswer";
  accepted: string[];          // accepted answers
  expectedAnswerIsCode: boolean; // REQUIRED — if true, `accepted` is scanned
  caseSensitive?: boolean;
};

type FixCode = ActivityBase & {
  kind: "fixCode";
  brokenCode: string;          // CODE with the bug (scope rules apply; style does not)
  fixedCode: string;           // CODE — the model fix (full standard applies)
  // Optional: ask for the error TYPE instead of / as well as an edit.
  expectedErrorType?: string;  // e.g. "IndentationError"
};

type PredictOutput = ActivityBase & {
  kind: "predictOutput";
  code: string;                // shown to the student; validator scans this
  // Exactly one of the following:
  expectedStdout?: string;     // normal output (compared to the real Pyodide run)
  expectedError?: {            // the code is meant to raise
    type: string;              // e.g. "NameError", "ValueError"
    message: string;           // friendly explanation shown after answering
  };
};

type WriteCode = ActivityBase & {
  kind: "writeCode";
  starterCode?: string;
  // Mode A — PROGRAM: feed stdin lines, compare captured stdout.
  programTests?: { stdin: string[]; expectedStdout: string }[];
  // Mode B — FUNCTION: import student code, call a function, then assert.
  functionTests?: {
    functionName: string;
    cases: {
      args: unknown[];
      // EXACTLY ONE assertion shape per case:
      expected?: unknown;                 // deep-equality check
      property?:                          // for random / non-deterministic
        | { type: "intInRange"; min: number; max: number }
        | { type: "inSet"; values: unknown[] }
        | { type: "predicate"; pythonExpr: string }; // expr over `result`
    }[];
  }[];
  // Randomness handling (see §6). Default "seed".
  randomMode?: "seed" | "monkeypatch" | "range";
  randomSeed?: number;                // used when randomMode = "seed"
  // Static rules enforced in addition to running (see §6).
  requireFunctionName?: string;       // must define this exact function
  docstring?: {
    mustMention?: ("purpose" | "parameters" | "return")[]; // DEFAULT
    exactText?: string;                 // exam-style: must match exactly
  };
  bannedExtra?: string[];             // any extra banned tokens for this task
  sampleSolution: string;             // a standards-perfect model answer
};
```

Use `property` assertions (not `expected`) whenever a result is random or
non-deterministic, so tests never become flaky (see §6, `randomMode`).

## 6. Python execution & the coding-standards checker (critical)

Run all Python through Pyodide **inside a Web Worker**. The worker must:

- **Capture `stdout`** (redirect `sys.stdout`) so "predict the output" and
  program tests can compare text. **Output comparison rules:** normalise line
  endings (`\r\n`/`\r` → `\n`), strip a single trailing newline at the end, and
  ignore trailing whitespace at the end of each line — but **do not** collapse or
  ignore whitespace *inside* a line (internal spaces matter) unless a test
  explicitly sets a "loose" flag. Show a clear line-by-line diff on mismatch.
- **Provide `input()`** for PROGRAM tests by overriding `builtins.input` to pop
  from a provided list of `stdin` lines (so programs that call `input()` work
  without a real prompt). If inputs run out, fail gracefully with a clear
  message.
- **FUNCTION tests:** execute the student's code to define the function, then
  call `functionName(*args)` and assert the result. A case uses **exactly one**
  assertion: `expected` (deep equality) **or** a `property` — `intInRange`
  (`min ≤ result ≤ max`), `inSet` (result ∈ `values`), or `predicate` (a Python
  boolean expression over `result`). Use `property` for any random/
  non-deterministic result so checks never become flaky.
- **Capture exceptions:** when running code that is expected to raise (a
  `PredictOutput` with `expectedError`, or any run that errors), capture the
  **exception type and message** so the app can confirm the student's predicted
  error type and show a friendly explanation — don't let it surface as a crash.
- **Deterministic randomness:** code that uses `random` must be tested
  reproducibly — never write flaky tests. Support three strategies via
  `randomMode`: (a) **`seed`** (default) — call `random.seed(randomSeed)` before
  running so output is fixed and `expected` values are stable; (b)
  **`monkeypatch`** — replace `random.randint` with a deterministic stub for the
  test; (c) **`range`** — assert the result is within the valid range / satisfies
  a property rather than equalling one value. Pick per activity; the seed/stub
  must be applied in the worker, not shown in the student's editor.
- **Enforce a timeout** (e.g. 3–5 seconds). Because beginners frequently write
  infinite `while` loops, the worker must be **terminatable** — kill and restart
  the worker on timeout and report "Your program took too long — check your loop
  condition." This is why Pyodide must run in a worker, not on the main thread.
- **Lesson-scope enforcement on student submissions.** The worker must receive
  the current **`lessonNumber`** (or an explicit allowed-scope object) and reject
  student code that uses a construct **not yet introduced by that lesson**, using
  the **same cumulative scope table as the companion validation spec** (share one
  rule module — do not reimplement). Example: a Lesson 3 Write-code answer that
  uses `while`, `def`, `import`, a list, or a comprehension is rejected with a
  friendly message ("`while` loops come in Lesson 7 — try solving this with what
  you've learned so far"). This is the runtime twin of the static content check.
- **Static "coding standards" check** using Python's `ast` module (available in
  Pyodide) plus light text checks. Before/after running, scan the student's
  source and produce friendly warnings/failures for:
  - any `for` loop, `break`, `continue`, `lambda`, comprehension
    (`ListComp`/`SetComp`/`DictComp`/`GeneratorExp`), ternary `IfExp`, `try`,
    `import` of disallowed modules, or use of lists/dicts/sets/tuples as data —
    **these fail the activity** with: "This uses a feature not allowed in
    INFS 1101 (…). Use a while loop / if-elif-else instead."
  - `camelCase` or `UPPER_SNAKE_CASE` names, shadowing a built-in
    (`sum`/`min`/`max`/`list`/`str`/…), a function with **no docstring**, lines
    **> 80 chars**, or indentation that is not 4 spaces — **these warn** (and,
    where an activity says so, fail), mirroring how the course deducts marks.
  - When `requireFunctionName` is set, verify the function exists with that exact
    name. For docstrings, follow the activity's `docstring` rule: **by default**
    just require that a docstring exists and mentions the function's purpose,
    parameters, and return value (wording free); only require an **exact** match
    when `docstring.exactText` is set (exam-style activities).
- Show results as a clear pass/fail per test case plus the standards report.
  **Model-answer reveal policy:** the `sampleSolution` is shown automatically
  after the student passes. A student may also press **"Show a model answer"**
  before passing — but doing so records the activity as **"completed with help"
  (solution viewed)**: it awards **no XP** for that activity and is flagged in
  the lesson summary, while still counting toward lesson completion. Viewing a
  solution never marks the activity as *failed*. Persist this `solutionViewed`
  state per activity (see §8).
- **Academic-integrity tone:** model answers are framed for *learning, not
  copying*. Present them with wording like "Compare your approach" or "One way to
  write this" rather than "Here is the answer", and pair each with its
  `explanation` so the student reflects rather than just lifts the code.

Keep all of this resilient: if Pyodide fails to load (e.g. offline first visit),
disable only the run button and tell the student the rest of the lesson still
works.

## 7. The 12 lessons — author full content for every one

Build a populated lesson for each. Aim for **roughly 8–12 activities per
lesson**, mixing at least 4 different activity types per lesson, ordered easy →
hard, and always honouring the **cumulative scope** (a lesson may only use
skills from itself and earlier lessons). Below is the authoritative scope and
seed ideas; expand each into full, varied, correct activities.

**Quality over quantity — no near-duplicates.** Activities within a lesson must
not be slight rewordings of each other. Vary the **context** (different
real-world scenario, different Gulf names/places/numbers), the **skill focus**
(target a different sub-skill of the lesson), and the **interaction type**. Two
"add up some numbers" tasks that differ only in the numbers do not count as two
activities — prefer fewer, genuinely distinct activities over padding.

- **L01 — Foundations & Computational Thinking (intro).** Concepts only, no code
  writing yet: what a program/algorithm is; the Input → Process → Output (IPO)
  model; the four cornerstones (decomposition, pattern recognition, abstraction,
  algorithms); pseudocode and the idea of sequence. *Activities:* MCQ on IPO and
  key terms; matching terms to definitions; drag-to-order the steps of an
  everyday algorithm (pseudocode); categorise tasks as input/process/output.
- **L02 — Computational Thinking.** Decomposition, pattern recognition,
  abstraction, algorithms; sequence vs selection vs iteration (as ideas);
  reading flowcharts/pseudocode. *Activities:* categorising, matching, ordering
  pseudocode, "which cornerstone is this?" MCQ.
- **L03 — Input, Output & Variables.** `input()` always returns a string;
  `print()`; `lower_snake_case` variables; `int`/`float`/`str` and casting;
  arithmetic incl. `//` and `%`; f-strings; extracting digits with `% 10` and
  `// 10`; the three error types (syntax / run-time / logic). **No decisions or
  loops yet.** *Activities:* fill-the-gap casting; predict-output of f-strings
  and `//`/`%`; write a short program that reads numbers and prints a result;
  "valid vs invalid variable name" sorting; find-the-bug (forgot to cast).
- **L04 — Simple Decisions.** Comparison operators; `and`/`or`/`not`; `if` and
  `if`/`else`; correct indentation. *Activities:* predict-output of comparisons;
  Parsons-order a small `if`/`else`; write a program with a single decision;
  fix an indentation error.
- **L05 — Complex Decisions.** `if`/`elif`/`else`; nested `if`; patterns:
  closeness, range check, flag (with decisions only). *Activities:* write a
  grade/category converter with `if`/`elif`/`else`; predict-output of nested
  conditions; match input → branch taken; fix overlapping conditions.
- **L06 — Strings.** `len()`; indexing and **negative** indexing; slicing
  `s[a:b:c]`; `in`; methods `.upper`/`.lower`/`.strip`; the boolean `.is…`
  checks; input normalisation. **Still no loops.** *Activities:* fill-the-gap
  slice; predict-output of slicing/`in`; match method → result; short-answer
  "write a slice that reverses a word"; "valid/invalid" sorting using `.isdigit`.
- **L07 — Counter-Controlled Loops.** The `while` loop as a counted loop;
  counter initialise/condition/increment; tracing; countdown and 1-based loops;
  classic bugs (won't start, won't end, counter changed wrongly). *Activities:*
  **trace tables** of counted loops; predict-output; Parsons-order a counted
  loop; write a counted loop; fix an infinite loop.
- **L08 — Sentinel-Controlled Loops.** Sentinel `while` loops; the read-before /
  read-at-end pattern; input validation loops (numeric range, positive integer,
  format check like a course code with `len`, slicing, `.isupper`, `.isdigit`).
  **No `break`.** *Activities:* order the read-before/read-after pattern; write a
  sentinel sum/average program; write a validation loop; predict-output; fix the
  "second input missing" bug.
- **L09 — Programming Patterns.** Counting, accumulation/summation, flag, and
  maximum/minimum — combined with `while` loops. *Activities:* "which pattern is
  this?" MCQ/matching; fill-the-gap to complete a pattern; write a program using
  a named pattern; predict-output; combine two patterns in one program.
- **L10 — Function Concepts.** `def` and calling; parameters vs arguments;
  `return`; docstrings; print-vs-return; basic local scope; zero-argument
  functions. *Activities:* Parsons-assemble a function (with docstring); write a
  function to a given name + docstring (FUNCTION-mode check); predict-output of
  print vs return; fill-the-gap docstring; fix "function defined but never
  called".
- **L11 — Python Functions (deeper).** Defining functions before the main
  program; using the return value directly or by assignment; **local vs global
  variables** (and why globals are discouraged); the **`math`** library
  (`math.sqrt`, `math.pi`, `math.pow`). *Activities:* trace tables tracking
  local vs global memory; predict-output that ends in a scope `NameError`; write
  a function that uses `math`; match "local" vs "global"; Parsons with a
  function + main program.
- **L12 — Python Functions 2.** Extra string methods (`.capitalize`,
  `.isalnum`, `.isspace`, `.startswith`, `.endswith`, `.find`, `.replace` incl.
  optional count); the **`math`** module (`math.exp`, `math.factorial`,
  `math.gcd`, `**`); the **`random`** module (`random.randint`); `print()` with
  `sep=`/`end=`; richer validation loops (positive integer, `> 0`, any integer
  via `value.replace("-","",1).isnumeric()`); traversing a string with a `while`
  loop (reverse a string, count vowels); wrapping logic in a function.
  *Activities:* predict-output of `.replace`/`.find`; write a validation loop;
  write a "count the vowels" function using a `while` loop; match method →
  output; code with `random`/`math`.

## 8. Progress, scoring & persistence (localStorage)

- Persist: per-lesson completion %, per-activity correct/attempted, **whether a
  model answer was viewed (`solutionViewed`)**, total XP, current streak (by
  calendar day), last-visited lesson, and theme choice. The end-of-lesson
  summary should show how many activities were "completed with help".
- A **home / lesson-map** screen shows all 12 lessons as cards with progress
  rings, locked/unlocked styling (optional: unlock the next lesson when the
  previous reaches, say, 70% — make this toggleable), and overall stats.
- A **lesson screen** runs its activities in sequence with a progress bar and an
  end-of-lesson summary.
- **XP is awarded only once per activity** — the first time it is completed
  correctly (and not at all if the model answer was viewed first). Repeating an
  activity later updates its accuracy stats but **never adds XP again**, so
  students cannot farm XP by redoing easy questions.
- **"Review mistakes"** in the lesson summary means: list the activities the
  student got wrong (or completed with help), and let them **retry only those**
  activities (not the whole lesson). Correcting them updates accuracy; XP still
  follows the once-only rule above.
- Provide **"Reset progress"** (with confirm) and make all storage namespaced
  (e.g. key prefix `infs1101_`) so it never collides with other apps.

### 8a. Teacher / debug route (`/teacher`, build-flag controlled)

Add a **`/teacher`** route for the tutor. It shows: the full list of lessons and
every activity; **all model answers and explanations** in one place; the
**content audit table** (§11) rendered on screen; and tools to **reset, export,
and import** the local progress (download/upload the `localStorage` state as a
JSON file). The exported JSON must include a **`schemaVersion`** and the
app/content version; on import, validate these and **reject incompatible files
gracefully** with a clear message rather than corrupting saved progress.

**Be explicit about its visibility (no real security in a static app).** There
is no backend, so an unlinked `/teacher` route is **obscure, not secure** — any
student who knows the URL can open it and see every answer. Make the behaviour an
explicit, documented choice via a build-time flag **`NEXT_PUBLIC_TEACHER_MODE`**:
when `off` (the recommended default for any deployment students can reach), the
`/teacher` route and all answer-revealing tools are **excluded from the build
entirely**; when `on`, they are included. Document a simple workflow: build a
**student deployment** with teacher mode off, and a **separate teacher build**
(or run locally) with it on. Never rely on the route merely being unlinked.

## 9. UX, accessibility & tone

- Clean, encouraging, distraction-free. Big readable code font (monospace) for
  all code. Syntax-highlight code where helpful.
- Immediate, specific, kind feedback. Never just "Wrong" — always say why and
  give the course's "common mistake" tip. Celebrate progress.
- Fully **keyboard accessible** (including a non-drag fallback for drag-and-drop)
  and screen-reader friendly (ARIA), good colour contrast in both themes, mobile
  friendly.
- All copy in **British English**, EAL-friendly: short sentences, plain words,
  define jargon the first time.

### 9a. Manual content-QA checklist (human review — not automatable)

The `validate:content` script polices *code* scope, but the qualities below need
human judgement. Complete this checklist for **every lesson** during Phase 6 and
record it (e.g. a `CONTENT_QA.md` with a tick per lesson). It is acceptance check
#13.

- **British English & spelling:** "analyse", "colour", "organise", "practise"
  (verb); no US spellings in UI or content.
- **EAL-friendly wording:** short sentences, plain words, jargon defined on first
  use; prompts unambiguous; nothing culturally obscure.
- **Local context used naturally:** Gulf/Qatari names, Doha/Qatar places, QAR,
  and UDST-style course codes appear and read naturally (not forced).
- **No near-duplicates (human pass):** beyond the automated heuristic, confirm
  activities feel genuinely different in scenario, skill focus, and interaction.
- **Pedagogical fit:** difficulty rises easy → hard; each activity targets a real
  sub-skill of the lesson; explanations actually teach the "common mistake".
- **Answer/feedback quality:** model answers are exemplary; explanations are
  correct, kind, and specific; tone matches the academic-integrity framing.

## 10. Configurable defaults (expose in one `config`/constants file)

App name; pass-threshold to unlock the next lesson; whether lessons are locked at
all; XP per activity; Pyodide timeout; case-sensitivity of text answers; theme
default; **`NEXT_PUBLIC_BASE_PATH`** (deployment subpath); **`NEXT_PUBLIC_TEACHER_MODE`**
(`on`/`off`, default `off` — see §8a). Choose sensible defaults and document them.

## 11. Deliverables & acceptance criteria

- A complete, runnable Next.js + TypeScript + Tailwind project with **all 12
  lessons fully populated** (no "TODO"/placeholder content), Pyodide-in-a-worker
  code running, the `ast`-based standards checker, and localStorage progress.
- A `README.md` with install, dev, build, and static-deploy steps (including
  exact pinned versions and how to set the GitHub Pages base path).
- A **content audit** (`CONTENT_AUDIT.md`, generated from the content data) with
  one row per lesson showing: activity count, the activity types used, the new
  concepts introduced, and **every Python feature/keyword/string-method/module
  that appears in that lesson's snippets and answers**. Use it to prove no
  future-scope concept has leaked into an earlier lesson — flag any row that
  contains a feature outside that lesson's cumulative scope.
- **An automated content-validation script** (e.g. `npm run validate:content`,
  runnable in CI) that parses the lesson content data and **fails with a clear
  report** if any of these are violated. This is the single most important
  safeguard — make it strict:
  1. Each lesson has **≥ 8 activities**, spanning **≥ 4 activity types**.
  2. Every activity has a non-empty `explanation`.
  3. No **banned Python token/construct** appears in any sample solution or
     learner-facing snippet (`for`, `break`, `continue`, `lambda`, any
     comprehension, ternary `if`, `try`/`except`, list/dict/set/tuple literals).
  4. No user-defined function appears before Lesson 10 — neither a **`def`** nor
     a **call to a non-built-in name** (e.g. `calculate_fee(10)`); built-in calls
     like `print()`/`len()` are fine.
  5. No unsupported bare built-in/helper call appears in learner-facing Python:
     only `print`, `input`, `int`, `float`, `str`, `type`, `len`, `round`,
     `abs`, and `pow` are course-approved bare built-ins; user-defined functions
     are allowed only when defined in the same snippet or explicitly required by
     the activity.
  6. No **`while`** appears before Lesson 7.
  7. No **`import`** (e.g. `math`/`random`) appears before Lesson 11.
  8. No **`for`** loop appears **anywhere** (whole course).
  9. (Recommended) `print()` with `sep=`/`end=` does not appear before Lesson 12.

  Parse the Python **as specified in the companion spec** (structural AST parsing
  preferred; a string-stripping tokeniser only as a backstop; never raw
  `grep`/`includes`), and reuse the same scope rules as the runtime checker so
  they cannot drift apart. The script must exit non-zero on any violation. **Gate
  it with the build sensibly:** content does not exist until Phase 4, so only make
  `npm run build` depend on validation (via `prebuild`) **from Phase 4 onwards**
  — an `--allow-incomplete` flag lets it run earlier while skipping the
  "enough content" checks. The final delivered build must run full validation
  (no `--allow-incomplete`) before building. A full specification for this script
  — rule IDs, the cumulative scope table, exact messages, exit codes, and an
  implementation sketch — is in the companion file
  **`INFS1101 Practice App - Content Validation Spec.md`**; follow it.
- **Acceptance checks** (verify before finishing):
  1. Every lesson has ≥ 8 activities spanning ≥ 4 activity types, and every
     activity has an explanation.
  2. No activity in any lesson uses a concept outside its cumulative scope
     (especially: no `for`, lists, `break`, or `try` anywhere; loops only from
     L07; functions only from L10; modules only from L11–L12).
  3. Every model answer obeys all 9 coding standards.
  4. The standards checker correctly flags `for`, comprehensions, `break`,
     `lambda`, ternary `if`, built-in shadowing, and missing docstrings on
     sample bad inputs.
  5. A deliberate infinite `while` loop is killed by the timeout without
     freezing the UI.
  6. Progress, XP and streak persist across reloads; "Reset progress" clears
     them; viewing a model answer is recorded and awards no XP for that activity.
  7. After first app load, non-code activities work offline; after Pyodide has
     loaded once online, code activities also work offline (service worker). If
     Pyodide is blocked, non-code activities still work and code activities show
     a clear "connect once to enable code" message.
  8. The `CONTENT_AUDIT.md` table shows no lesson using a feature outside its
     cumulative scope.
  9. Any activity that uses `random` has a deterministic test (seeded,
     monkeypatched, or range/property based) — no flaky checks.
 10. **Non-root base path test (highest engineering risk — test explicitly):**
     build the static export with `NEXT_PUBLIC_BASE_PATH=/infs1101-python-trainer`
     and serve it from that subpath. Verify that **all of these load and work**:
     every app route (deep links and refresh, not just the home page), the
     Pyodide **Web Worker** script, the **service worker** + web app **manifest**,
     the Pyodide runtime + wheels, and all static assets — none may 404 or assume
     a leading `/`.
 11. `npm run validate:content` passes with zero violations (no
     `--allow-incomplete`).
 12. No activity within a lesson is a near-duplicate of another (varied context,
     skill focus, and interaction type).
 13. The **manual content-QA checklist** (§9a) has been completed for every
     lesson.
 14. With `NEXT_PUBLIC_TEACHER_MODE=off`, the `/teacher` route and all
     answer-revealing tools are absent from the built output.

Build it using the **vertical-slice-first** strategy and phased order in §12;
deliver a complete, polished app, and make it genuinely pleasant to use.

## 12. Build order — implement in phases (do not attempt in one pass)

This is a large product. Build it in the following phases, and **stop at the end
of each phase to verify the checkpoint before moving on**. Keep every phase
compiling and runnable.

> **Default strategy — vertical slice first (not a fallback).** Do **not** try to
> author all 12 lessons at once. Build a **content vertical slice** covering
> **Lessons 1, 3, 7, and 10** first (chosen so every layer is exercised:
> concepts, basic I/O, `while` loops, and functions), with **every activity type
> represented** and the activity engine, the Pyodide run/checker, and the
> `validate:content` script all working end to end for those four lessons. Get
> that slice genuinely solid — passing the slice-relevant acceptance checks —
> **then** expand to the remaining lessons (2, 4, 5, 6, 8, 9, 11, 12) in scope
> order. (Cross-cutting features — progress/XP, the teacher route, and offline/
> PWA — are added later in Phase 5; the slice does **not** need them.) This is the
> required default because it protects against a wide-but-shallow result; prefer
> a deep, correct slice over a thin spread across all 12.

**Phase 1 — Scaffold, shell & navigation.** Create the pinned Next.js + TS +
Tailwind project configured for static export and a configurable base path. Add
the light/dark theme, the home/lesson-map screen, the lesson screen shell, and
routing between them. Stub the 12 lessons with titles only.
*Checkpoint:* app runs, you can navigate the map → a lesson → back; themes work.

**Phase 2 — Content model & activity components.** Implement the TypeScript
content types (§5) and build every activity component (§4) with marking,
explanations, "Check/Try again/Next", keyboard support, and a couple of
hard-coded sample activities to exercise each component. No Python yet.
*Checkpoint:* every activity type renders, marks correctly, and is keyboard
operable, driven purely by data.

**Phase 3 — Pyodide worker, standards checker & the content validator.** Add the
lazy-loaded Pyodide **Web Worker**: stdout capture, `input()` injection, PROGRAM
and FUNCTION test modes (incl. `property`/range assertions), exception capture,
the timeout/kill for infinite loops, deterministic-random handling, the
`ast`-based coding-standards checker, and **runtime lesson-scope enforcement**
(§6). **Build the `validate:content` script skeleton now too** (per the companion
spec), runnable with `--allow-incomplete`, sharing one scope/rule module with the
runtime checker — so it is ready to guide content authoring from the start of
Phase 4, not bolted on at the end.
*Checkpoint:* a correct answer passes; a banned/out-of-scope construct is flagged
(both at runtime and by `validate:content --allow-incomplete`); an infinite loop
is killed without freezing; a `random` task tests deterministically.

**Phase 4a — Vertical slice content (Lessons 1, 3, 7, 10).** Author full, varied
activities for these four lessons per §7 (8–12 each, ≥4 types, no near-duplicates),
running `validate:content` continuously as you write. Then run the **acceptance
checks relevant to the features implemented so far** against the slice: activity
rendering + marking + explanations (#1), cumulative scope (#2), model-answer
standards (#3), the runtime standards checker (#4), the infinite-loop kill (#5),
deterministic random (#9), `validate:content` green (#11), no near-duplicates
(#12), and the **implemented portion of the base-path test (#10)** — i.e. under
`NEXT_PUBLIC_BASE_PATH=/infs1101-python-trainer`, verify lesson **routes
(deep-link + hard refresh), static assets, the Pyodide Web Worker, and the
Pyodide files** all load. **Defer** the rest of #10 (service worker + web app
manifest under the subpath) along with the progress/XP, "review mistakes",
teacher-mode, and offline checks (#6, #7, #14) to Phase 5/6, since those features
are built then.
*Checkpoint:* the four-lesson slice is complete, the slice-relevant acceptance
checks above all pass, and the engine is proven end to end.

**Phase 4b — Remaining lessons (2, 4, 5, 6, 8, 9, 11, 12).** Expand to the other
eight lessons in scope order, keeping `validate:content` green throughout;
generate `CONTENT_AUDIT.md`.
*Checkpoint:* all 12 lessons are fully populated, `npm run validate:content`
passes with zero violations, and the audit is clean.

**Phase 5 — Progress, gamification, teacher route & offline.** Add localStorage
progress, once-only XP, streaks, lesson locking, the end-of-lesson summary with
"review mistakes" (retry only wrong ones), "solution viewed" tracking, reset, the
hidden **`/teacher`** route (§8a), and the PWA/service-worker offline caching
(app shell + Pyodide).
*Checkpoint:* progress/streak persist; XP is awarded once; "review mistakes"
retries only the wrong activities; `/teacher` shows answers + audit + export;
offline works after first load.

**Phase 6 — Polish & acceptance.** Accessibility pass (ARIA, contrast, drag
fallback), responsive/mobile polish, README with pinned versions and base-path
instructions, complete the **manual content-QA checklist (§9a)** for every
lesson, then run all acceptance checks in §11 and fix anything failing.
*Checkpoint:* every §11 acceptance check passes (incl. the §9a checklist and the
non-root base-path test).

---

### How to use this prompt with Codex

1. Paste everything between the horizontal rules above into Codex as the task.
2. Have Codex work through the **six phases in §12 one at a time**, pausing at
   each checkpoint. If your Codex setup runs unattended, tell it to "complete
   Phase 1, verify the checkpoint, then continue to the next phase" so it does
   not try to build everything at once.
3. If the content for a lesson comes back thin, ask Codex to "expand Lesson N to
   10–12 activities across at least 5 activity types, staying within the
   cumulative scope and coding standards in the prompt", then regenerate
   `CONTENT_AUDIT.md`.
4. Good follow-up asks: "add a teacher 'print all answers' page", "export
   progress as a file", "add a timed quiz mode per lesson".
