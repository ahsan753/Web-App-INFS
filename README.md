# INFS 1101 Python Trainer

A static, client-side practice app for the INFS 1101 introductory Python course.
It includes 12 populated lessons, activity marking, local progress, a content
validator, a Pyodide worker for code activities, and PWA/offline support.

## Versions

The project pins exact package versions for reproducible builds:

- Next.js `16.2.9`
- React `19.2.7`
- Tailwind CSS `4.3.1`
- Pyodide `0.28.3`
- TypeScript `6.0.3`

Pyodide note: the npm `pyodide` package currently has a suspicious `latest`
dist-tag outside the official release line. This project deliberately pins the
official `0.28.3` release and self-hosts its assets in `public/pyodide/`.

## Commands

```bash
npm install
npm run dev
npm run validate:content
npm run typecheck
npm run build
```

`npm install` copies the pinned Pyodide runtime into `public/pyodide/`.

## Static Hosting

Root hosting:

```bash
npm run build
```

GitHub Pages project hosting:

```bash
NEXT_PUBLIC_BASE_PATH=/infs1101-python-trainer npm run build
```

The app uses `output: "export"` and writes static files to `out/`. Lesson routes
are statically generated as `/lessons/L01/` through `/lessons/L12/`.

## Teacher Mode

Teacher mode is off by default:

```bash
NEXT_PUBLIC_TEACHER_MODE=off npm run build
```

When off, the `/teacher` route is removed before the build. To create a local or
teacher-only build that reveals answers and progress import/export tools:

```bash
NEXT_PUBLIC_TEACHER_MODE=on npm run build
```

There is no real security in a static app. Treat teacher mode as a separate
deployment or local-only build.

## Offline Behaviour

After the first app load, the service worker caches the app shell and lesson
content. Non-code activities then work offline. Code activities need Pyodide; the
Pyodide files are self-hosted and cached on first successful use. If a student is
offline before Pyodide has loaded once, the rest of the lesson still works and
the code runner reports that Python could not load.

## Content Safety

Run:

```bash
npm run validate:content
```

The validator checks every learner-facing Python code field for banned
constructs, future-scope concepts, unsupported calls, missing explanations, and
model-answer coding-standard violations. It exits non-zero on errors.

Generated support files:

- `CONTENT_AUDIT.md`: lesson activity counts, types, concepts and Python feature
  usage.
- `CONTENT_QA.md`: recorded manual content-QA checklist for British English,
  EAL-friendly wording, local context, duplicate review, difficulty, and feedback.

## Progress Storage

Progress is stored only in browser `localStorage`, under the `infs1101_` prefix.
It includes schema version, content version, XP, streak, last visited lesson,
theme, activity attempts, correctness, whether a model answer was viewed, and
whether XP was already awarded.
