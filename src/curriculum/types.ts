import type { CheckFn } from '../lib/runChecks';

export interface LessonStarter {
  html: string;
  css: string;
  js: string;
}

export type InteractiveStep =
  | {
      kind: 'intro';
      /** Big cheerful lines that animate in one by one. */
      lines: string[];
      sound?: 'welcome' | 'soft' | 'sparkle';
      emoji?: string;
    }
  | {
      kind: 'press-key';
      /** Single key to press, e.g. "a", " ", "Shift". Case-insensitive for letters. */
      target: string;
      /** Shown as the hint (e.g. "press the letter A"). */
      prompt: string;
    }
  | {
      kind: 'press-sequence';
      /** Sequence of keys to press in order. */
      sequence: string[];
      prompt: string;
    }
  | {
      kind: 'autoclose-demo';
      /** Animated demo showing how autocompleted close-tags work. */
      prompt?: string;
    };

export interface LessonStep {
  id: string;
  title: string;
  emoji?: string;
  /** 1–3 gentle sentences explaining the idea. Plain words, short. */
  story: string;
  /** Optional concrete thing to do — if omitted, the step is just story and
   *  the student clicks Next when they're ready. */
  task?: string;
  hints?: string[];
  /** Optional — if set, opening this step resets the buffers to this state.
   *  Leave undefined to carry forward the student's code from the previous step. */
  starter?: LessonStarter;
  /** Optional "what it should look like after this step". Used for the
   *  "show me" button and as the starting point for later steps that include it. */
  solution?: LessonStarter;
  /** Optional autocheck. If omitted, the step is always considered done and
   *  the Next button is always enabled. */
  check?: CheckFn;
  /** Optional one-line cheer when this step passes. */
  celebrate?: string;
  /** When true, hide the code editor + preview panels for this step so the
   *  learner focuses on the interactive panel instead. */
  hideEditor?: boolean;
  /** Optional interactive experience (keyboard practice, animated intro,
   *  autoclose demo). Rendered in the main area when the editor is hidden. */
  interactive?: InteractiveStep;
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  subtitle?: string;
  emoji: string;
  focusTab: 'html' | 'css' | 'js';
  steps: LessonStep[];
  /** One-line hit of congratulations when ALL steps complete. */
  celebrate: string;
}

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  color: 'lavender' | 'peach' | 'mint' | 'butter' | 'rose';
  lessonIds: string[];
}

/** Required starter for step 0 — if a step has no starter, it inherits from
 *  here on a clean open. */
export function openingStarter(lesson: Lesson): LessonStarter {
  return (
    lesson.steps[0].starter || {
      html: `<body>\n  \n</body>\n`,
      css: `body { font-family: system-ui, sans-serif; padding: 40px; }\n`,
      js: ``,
    }
  );
}

export type { CheckFn };
