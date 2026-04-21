import { create } from 'zustand';
import type { Buffers } from '../lib/buildSrcDoc';
import {
  addSnapshot,
  deleteProject as dbDeleteProject,
  deleteSnapshot as dbDeleteSnapshot,
  listSnapshots,
  loadProjects,
  loadUI,
  ProjectRecord,
  saveProject,
  saveUI,
  Snapshot,
} from './persistence';
import { LESSONS, lessonById } from '../curriculum';
import { TEMPLATES, templateById } from '../projects';
import { uid } from '../lib/ids';

type Tab = 'html' | 'css' | 'js';
type View = 'home' | 'ide';

export type SaveState = 'idle' | 'saving' | 'saved';

interface AppState {
  ready: boolean;
  view: View;
  projects: ProjectRecord[];
  activeProjectId?: string;
  activeTab: Tab;
  beginnerMode: boolean;
  welcomeSeen: boolean;
  saveState: SaveState;
  lastSavedAt?: number;

  snapshots: Snapshot[];

  // ephemeral feedback
  justCompletedLessonId?: string;
  previewError?: { title: string; hint: string };
  consoleLines: string[];

  init: () => Promise<void>;
  goHome: () => void;
  setActiveTab: (t: Tab) => void;
  setBeginnerMode: (v: boolean) => void;
  dismissWelcome: () => void;

  openLesson: (lessonId: string) => Promise<void>;
  openTemplate: (templateId: string) => Promise<void>;
  openProject: (projectId: string) => Promise<void>;
  createBlankProject: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  renameProject: (projectId: string, name: string) => Promise<void>;

  updateBuffer: (key: keyof Buffers, value: string) => void;
  resetLesson: () => Promise<void>;
  resetStep: () => void;
  revealSolution: () => void;
  nextHint: () => void;
  advanceStep: () => Promise<void>;
  previousStep: () => void;
  formatActiveBuffer: (fn: (lang: 'html' | 'css' | 'js', src: string) => Promise<string>) => Promise<void>;

  saveSnapshot: (label?: string) => Promise<void>;
  restoreSnapshot: (snapshotId: string) => Promise<void>;
  removeSnapshot: (snapshotId: string) => Promise<void>;

  setPreviewError: (err?: { title: string; hint: string }) => void;
  pushConsoleLine: (line: string) => void;
  clearConsole: () => void;
  setCompleted: (lessonId: string) => Promise<void>;
  dismissCelebration: () => void;
}

let saveTimer: number | undefined;
let flushLatest: (() => Promise<void>) | undefined;

function newProjectFromLesson(lessonId: string): ProjectRecord {
  const lesson = lessonById(lessonId)!;
  const firstStarter = lesson.steps[0].starter || {
    html: `<body>\n  \n</body>\n`,
    css: `body { font-family: system-ui, sans-serif; padding: 40px; }\n`,
    js: '',
  };
  return {
    id: uid('proj'),
    kind: 'lesson',
    sourceId: lesson.id,
    name: lesson.title,
    emoji: lesson.emoji,
    buffers: { ...firstStarter },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedLessonIds: [],
    activeHintIndex: -1,
    activeStepIndex: 0,
    completedStepIds: [],
  };
}

function newProjectFromTemplate(templateId: string): ProjectRecord {
  const t = templateById(templateId)!;
  return {
    id: uid('proj'),
    kind: 'template',
    sourceId: t.id,
    name: t.title,
    emoji: t.emoji,
    buffers: { html: t.html, css: t.css, js: t.js },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedLessonIds: [],
    activeHintIndex: -1,
  };
}

function newBlankProject(): ProjectRecord {
  return {
    id: uid('proj'),
    kind: 'custom',
    name: 'Untitled project',
    emoji: '✨',
    buffers: {
      html: `<body>\n  <h1>Hello!</h1>\n  <p>This is my new page.</p>\n</body>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 40px;\n  background: #FFFBF5;\n  color: #2B2140;\n}\n`,
      js: `// Write any JavaScript here\n`,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedLessonIds: [],
    activeHintIndex: -1,
  };
}

export const useAppStore = create<AppState>((setState, getState) => {
  const activeProject = (): ProjectRecord | undefined => {
    const s = getState();
    return s.projects.find((p) => p.id === s.activeProjectId);
  };

  const queueSave = () => {
    setState({ saveState: 'saving' });
    if (saveTimer) window.clearTimeout(saveTimer);
    const doFlush = async () => {
      const p = activeProject();
      if (p) await saveProject(p);
      await saveUI({
        activeProjectId: getState().activeProjectId,
        activeTab: getState().activeTab,
        beginnerMode: getState().beginnerMode,
        welcomeSeen: getState().welcomeSeen,
        view: getState().view,
      });
      setState({ saveState: 'saved', lastSavedAt: Date.now() });
    };
    flushLatest = doFlush;
    saveTimer = window.setTimeout(() => {
      doFlush();
    }, 400);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      if (flushLatest) flushLatest();
    });
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && flushLatest) flushLatest();
    });
  }

  return {
    ready: false,
    view: 'home',
    projects: [],
    activeTab: 'html',
    beginnerMode: true,
    welcomeSeen: false,
    saveState: 'idle',
    consoleLines: [],
    snapshots: [],

    init: async () => {
      const ui = await loadUI();
      const projects = await loadProjects();
      const activeProjectId =
        ui.activeProjectId && projects.find((p) => p.id === ui.activeProjectId)
          ? ui.activeProjectId
          : undefined;

      setState({
        ready: true,
        view: ui.view === 'ide' && activeProjectId ? 'ide' : 'home',
        projects,
        activeProjectId,
        activeTab: ui.activeTab || 'html',
        beginnerMode: ui.beginnerMode ?? true,
        welcomeSeen: !!ui.welcomeSeen,
      });

      if (activeProjectId) {
        const snaps = await listSnapshots(activeProjectId);
        setState({ snapshots: snaps });
      }
    },

    goHome: () => {
      setState({ view: 'home', previewError: undefined, consoleLines: [] });
      queueSave();
    },

    setActiveTab: (t) => {
      setState({ activeTab: t });
      queueSave();
    },

    setBeginnerMode: (v) => {
      setState({ beginnerMode: v });
      queueSave();
    },

    dismissWelcome: () => {
      setState({ welcomeSeen: true });
      queueSave();
    },

    openLesson: async (lessonId) => {
      const existing = getState().projects.find(
        (p) => p.kind === 'lesson' && p.sourceId === lessonId,
      );
      let project: ProjectRecord;
      if (existing) {
        project = existing;
      } else {
        project = newProjectFromLesson(lessonId);
        await saveProject(project);
      }
      const lesson = lessonById(lessonId)!;
      const next = [project, ...getState().projects.filter((p) => p.id !== project.id)];
      setState({
        view: 'ide',
        projects: next,
        activeProjectId: project.id,
        activeTab: lesson.focusTab,
        snapshots: await listSnapshots(project.id),
        previewError: undefined,
        consoleLines: [],
      });
      queueSave();
    },

    openTemplate: async (templateId) => {
      const project = newProjectFromTemplate(templateId);
      await saveProject(project);
      setState({
        view: 'ide',
        projects: [project, ...getState().projects],
        activeProjectId: project.id,
        activeTab: 'html',
        snapshots: [],
        previewError: undefined,
        consoleLines: [],
      });
      queueSave();
    },

    openProject: async (projectId) => {
      const p = getState().projects.find((pp) => pp.id === projectId);
      if (!p) return;
      setState({
        view: 'ide',
        activeProjectId: projectId,
        snapshots: await listSnapshots(projectId),
        previewError: undefined,
        consoleLines: [],
      });
      queueSave();
    },

    createBlankProject: async () => {
      const p = newBlankProject();
      await saveProject(p);
      setState({
        view: 'ide',
        projects: [p, ...getState().projects],
        activeProjectId: p.id,
        activeTab: 'html',
        snapshots: [],
        previewError: undefined,
        consoleLines: [],
      });
      queueSave();
    },

    deleteProject: async (projectId) => {
      await dbDeleteProject(projectId);
      const remaining = getState().projects.filter((p) => p.id !== projectId);
      let activeProjectId = getState().activeProjectId;
      if (activeProjectId === projectId) {
        activeProjectId = remaining[0]?.id;
      }
      setState({ projects: remaining, activeProjectId });
      if (activeProjectId) {
        const snaps = await listSnapshots(activeProjectId);
        setState({ snapshots: snaps });
      } else {
        setState({ snapshots: [] });
      }
      queueSave();
    },

    renameProject: async (projectId, name) => {
      const projects = getState().projects.map((p) =>
        p.id === projectId ? { ...p, name, updatedAt: Date.now() } : p,
      );
      setState({ projects });
      const p = projects.find((pp) => pp.id === projectId);
      if (p) await saveProject(p);
      queueSave();
    },

    updateBuffer: (key, value) => {
      const id = getState().activeProjectId;
      if (!id) return;
      const projects = getState().projects.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          buffers: { ...p.buffers, [key]: value },
          updatedAt: Date.now(),
        };
      });
      setState({ projects });
      queueSave();
    },

    resetLesson: async () => {
      const p = activeProject();
      if (!p || p.kind !== 'lesson' || !p.sourceId) return;
      const lesson = lessonById(p.sourceId);
      if (!lesson) return;
      const starter = lesson.steps[0].starter || p.buffers;
      const projects = getState().projects.map((pp) =>
        pp.id === p.id
          ? {
              ...pp,
              buffers: { ...starter },
              activeHintIndex: -1,
              activeStepIndex: 0,
              completedStepIds: [],
              updatedAt: Date.now(),
            }
          : pp,
      );
      setState({ projects, previewError: undefined, consoleLines: [] });
      queueSave();
    },

    resetStep: () => {
      const p = activeProject();
      if (!p || p.kind !== 'lesson' || !p.sourceId) return;
      const lesson = lessonById(p.sourceId);
      if (!lesson) return;
      const idx = p.activeStepIndex ?? 0;
      const step = lesson.steps[idx];
      const starter =
        step.starter ||
        lesson.steps[idx - 1]?.solution ||
        lesson.steps[0].starter ||
        p.buffers;
      const projects = getState().projects.map((pp) =>
        pp.id === p.id ? { ...pp, buffers: { ...starter }, activeHintIndex: -1, updatedAt: Date.now() } : pp,
      );
      setState({ projects });
      queueSave();
    },

    revealSolution: () => {
      const p = activeProject();
      if (!p || p.kind !== 'lesson' || !p.sourceId) return;
      const lesson = lessonById(p.sourceId);
      if (!lesson) return;
      const idx = p.activeStepIndex ?? 0;
      const step = lesson.steps[idx];
      if (!step.solution) return;
      const projects = getState().projects.map((pp) =>
        pp.id === p.id
          ? { ...pp, buffers: { ...step.solution! }, activeHintIndex: (step.hints?.length ?? 1) - 1, updatedAt: Date.now() }
          : pp,
      );
      setState({ projects });
      queueSave();
    },

    nextHint: () => {
      const p = activeProject();
      if (!p || p.kind !== 'lesson' || !p.sourceId) return;
      const lesson = lessonById(p.sourceId);
      if (!lesson) return;
      const idx = p.activeStepIndex ?? 0;
      const hints = lesson.steps[idx].hints || [];
      if (hints.length === 0) return;
      const nextIdx = Math.min(p.activeHintIndex + 1, hints.length - 1);
      const projects = getState().projects.map((pp) =>
        pp.id === p.id ? { ...pp, activeHintIndex: nextIdx, updatedAt: Date.now() } : pp,
      );
      setState({ projects });
      queueSave();
    },

    advanceStep: async () => {
      const p = activeProject();
      if (!p || p.kind !== 'lesson' || !p.sourceId) return;
      const lesson = lessonById(p.sourceId);
      if (!lesson) return;
      const idx = p.activeStepIndex ?? 0;
      const step = lesson.steps[idx];
      const stepDone = [...(p.completedStepIds || [])];
      if (!stepDone.includes(step.id)) stepDone.push(step.id);
      const isLast = idx >= lesson.steps.length - 1;
      const nextIdx = Math.min(idx + 1, lesson.steps.length - 1);
      const projects = getState().projects.map((pp) =>
        pp.id === p.id
          ? {
              ...pp,
              activeStepIndex: nextIdx,
              activeHintIndex: -1,
              completedStepIds: stepDone,
              completedLessonIds: isLast && !pp.completedLessonIds.includes(lesson.id)
                ? [...pp.completedLessonIds, lesson.id]
                : pp.completedLessonIds,
              updatedAt: Date.now(),
            }
          : pp,
      );
      setState({
        projects,
        justCompletedLessonId: isLast && !p.completedLessonIds.includes(lesson.id) ? lesson.id : getState().justCompletedLessonId,
      });
      queueSave();
    },

    previousStep: () => {
      const p = activeProject();
      if (!p || p.kind !== 'lesson' || !p.sourceId) return;
      const idx = p.activeStepIndex ?? 0;
      if (idx <= 0) return;
      const projects = getState().projects.map((pp) =>
        pp.id === p.id ? { ...pp, activeStepIndex: idx - 1, activeHintIndex: -1, updatedAt: Date.now() } : pp,
      );
      setState({ projects });
      queueSave();
    },

    formatActiveBuffer: async (fn) => {
      const p = activeProject();
      if (!p) return;
      const tab = getState().activeTab;
      const src = p.buffers[tab];
      const formatted = await fn(tab, src);
      getState().updateBuffer(tab, formatted);
    },

    saveSnapshot: async (label) => {
      const p = activeProject();
      if (!p) return;
      const snap: Snapshot = {
        id: uid('snap'),
        projectId: p.id,
        createdAt: Date.now(),
        label,
        buffers: { ...p.buffers },
      };
      await addSnapshot(snap);
      const snaps = await listSnapshots(p.id);
      setState({ snapshots: snaps });
    },

    restoreSnapshot: async (snapshotId) => {
      const p = activeProject();
      if (!p) return;
      const snap = getState().snapshots.find((s) => s.id === snapshotId);
      if (!snap) return;
      const projects = getState().projects.map((pp) =>
        pp.id === p.id ? { ...pp, buffers: { ...snap.buffers }, updatedAt: Date.now() } : pp,
      );
      setState({ projects });
      queueSave();
    },

    removeSnapshot: async (snapshotId) => {
      const p = activeProject();
      if (!p) return;
      await dbDeleteSnapshot(p.id, snapshotId);
      setState({ snapshots: getState().snapshots.filter((s) => s.id !== snapshotId) });
    },

    setPreviewError: (err) => setState({ previewError: err }),
    pushConsoleLine: (line) => {
      const lines = [...getState().consoleLines, line].slice(-50);
      setState({ consoleLines: lines });
    },
    clearConsole: () => setState({ consoleLines: [] }),

    setCompleted: async (lessonId) => {
      const p = activeProject();
      if (!p) return;
      if (p.completedLessonIds.includes(lessonId)) return;
      const projects = getState().projects.map((pp) =>
        pp.id === p.id
          ? { ...pp, completedLessonIds: [...pp.completedLessonIds, lessonId], updatedAt: Date.now() }
          : pp,
      );
      setState({ projects, justCompletedLessonId: lessonId });
      queueSave();
    },

    dismissCelebration: () => setState({ justCompletedLessonId: undefined }),
  };
});

export function anyCompletedLesson(projects: ProjectRecord[]): Set<string> {
  const out = new Set<string>();
  for (const p of projects) for (const id of p.completedLessonIds) out.add(id);
  return out;
}

/**
 * A lesson is unlocked if:
 *  - it's lesson 0 or lesson 1 (lesson 0 is the optional keyboard intro; lesson 1
 *    is always the real start, so existing learners don't get locked out when we
 *    prepend lesson 0),
 *  - OR the learner has already completed it,
 *  - OR the previous lesson has been completed in any project.
 */
export function isLessonUnlocked(lessonId: string, completed: Set<string>): boolean {
  const idx = LESSONS.findIndex((l) => l.id === lessonId);
  if (idx <= 1) return true;
  if (completed.has(lessonId)) return true;
  return completed.has(LESSONS[idx - 1].id);
}

export function totalLessons(): number {
  return LESSONS.length;
}

export function totalTemplates(): number {
  return TEMPLATES.length;
}
