import type { Lesson, Unit } from './types';
import l0 from './lessons/00-keyboard-basics';
import l1 from './lessons/01-hello-heading';
import l2 from './lessons/02-paragraphs';
import l3 from './lessons/03-colors-and-fonts';
import l4 from './lessons/04-backgrounds-spacing';
import l5 from './lessons/05-buttons-and-links';
import l6 from './lessons/06-images';
import l7 from './lessons/07-flex-layout';
import l8 from './lessons/08-first-javascript';
import l9 from './lessons/09-forms';
import l10 from './lessons/10-database';
import l11 from './lessons/11-login';

export const LESSONS: Lesson[] = [l0, l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11];

export const UNITS: Unit[] = [
  {
    id: 'unit-00-welcome',
    title: 'Before we begin',
    subtitle: 'Meet your keyboard (no code yet!)',
    color: 'rose',
    lessonIds: [l0.id],
  },
  {
    id: 'unit-01-hello',
    title: 'Hello, Web!',
    subtitle: 'Your very first words on a page',
    color: 'lavender',
    lessonIds: [l1.id, l2.id],
  },
  {
    id: 'unit-02-style',
    title: 'Make it pretty',
    subtitle: 'Colors, fonts, and cozy spacing',
    color: 'peach',
    lessonIds: [l3.id, l4.id],
  },
  {
    id: 'unit-03-click',
    title: 'Clickable things',
    subtitle: 'Links, buttons, and pictures',
    color: 'mint',
    lessonIds: [l5.id, l6.id],
  },
  {
    id: 'unit-04-layout',
    title: 'Arranging your page',
    subtitle: 'Side by side with flexbox',
    color: 'butter',
    lessonIds: [l7.id],
  },
  {
    id: 'unit-05-move',
    title: 'Make it move',
    subtitle: 'Your first bit of JavaScript',
    color: 'rose',
    lessonIds: [l8.id],
  },
  {
    id: 'unit-06-advanced',
    title: 'Build a portal site',
    subtitle: 'Forms, a tiny database, and real logins ✨',
    color: 'lavender',
    lessonIds: [l9.id, l10.id, l11.id],
  },
];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function unitById(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function nextLesson(id: string): Lesson | undefined {
  const idx = LESSONS.findIndex((l) => l.id === id);
  if (idx < 0 || idx === LESSONS.length - 1) return undefined;
  return LESSONS[idx + 1];
}

export const FIRST_LESSON_ID = LESSONS[0].id;
