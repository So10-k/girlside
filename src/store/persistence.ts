import { get, set, del, keys } from 'idb-keyval';
import type { Buffers } from '../lib/buildSrcDoc';

const VERSION_KEY = 'girlside:version';
const CURRENT_VERSION = 1;
const STATE_KEY = 'girlside:state';
const PROJECT_PREFIX = 'girlside:project:';
const SNAPSHOT_PREFIX = 'girlside:snapshot:';

export type ProjectKind = 'lesson' | 'template' | 'custom';

export interface ProjectRecord {
  id: string;
  name: string;
  emoji: string;
  kind: ProjectKind;
  /** lesson id or template id depending on kind */
  sourceId?: string;
  buffers: Buffers;
  createdAt: number;
  updatedAt: number;
  completedLessonIds: string[];
  activeHintIndex: number;
  /** index into the lesson's `steps` array; only meaningful for lesson projects */
  activeStepIndex?: number;
  /** ids of steps within the current lesson the user has satisfied */
  completedStepIds?: string[];
}

export interface Snapshot {
  id: string;
  projectId: string;
  createdAt: number;
  label?: string;
  buffers: Buffers;
}

export interface PersistedUI {
  activeProjectId?: string;
  activeTab?: 'html' | 'css' | 'js';
  beginnerMode?: boolean;
  welcomeSeen?: boolean;
  view?: 'home' | 'ide';
  /** lesson ids the user has ever completed, across any project — unlocks curriculum */
  unlockedThrough?: string[];
}

async function ensureVersion() {
  const v = await get<number>(VERSION_KEY);
  if (!v) {
    await set(VERSION_KEY, CURRENT_VERSION);
  }
}

export async function loadUI(): Promise<PersistedUI> {
  await ensureVersion();
  return (await get<PersistedUI>(STATE_KEY)) || {};
}

export async function saveUI(ui: PersistedUI): Promise<void> {
  await set(STATE_KEY, ui);
}

export async function loadProjects(): Promise<ProjectRecord[]> {
  const ks = await keys();
  const projectKeys = ks.filter(
    (k): k is string => typeof k === 'string' && k.startsWith(PROJECT_PREFIX),
  );
  const out: ProjectRecord[] = [];
  for (const k of projectKeys) {
    const p = await get<ProjectRecord>(k);
    if (p) out.push(p);
  }
  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out;
}

export async function saveProject(project: ProjectRecord): Promise<void> {
  await set(PROJECT_PREFIX + project.id, project);
}

export async function deleteProject(id: string): Promise<void> {
  await del(PROJECT_PREFIX + id);
  // also drop snapshots
  const ks = await keys();
  for (const k of ks) {
    if (typeof k === 'string' && k.startsWith(SNAPSHOT_PREFIX + id + ':')) {
      await del(k);
    }
  }
}

export async function listSnapshots(projectId: string): Promise<Snapshot[]> {
  const ks = await keys();
  const mine = ks.filter(
    (k): k is string => typeof k === 'string' && k.startsWith(SNAPSHOT_PREFIX + projectId + ':'),
  );
  const out: Snapshot[] = [];
  for (const k of mine) {
    const s = await get<Snapshot>(k);
    if (s) out.push(s);
  }
  out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}

export async function addSnapshot(s: Snapshot): Promise<void> {
  await set(SNAPSHOT_PREFIX + s.projectId + ':' + s.id, s);
  // Keep only the last 30 per project
  const all = await listSnapshots(s.projectId);
  if (all.length > 30) {
    const extras = all.slice(30);
    for (const extra of extras) {
      await del(SNAPSHOT_PREFIX + extra.projectId + ':' + extra.id);
    }
  }
}

export async function deleteSnapshot(projectId: string, snapshotId: string): Promise<void> {
  await del(SNAPSHOT_PREFIX + projectId + ':' + snapshotId);
}
