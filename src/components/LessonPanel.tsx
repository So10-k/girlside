import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { lessonById, nextLesson } from '../curriculum';
import { useAppStore } from '../store/useAppStore';
import { safeRun } from '../lib/runChecks';
import ConfirmDialog from './ConfirmDialog';

export default function LessonPanel() {
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const projects = useAppStore((s) => s.projects);
  const project = projects.find((p) => p.id === activeProjectId);
  const openLesson = useAppStore((s) => s.openLesson);
  const resetLesson = useAppStore((s) => s.resetLesson);
  const resetStep = useAppStore((s) => s.resetStep);
  const nextHint = useAppStore((s) => s.nextHint);
  const revealSolution = useAppStore((s) => s.revealSolution);
  const advanceStep = useAppStore((s) => s.advanceStep);
  const previousStep = useAppStore((s) => s.previousStep);

  const [askReset, setAskReset] = useState(false);
  const [askReveal, setAskReveal] = useState(false);

  const isLesson = !!(project && project.kind === 'lesson' && project.sourceId);
  const lesson = isLesson ? lessonById(project!.sourceId!) : undefined;
  const stepIdx = project?.activeStepIndex ?? 0;
  const step = lesson?.steps[stepIdx];
  const stepMatches = lesson && step ? (step.check ? safeRun(step.check, project!.buffers) : true) : false;
  const canAdvance = !!step && stepMatches;
  const isFirst = stepIdx <= 0;
  const isLast = lesson ? stepIdx >= lesson.steps.length - 1 : false;
  const lessonComplete = lesson ? project!.completedLessonIds.includes(lesson.id) : false;

  // Auto-advance when the step check passes and there's no task/hint left to resolve.
  // We DON'T auto-advance — we just enable the Next button. The learner clicks to move on.

  useEffect(() => {
    // If the current step doesn't require a check (story-only step) and it's not the last one,
    // nothing special. Last-step celebration is handled by advanceStep setting justCompletedLessonId.
  }, [stepIdx]);

  if (!project) return null;

  if (!isLesson || !lesson || !step) {
    return (
      <div className="card p-5 animate-fade-up">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{project.emoji}</div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-ink-muted">you're remixing</div>
            <h2 className="font-display text-2xl leading-tight">{project.name}</h2>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">
              Play around! Change colors, words, emojis — there is no wrong move. Your changes save as
              you type.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const upcoming = nextLesson(lesson.id);
  const hintIndex = project.activeHintIndex;
  const hints = step.hints || [];
  const hint = hintIndex >= 0 ? hints[hintIndex] : undefined;
  const hasMoreHints = hintIndex < hints.length - 1;
  const hasHints = hints.length > 0;
  const hasCheck = !!step.check;
  const hasSolution = !!step.solution;
  const totalSteps = lesson.steps.length;
  const stepNumber = stepIdx + 1;
  const progress = Math.round(((stepIdx + (stepMatches ? 1 : 0)) / totalSteps) * 100);

  return (
    <div className="card p-5 animate-fade-up flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl select-none">{lesson.emoji}</div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-ink-muted">
            lesson {lesson.order} · step {stepNumber} of {totalSteps}
          </div>
          <h2 className="font-display text-2xl leading-tight">{lesson.title}</h2>
          {lesson.subtitle && (
            <p className="text-xs text-ink-muted mt-0.5">{lesson.subtitle}</p>
          )}
        </div>
        <AnimatePresence>
          {stepMatches && hasCheck && (
            <motion.span
              key="check"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="chip bg-mint-100 text-mint-500"
            >
              <CheckCircle2 size={14} /> nice!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="h-2 rounded-full bg-lavender-50 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-lavender-300 to-peach-300"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lavender-50 border border-lavender-100 rounded-2xl p-4"
      >
        <div className="flex items-start gap-2">
          {step.emoji && <div className="text-2xl leading-none pt-0.5 select-none">{step.emoji}</div>}
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-ink-muted">{step.title}</div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap mt-1">{step.story}</p>
          </div>
        </div>
      </motion.div>

      {step.task && (
        <div className="bg-white/70 rounded-2xl border border-white/80 p-4">
          <div className="text-xs uppercase tracking-widest text-ink-muted mb-1">try this</div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">{step.task}</p>
        </div>
      )}

      {hasCheck && (
        <motion.div
          layout
          className={`rounded-2xl border p-3 flex items-center gap-3 ${
            stepMatches ? 'bg-mint-50 border-mint-100' : 'bg-white/60 border-white/80'
          }`}
        >
          <span
            className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${
              stepMatches ? 'bg-mint-100 text-mint-500' : 'bg-lavender-100 text-lavender-500'
            }`}
          >
            {stepMatches ? <CheckCircle2 size={16} /> : <Lightbulb size={16} />}
          </span>
          <div className="text-sm leading-snug">
            <div className="font-semibold">
              {stepMatches
                ? step.celebrate || 'Autocheck passed — nice work!'
                : 'Autocheck: keep going…'}
            </div>
            <div className="text-xs text-ink-muted">
              {stepMatches
                ? 'Tap Next when you are ready.'
                : "I'll light up green as soon as the task is done."}
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {hint && (
          <motion.div
            key={hintIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-butter-50 border border-butter-100 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted mb-1">
              <Lightbulb size={12} /> hint {hintIndex + 1} of {hints.length}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-2">
        {hasHints && (
          <button
            className="btn-soft"
            onClick={() => nextHint()}
            disabled={!hasMoreHints && hintIndex >= 0}
            title={
              hintIndex < 0
                ? 'Show a small hint'
                : hasMoreHints
                ? 'Show the next hint'
                : 'That was the last hint'
            }
          >
            <Lightbulb size={14} />
            {hintIndex < 0 ? 'Show a hint' : hasMoreHints ? 'Next hint' : 'No more hints'}
          </button>
        )}
        {hasSolution && (
          <button className="btn-ghost" onClick={() => setAskReveal(true)}>
            <Eye size={14} /> show solution
          </button>
        )}
        {hasCheck && (
          <button
            className="btn-ghost"
            onClick={() => resetStep()}
            title="Start this step over"
          >
            <RotateCcw size={14} /> reset step
          </button>
        )}
        <button className="btn-ghost" onClick={() => setAskReset(true)}>
          <RotateCcw size={14} /> reset lesson
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="btn-ghost"
            onClick={() => previousStep()}
            disabled={isFirst}
            title={isFirst ? 'First step' : 'Previous step'}
          >
            <ArrowLeft size={14} /> back
          </button>
          {isLast ? (
            lessonComplete ? (
              upcoming ? (
                <button className="btn-primary" onClick={() => openLesson(upcoming.id)}>
                  next lesson: {upcoming.title} <ArrowRight size={14} />
                </button>
              ) : (
                <span className="chip bg-mint-100 text-mint-500">
                  <Sparkles size={14} /> curriculum complete!
                </span>
              )
            ) : (
              <button
                className="btn-primary"
                onClick={() => advanceStep()}
                title="Finish this lesson"
              >
                finish lesson <Sparkles size={14} />
              </button>
            )
          ) : (
            <button
              className={canAdvance ? 'btn-primary' : 'btn bg-white/60 text-ink-muted cursor-not-allowed'}
              onClick={() => canAdvance && advanceStep()}
              disabled={!canAdvance}
              title={canAdvance ? 'Go to the next step' : 'Finish the task above first'}
            >
              next step <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={askReset}
        title="Reset this lesson?"
        body="This will go back to step 1 and the starter code. Your progress on other lessons stays safe."
        confirmLabel="Reset lesson"
        tone="danger"
        onConfirm={() => {
          setAskReset(false);
          resetLesson();
        }}
        onCancel={() => setAskReset(false)}
      />
      <ConfirmDialog
        open={askReveal}
        title="Peek at the solution?"
        body="Totally fine to look! We'll drop the answer into your editor and you can learn from it."
        confirmLabel="Show me"
        onConfirm={() => {
          setAskReveal(false);
          revealSolution();
        }}
        onCancel={() => setAskReveal(false)}
      />
    </div>
  );
}
