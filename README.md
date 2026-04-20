# Girlside ♡

A warm, patient teaching IDE for learning HTML, CSS, and JavaScript — built to feel like a creative studio, not a scary developer tool.

## What's inside

- **Guided curriculum** — 8 tiny lessons, in order, with a goal, an explanation, a task, progressive hints, and a solution reveal.
- **Three-tab editor** — `index.html`, `styles.css`, `script.js`, with CodeMirror 6 syntax highlighting.
- **Live preview** — sandboxed iframe that updates as you type. Desktop and phone sizes.
- **Autosave everything** — every keystroke is saved to IndexedDB within 400ms. No account, no network.
- **Snapshot history** — save named versions of your project and restore at any time (last 30 per project).
- **Beginner-friendly error messages** — JavaScript errors are rewritten in plain English.
- **Explain this line** — click any line in the editor and the tutor panel explains what it does.
- **Starter projects** — Profile Page, Favorite Things, Photo Gallery, Birthday Invite, Mini Quiz.
- **Soft, pastel design** — Inter + Fraunces + JetBrains Mono, rounded corners, confetti when you finish a lesson.

## Running locally

```bash
cd girlside
npm install
npm run dev
```

Vite will print a local URL (default `http://localhost:5173`). Open it in any modern browser. Everything runs client-side.

### Build for production

```bash
npm run build
npm run preview
```

## Code layout

```
src/
  App.tsx, main.tsx, styles/globals.css
  components/    # React UI (AppShell, Sidebar, LessonPanel, CodeEditor, Preview, TutorPanel, …)
  store/         # Zustand + IndexedDB persistence + snapshots
  lib/           # buildSrcDoc, format, explain, runChecks
  curriculum/    # types + 8 lesson files
  projects/      # starter project templates
```

## Adding a new lesson

1. Create `src/curriculum/lessons/09-my-lesson.ts` exporting a `Lesson` default.
2. Register it in `src/curriculum/index.ts` (add to `LESSONS` and include its id in the right unit's `lessonIds`).

Each `Lesson` defines a `starter`, `task`, `hints`, `solution`, and a `check(buffers)` function that decides when the lesson is satisfied.

## What to build next (after MVP)

- Optional Claude-API tutor (bring-your-own-key) for richer explanations.
- Import/export projects as `.zip`.
- Shareable read-only preview links.
- Badges, streaks, and a more elaborate progress page.
- More units: forms, grid layout, fetch, tiny games.
- Tablet / mobile layout pass.
