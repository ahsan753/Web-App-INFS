# INFS 1101 Python Trainer

A self-paced, fully client-side practice trainer for **INFS 1101 – Introduction
to Computing & Problem Solving** (UDST). Students work through 12 lessons of
guided activities and write real Python that runs **in the browser** — no
backend, no accounts, no data leaves the device.

- **Stack:** Next.js 16 (static export) · React 19 · TypeScript · Tailwind 4
- **Python:** self-hosted [Pyodide](https://pyodide.org) in a Web Worker
- **Storage:** progress saved to `localStorage`
- **Offline:** a service worker caches the app shell and Pyodide

## Getting started

```bash
npm install        # also copies Pyodide assets into public/pyodide (postinstall)
npm run dev        # http://localhost:3000
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Static export to `out/` (runs `prepare:teacher` + `validate:content` first) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests for pure logic (e.g. streak rules) via `node --test` |
| `npm run validate:content` | On-level + structure check of all lesson content (must stay green) |

## Content

All learning content lives in [`src/data/lessons.ts`](src/data/lessons.ts):
12 lessons × multiple activities across 9 kinds (`mcq`, `fillGaps`, `orderLines`,
`matching`, `predictOutput`, `traceTable`, `shortAnswer`, `fixCode`,
`writeCode`). The data model is in [`src/lib/types.ts`](src/lib/types.ts).

After editing content, run `npm run validate:content` — it parses every
learner-facing code field with Python's `ast` and **fails** on anything outside
the INFS 1101 toolkit (`for`, `break`/`continue`, comprehensions, `lambda`,
inline `if`, `try`, collection literals, non-allowlisted built-ins) or used
before its lesson (`while` < L07, `def`/calls < L10, `import` < L11).

### Two on-level gates — keep them in sync

The same coding standard is enforced in two places, by design:

- **Build time** — [`scripts/validate-content.ts`](scripts/validate-content.ts)
  (`analysePython`) checks **authored content**, including model-answer-only
  style rules (docstrings, naming, blank lines).
- **Runtime** — `check_source` in
  [`public/python-worker.js`](public/python-worker.js) gates **student
  submissions**: `error`s block a run; `warning`s (code `scope`) are "comes
  later" nudges that still let the exercise pass and award XP.

If you change a lesson-gating rule in one, change it in the other. There is a
cross-reference comment at the top of each.

## Teacher mode

The answer-revealing `/teacher` route is **excluded from the build by default**.
It is generated only when `NEXT_PUBLIC_TEACHER_MODE=on`
(see [`scripts/prepare-teacher-route.mjs`](scripts/prepare-teacher-route.mjs)).
It is obscure, not secure — use it only for local or teacher-only builds.

## Deploy

Pushing to `main` builds and publishes to GitHub Pages via
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). The
site is served under a sub-path, set with `NEXT_PUBLIC_BASE_PATH` (currently
`/Web-App-INFS`); `next.config.mjs` wires it into `basePath`/`assetPrefix`.
