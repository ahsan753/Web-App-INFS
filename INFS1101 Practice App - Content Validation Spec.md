# Companion Spec — `validate:content` checker

> Hand this to Codex **together with** the main build prompt
> (`INFS1101 Practice App - Codex Build Prompt.md`). It is the detailed
> specification for the content-validation script required in §11 of that prompt.
> The script is the single most important safeguard against the app's biggest
> risk: a "future" concept leaking into a lesson that has not taught it yet, or a
> banned construct appearing in a model answer. Implement it strictly.

---

## 1. Purpose & invocation

A script that statically inspects the **lesson content data** (not the running
app) and **fails loudly** if any rule below is broken.

- Expose it as **`npm run validate:content`**.
- It must be runnable headlessly in **CI** and as a **pre-commit / pre-build**
  step.
- **Build gating vs the phased build.** Content does not exist until Phase 4, so
  do **not** block the build on validation during Phases 1–3. Provide an
  **`--allow-incomplete`** flag that skips the "enough content" structural rules
  (`E-MIN-ACTIVITIES`, `E-MIN-TYPES`, and stub lessons with zero activities)
  while still enforcing every scope/banned-construct rule on whatever code does
  exist. Wire `validate:content` into `prebuild` **only from Phase 4 onwards**;
  the **final delivered build must run full validation (no `--allow-incomplete`)
  before building** and abort on any error.
- **Exit codes:** `0` = all checks passed; `1` = one or more **ERROR**-level
  violations; `2` = usage/parse failure (could not read content).
- Add a **`--strict`** flag that also fails (exit `1`) on **WARNING**-level
  findings. Default (no flag): warnings are printed but do not fail the build.
- It must never depend on a network connection or a running browser.

## 2. What it inspects (and what it ignores)

The validator only analyses **Python that a learner reads or is given as a model
answer** — never the prose, never the TypeScript implementation.

**Code-bearing fields to analyse (per activity type):**

| Activity | Python code field(s) to scan |
|---|---|
| **All activities (base fields)** | `displayCode`, `inlineCodeRefs[]` |
| `WriteCode` | `starterCode`, `sampleSolution` |
| `PredictOutput` | the `code` shown to the student |
| `FixCode` | `brokenCode` **and** the corrected `fixedCode` |
| `OrderLines` (Parsons) | the ordered `lines` joined into a program |
| `TraceTable` | the `code` being traced |
| `FillGaps` | the `template` **with gaps filled by the correct answers** |
| `ShortAnswer` | `accepted[]` **only when `expectedAnswerIsCode` is true** |
| `MultipleChoice` | `codeOptions[]` only — never plain option text |
| `Matching` | `codeLabels[]` only — never plain labels |

**`displayCode` vs `inlineCodeRefs` — parse them differently.** `displayCode`,
`code`, `template`, `starterCode`, `sampleSolution`, `brokenCode`, `fixedCode`,
joined `lines`, and code-typed `accepted`/`codeOptions`/`codeLabels` are **full
snippets** — parse them as a Python module via AST. `inlineCodeRefs[]` are short
**tokens or fragments** (e.g. `while`, `input()`, `total = total + amount`) that
need **token/fragment-aware** checking: try to parse each as an expression or
statement, and fall back to a keyword/method-name match for a bare token like
`while` or `.replace`. Apply the **same scope and banned-construct rules** to
both, against the activity's lesson number.

**Code in choice/match answers.** MCQ options and matching labels are sometimes
real code (e.g. `total = total + amount`, `word[0]`). To stop future-scope from
slipping in through them, the content model provides optional **`codeOptions`**
(for `MultipleChoice`) and **`codeLabels`** (for `Matching`): when an option or
label is Python code it goes there and the validator scans it. Plain-text
options/labels stay in the normal fields and are ignored.

**Fields to IGNORE:** `prompt`, `explanation`, `commonMistake`, plain-text MCQ
options, plain-text `Matching` labels, `expectedStdout`, `expectedError.message`,
and any other natural-language field. The English word "for" in an explanation
must **never** trigger a violation.

**No code in prose.** Any Python snippet a learner sees must live in a
code-bearing field above (or in `codeOptions`/`codeLabels`) — **never** inline
inside a prose field. The validator can only police code it can find, so this is
a hard authoring rule; the validator may additionally warn (`W-CODE-IN-PROSE`)
if a prose field looks like it contains a code line.

> **Special case — `FixCode`:** "broken" code is *meant* to contain mistakes, so
> coding-standard *style* checks (naming, docstring, line length) do **not** apply
> to `brokenCode`. However, the **scope/banned-construct** rules still apply to
> `brokenCode` (a fix-the-bug task must never teach a `for` loop, even as the
> "bug"). The corrected code is held to the full standard.

## 3. How to parse (avoid false positives)

Detect constructs **structurally, not by raw text search**:

- **Preferred:** parse each code field with a real Python parser and walk the
  **AST**. Either (a) reuse the *exact same* AST checker that runs in the Pyodide
  worker (run Pyodide in Node, or share the Python check source), or (b) shell
  out to `python3` using the `ast` module. Sharing one implementation guarantees
  the validator and the runtime checker can never disagree.
- **Backstop (only if no parser is available):** a tokeniser that first **strips
  string literals and comments**, then matches keywords on word boundaries. A
  plain `grep`/`includes` over raw source is **not acceptable** — `"for"` inside
  a string or the word "before" must not match.
- Detect by AST node type where possible: `For` (and `AsyncFor`), `While`,
  `FunctionDef`, `Import`/`ImportFrom`, `Lambda`, `ListComp`/`SetComp`/`DictComp`/
  `GeneratorExp`, `IfExp` (ternary), `Try`, `Break`, `Continue`, `List`/`Dict`/
  `Set`/`Tuple` literals, `BinOp` with `Pow` (`**`), `Call` to specific names
  (e.g. `print` with `sep=`/`end=` keywords), and `Attribute` method names on
  strings.

## 4. Cumulative scope table (feature → earliest lesson it may appear)

A code field belongs to a lesson `N`; a feature is **in-scope** only if its
"earliest lesson" ≤ `N`. Anything used earlier than its earliest lesson is a
violation (ERROR for the structural items in §5, WARNING for the finer items).

| Feature / construct | Earliest lesson | Tier if used too early |
|---|---|---|
| `print()`, `input()`, variables, `int`/`float`/`str` casting, `type()`, `+ - * /`, `//`, `%`, f-strings | **L03** | WARNING |
| comparisons (`== != < <= > >=`), `and`/`or`/`not`, `if`, `if/else` | **L04** | WARNING |
| `if`/`elif`/`else`, nested `if` | **L05** | WARNING |
| string indexing, slicing, `len()`, `in`, `.upper`/`.lower`/`.strip`, `.isdigit`/`.isnumeric`/`.isalpha`/`.isupper`/`.islower` | **L06** | WARNING |
| **`while`** loop | **L07** | **ERROR** |
| sentinel/validation loops (no new syntax) | L07–L08 | — |
| the four patterns (no new syntax) | L09 | — |
| **user-defined function definitions and calls** (`def`, `return`, docstrings, calling your own function) | **L10** | **ERROR** |
| **`import` / `from … import`** (e.g. `math`), local vs global | **L11** | **ERROR** |
| `math.*` usage (`math.pi`, `math.sqrt`, `math.pow`) | **L11** | WARNING |
| `.capitalize` | **L11** | WARNING |
| **`random`** (`random.randint`), `**` (Pow) operator, `round()`, `abs()`, `pow()`, `print()` with `sep=`/`end=`, `.isalnum`/`.isspace`/`.startswith`/`.endswith`/`.find`/`.replace` | **L12** | WARNING |

Two clarifications:

- The **L10 row is about *user-defined* functions only** (`def` / `return` /
  calling your own function). It is enforced by **two** rules: `E-DEF-EARLY`
  fires on a `FunctionDef` node before L10, and `E-CALL-EARLY` fires on a **call
  to a non-built-in bare name** before L10 (so a snippet like
  `result = calculate_fee(10)` is caught even with no visible `def`). **Built-in
  calls are exempt:** maintain a recognised-built-ins allowlist containing only
  course-approved bare built-ins — `print`, `input`, `int`, `float`, `str`,
  `type`, `len`, `round`, `abs`, `pow` — so `print()` in L03 is fine. Attribute
  calls (`word.upper()`, `math.sqrt()`) are **not** in scope of this rule — they
  are governed by the string-method and module rows / `W-SCOPE`.
  (`round`/`abs`/`pow` are recognised built-ins, so they are never
  `E-CALL-EARLY`; using them before L12 is the finer `W-SCOPE` warning.)
- The `import` keyword is an ERROR before L11 even though *which* module it is is
  a finer WARNING-level concern — see §5/§6.

## 5. ERROR-level rules (fail the build, exit 1)

These are non-negotiable; any one fails the run.

**Banned anywhere in the whole course** (in any analysed code field, any lesson):

- `E-FOR` — a `for` loop appears. *(The course never uses `for`.)*
- `E-BREAK` — `break` appears.
- `E-CONTINUE` — `continue` appears.
- `E-LAMBDA` — a `lambda` appears.
- `E-COMP` — a list/set/dict/generator **comprehension** appears.
- `E-TERNARY` — an inline/ternary `if` expression (`a if c else b`) appears.
- `E-TRY` — `try`/`except`/`finally` appears.
- `E-COLLECTION` — a list, dict, set, or tuple **used as a data structure**
  (literal `[...]`, `{...}`, `(a, b)` as data, or indexing/iterating one).
  *(Slicing a string is fine; building/indexing a collection is not.)*
- `E-FUNCTIONAL` — `map(`, `filter(`, or `reduce(` is called.
- `E-UNSUPPORTED-CALL` — a bare-name call uses a Python built-in or helper that
  is not in the course-approved built-ins allowlist (`print`, `input`, `int`,
  `float`, `str`, `type`, `len`, `round`, `abs`, `pow`) and is not a
  user-defined function defined in the same snippet or explicitly required by
  the activity. Examples: `range(5)`, `sorted(name)`, `eval(text)`, `bool(x)`,
  `ord(letter)`, and `chr(code)`. Before L10, a non-built-in helper-like call
  should be reported as `E-CALL-EARLY`; at L10+ it is allowed only when the
  function is visibly defined in the snippet or named by the activity (e.g.
  `requireFunctionName`).

**Timing (cumulative scope) — structural keywords:**

- `E-WHILE-EARLY` — `while` used in a lesson **before L07**.
- `E-DEF-EARLY` — `def` (a `FunctionDef`) used in a lesson **before L10**.
- `E-CALL-EARLY` — a call to a **bare name not on the recognised-built-ins
  allowlist** (see §4) used in a lesson **before L10** — i.e. calling a
  user-defined function before functions are introduced (e.g.
  `calculate_fee(10)`). Course-approved built-in calls and attribute/method calls
  are exempt. Unsupported Python built-ins such as `range(5)` are reported as
  `E-UNSUPPORTED-CALL` in any lesson.
- `E-IMPORT-EARLY` — any `import` used in a lesson **before L11**.

**Structural / data-integrity:**

- `E-MIN-ACTIVITIES` — a lesson has **fewer than 8** activities.
- `E-MIN-TYPES` — a lesson uses **fewer than 4** distinct activity types.
- `E-NO-EXPLANATION` — an activity has a missing/empty `explanation`.
- `E-FUNC-NAME` — a `WriteCode` in FUNCTION mode is missing `requireFunctionName`,
  or its `sampleSolution` does not define that exact function.
- `E-EXACT-DOCSTRING` — a `WriteCode` sets `docstring.exactText` but the
  `sampleSolution`'s docstring does not match it exactly.
- `E-SOLUTION-STYLE` — a `sampleSolution` violates a hard coding standard:
  not `lower_snake_case`, a function with **no docstring**, a shadowed built-in
  (`sum`/`min`/`max`/`list`/`str`/`dict`/`print`/…), or indentation that is not a
  multiple of 4 spaces. *(Applies to model answers, not to `brokenCode`.)*

## 6. WARNING-level rules (report; fail only with `--strict`)

- `W-SCOPE` — a code field uses a **WARNING-tier** feature from §4 earlier than
  its earliest lesson (e.g. `math.sqrt` in L09, `.replace` in L08, `**`/`round()`
  before L12, `print(sep=…)` before L12).
- `W-CODE-IN-PROSE` — a prose field (`prompt`/`explanation`/plain option/label)
  appears to contain a line of Python code, which the validator cannot scope-check
  — move it into a code-bearing field (or `codeOptions`/`codeLabels`).
- `W-LINE-LENGTH` — a line in a model answer exceeds **80 characters**.
- `W-BLANK-LINES` — top-level functions in a model answer are not surrounded by
  two blank lines.
- `W-SINGLE-LETTER` — a single-letter variable name that is not a sensible loop
  counter.
- `W-NEAR-DUPLICATE` — two activities in the same lesson look near-identical.
  Heuristic: same activity type **and** normalised prompt/code similarity above a
  threshold (e.g. ≥ 0.85 token-set ratio after lowercasing and stripping
  numbers/names). Report both indices so a human can check.

## 7. Output format

Print a readable report grouped by lesson, then a summary. Example:

```
INFS 1101 — content validation
================================

L08  Sentinel-Controlled Loops   (9 activities, 5 types)
  ERROR  E-IMPORT-EARLY   activity[3] sampleSolution L2: "import math" — modules
                          are not introduced until L11.
  WARN   W-SCOPE          activity[6] code: ".replace(" first taught in L12.

L09  Programming Patterns          (7 activities, 4 types)
  ERROR  E-MIN-ACTIVITIES  lesson has 7 activities; minimum is 8.

--------------------------------------------------------------------------
Summary: 2 ERROR(s), 1 WARNING(s) across 12 lessons.
Result: FAIL (errors present).
```

Each line should carry: the **rule ID**, the **lesson**, the **activity index**,
the **field**, and (where possible) the **line/snippet** and a one-line
human explanation. Always print the totals and the final `PASS`/`FAIL`. With
`--strict`, warnings count toward `FAIL`.

## 8. Worked example violations (and the messages to emit)

- A model answer in **L05** contains `for item in data:` →
  `ERROR E-FOR  L05 activity[2] sampleSolution: 'for' loops are never used in INFS 1101 — rewrite with a while loop.`
- An **L06** predict-output snippet uses `while` →
  `ERROR E-WHILE-EARLY  L06 activity[4] code: 'while' is introduced in L07; not allowed in L06.`
- A function task's solution has no docstring →
  `ERROR E-SOLUTION-STYLE  L10 activity[1] sampleSolution: function 'is_even' has no docstring (coding standard 3).`
- `total = sum if x else 0` in any solution →
  `ERROR E-TERNARY  L09 activity[5] sampleSolution: inline if-expression is banned — use a full if/elif/else.`
- `numbers = [1, 2, 3]` in an L07 solution →
  `ERROR E-COLLECTION  L07 activity[3] sampleSolution: lists are not taught in this course.`
- `.capitalize()` used in an L10 snippet →
  `WARN W-SCOPE  L10 activity[6] code: '.capitalize' is introduced in L11.`
- `calculate_fee(10)` in an **L09** snippet, with no visible function definition →
  `ERROR E-CALL-EARLY  L09 activity[2] code: user-defined function calls are introduced in L10.`
- `range(5)` in any learner-facing snippet →
  `ERROR E-UNSUPPORTED-CALL  L07 activity[4] code: 'range' is not in the INFS 1101 allowed toolkit.`
- `print(name)` in **L03** →
  no call-rule violation (`print` is a course-approved built-in).
- `round(total, 2)` before **L12** →
  `WARN W-SCOPE  L09 activity[5] code: 'round' is introduced in L12.`
- A valid **L10** snippet that defines `calculate_fee` and then calls
  `calculate_fee(10)` →
  no `E-CALL-EARLY` or `E-UNSUPPORTED-CALL` violation.

## 9. Suggested implementation sketch

```
load all lessons (import the TS content, or read an exported content.json)
results = []
for lesson in lessons:
    check E-MIN-ACTIVITIES, E-MIN-TYPES on the lesson
    for index, activity in lesson.activities:
        check E-NO-EXPLANATION
        for field in code_bearing_fields(activity):     # see §2 table
            tree = parse_python(field.code)              # AST; ignore on prose
            walk tree:
                flag banned nodes (§5 "banned anywhere")
                flag while<L07 / def<L10 / call-to-non-built-in<L10 / import<L11
                flag unsupported bare built-in/helper calls not in the allowed toolkit
                flag WARNING-tier features earlier than earliest lesson (§4)
            if field is a model answer (not brokenCode):
                run style checks (docstring, snake_case, shadowing, 80 cols)
        check E-FUNC-NAME / E-EXACT-DOCSTRING for WriteCode
    detect W-NEAR-DUPLICATE within the lesson
print_report(results); exit(1 if errors or (strict and warnings) else 0)
```

Keep the scope table (§4) and the banned list (§5) in **one shared module** that
both this validator **and** the runtime Pyodide checker import, so the two can
never drift apart. Add a few **unit tests** for the validator itself: feed it
known-bad snippets (a `for` loop, a comprehension, a `while` in L06, a missing
docstring) and assert it reports the right rule IDs and a non-zero exit.

## 10. Integration checklist

- `package.json`: `"validate:content": "<runner>"`. Add the `prebuild` hook
  (`"prebuild": "npm run validate:content"`) **from Phase 4 onwards** — not in
  Phases 1–3, where content is still stubbed (use `--allow-incomplete` there if
  you want to run it early).
- CI: run `npm run validate:content` (or `-- --strict`) on every push.
- Build the **script skeleton in Phase 3** (runnable with `--allow-incomplete`)
  so it guides authoring; main prompt §12 **Phase 4a/4b** runs it continuously.
  It must pass with **zero errors** before content is considered done; main prompt
  §11 **acceptance check #11** is satisfied by a green run with no
  `--allow-incomplete`.
