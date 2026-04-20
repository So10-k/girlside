import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FolderHeart,
  Lock,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { LESSONS, UNITS, lessonById } from '../curriculum';
import { TEMPLATES } from '../projects';
import {
  anyCompletedLesson,
  isLessonUnlocked,
  totalLessons,
  useAppStore,
} from '../store/useAppStore';
import ConfirmDialog from './ConfirmDialog';

const unitTint: Record<string, string> = {
  lavender: 'from-lavender-100 to-white',
  peach: 'from-peach-100 to-white',
  mint: 'from-mint-100 to-white',
  butter: 'from-butter-100 to-white',
  rose: 'from-rose-100 to-white',
};

const unitChip: Record<string, string> = {
  lavender: 'bg-lavender-100 text-lavender-500',
  peach: 'bg-peach-100 text-rose-500',
  mint: 'bg-mint-100 text-mint-500',
  butter: 'bg-butter-100 text-ink',
  rose: 'bg-rose-100 text-rose-500',
};

function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function Home() {
  const projects = useAppStore((s) => s.projects);
  const openLesson = useAppStore((s) => s.openLesson);
  const openTemplate = useAppStore((s) => s.openTemplate);
  const openProject = useAppStore((s) => s.openProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const createBlankProject = useAppStore((s) => s.createBlankProject);

  const completed = useMemo(() => anyCompletedLesson(projects), [projects]);
  const doneCount = [...completed].filter((id) => LESSONS.some((l) => l.id === id)).length;
  const total = totalLessons();
  const percent = Math.round((doneCount / total) * 100);

  const lastProject = projects[0];
  const [toDelete, setToDelete] = useState<string | undefined>(undefined);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-12">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-end justify-between flex-wrap gap-4 mb-8"
        >
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-ink-muted mb-1">
              welcome back
            </div>
            <h1 className="font-display text-4xl sm:text-5xl leading-tight">
              Let's build something <span className="text-rose-500">lovely</span> today.
            </h1>
            <p className="text-ink-soft mt-2 max-w-xl leading-relaxed">
              Pick up where you left off, start a new lesson, or remix a starter project. Your
              work saves itself — you can't lose it.
            </p>
          </div>
          <div className="card px-4 py-3 min-w-[200px]">
            <div className="text-[11px] uppercase tracking-widest text-ink-muted">your progress</div>
            <div className="mt-1 text-sm flex items-center justify-between">
              <span className="font-semibold">
                {doneCount} / {total} lessons
              </span>
              <span className="text-ink-muted text-xs">{percent}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-lavender-100 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-lavender-500 to-rose-500"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.header>

        {/* Continue card */}
        {lastProject && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            onClick={() => openProject(lastProject.id)}
            className="group w-full text-left card p-5 mb-8 flex items-center gap-4 hover:shadow-pop transition-shadow"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender-100 to-peach-100 grid place-items-center text-3xl shrink-0">
              {lastProject.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-ink-muted">continue</div>
              <div className="font-display text-2xl truncate">{lastProject.name}</div>
              <div className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                <Clock size={11} /> edited {relTime(lastProject.updatedAt)}
              </div>
            </div>
            <div className="btn-primary group-hover:translate-x-0.5 transition-transform">
              open <ArrowRight size={14} />
            </div>
          </motion.button>
        )}

        {/* My projects */}
        <section className="mb-10">
          <SectionHeader icon={<FolderHeart size={14} />} title="my projects" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={createBlankProject}
              className="card p-4 text-left border-dashed border-2 border-lavender-200 bg-white/40 hover:bg-white/70 transition-colors flex items-center gap-3 min-h-[110px]"
            >
              <div className="w-10 h-10 rounded-xl bg-lavender-100 text-lavender-500 grid place-items-center">
                <Plus size={18} />
              </div>
              <div>
                <div className="font-semibold">Start blank</div>
                <div className="text-xs text-ink-muted">A fresh HTML / CSS / JS file to play with.</div>
              </div>
            </button>

            {projects.length === 0 && (
              <div className="card p-5 text-sm text-ink-muted sm:col-span-2 lg:col-span-2 flex items-center gap-3">
                <Sparkles size={16} className="text-lavender-500" />
                Your projects will show up here once you start a lesson or remix a starter below.
              </div>
            )}

            {projects.map((p) => (
              <div
                key={p.id}
                className="group card p-4 flex items-start gap-3 relative hover:shadow-pop transition-shadow"
              >
                <button
                  onClick={() => openProject(p.id)}
                  className="absolute inset-0 rounded-2xl"
                  aria-label={`Open ${p.name}`}
                />
                <div className="w-10 h-10 rounded-xl bg-white text-xl grid place-items-center shrink-0">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0 relative pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate">{p.name}</span>
                    {p.kind === 'lesson' && p.sourceId && (
                      <span className="chip bg-lavender-100 text-lavender-500 !py-0.5 !px-2 text-[10px]">
                        lesson
                      </span>
                    )}
                    {p.kind === 'template' && (
                      <span className="chip bg-peach-100 text-rose-500 !py-0.5 !px-2 text-[10px]">
                        remix
                      </span>
                    )}
                    {p.kind === 'custom' && (
                      <span className="chip bg-mint-100 text-mint-500 !py-0.5 !px-2 text-[10px]">
                        custom
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5">
                    edited {relTime(p.updatedAt)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setToDelete(p.id);
                  }}
                  className="relative z-10 opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-ink-muted hover:text-rose-500 hover:bg-white"
                  title="Delete project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum */}
        <section className="mb-10">
          <SectionHeader icon={<BookOpen size={14} />} title="curriculum" />
          <div className="grid gap-5">
            {UNITS.map((unit) => {
              const lessons = unit.lessonIds.map((id) => lessonById(id)!);
              const unitDone = lessons.filter((l) => completed.has(l.id)).length;
              return (
                <div
                  key={unit.id}
                  className={`card p-5 bg-gradient-to-br ${unitTint[unit.color]}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`chip ${unitChip[unit.color]}`}>{unit.title}</span>
                    <span className="text-xs text-ink-muted ml-auto">
                      {unitDone} / {lessons.length} done
                    </span>
                  </div>
                  <p className="text-sm text-ink-soft mb-3">{unit.subtitle}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {lessons.map((l) => {
                      const done = completed.has(l.id);
                      const unlocked = isLessonUnlocked(l.id, completed);
                      return (
                        <button
                          key={l.id}
                          disabled={!unlocked}
                          onClick={() => openLesson(l.id)}
                          className={`text-left p-3 rounded-xl flex items-center gap-3 transition-colors border ${
                            unlocked
                              ? 'bg-white/90 hover:bg-white border-white/80'
                              : 'bg-white/40 border-white/60 text-ink-muted cursor-not-allowed'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl grid place-items-center text-lg shrink-0 ${
                              done
                                ? 'bg-mint-100 text-mint-500'
                                : unlocked
                                  ? 'bg-lavender-100 text-lavender-500'
                                  : 'bg-white text-ink-muted'
                            }`}
                          >
                            {done ? <CheckCircle2 size={18} /> : unlocked ? l.emoji : <Lock size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] uppercase tracking-widest text-ink-muted">
                              lesson {l.order}
                            </div>
                            <div className="font-semibold truncate">{l.title}</div>
                          </div>
                          {done && (
                            <span className="chip bg-mint-100 text-mint-500 !py-0.5 !px-2 text-[10px]">
                              done
                            </span>
                          )}
                          {!unlocked && (
                            <span className="chip bg-white text-ink-muted !py-0.5 !px-2 text-[10px]">
                              locked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Starter projects */}
        <section className="mb-12">
          <SectionHeader icon={<Sparkles size={14} />} title="starter projects" />
          <p className="text-sm text-ink-soft mb-4 -mt-2">
            Fully-made little sites you can open and remix. Great for playing around.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => openTemplate(t.id)}
                className="card p-5 text-left hover:shadow-pop transition-shadow flex flex-col gap-2 min-h-[140px]"
              >
                <div className="text-3xl">{t.emoji}</div>
                <div className="font-display text-xl">{t.title}</div>
                <div className="text-sm text-ink-soft line-clamp-2">{t.blurb}</div>
                <div className="mt-auto text-xs text-lavender-500 font-semibold flex items-center gap-1">
                  remix this <ArrowRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <footer className="text-center text-xs text-ink-muted py-6">
          made with care · all your work is saved right here on this device
        </footer>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Remove this project?"
        body="It'll be gone from your list. Your other projects stay safe."
        confirmLabel="Remove it"
        tone="danger"
        onConfirm={() => {
          if (toDelete) deleteProject(toDelete);
          setToDelete(undefined);
        }}
        onCancel={() => setToDelete(undefined)}
      />
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 text-ink-muted text-xs uppercase tracking-[0.2em]">
      {icon} {title}
    </div>
  );
}
