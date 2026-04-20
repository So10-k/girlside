import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Sparkles, Wand2 } from 'lucide-react';
import LessonPanel from './LessonPanel';
import EditorTabs from './EditorTabs';
import CodeEditor from './CodeEditor';
import InteractiveStep from './InteractiveStep';
import Preview from './Preview';
import TutorPanel from './TutorPanel';
import SaveStatus from './SaveStatus';
import SnapshotHistory from './SnapshotHistory';
import ConfettiBurst from './ConfettiBurst';
import Welcome from './Welcome';
import Home from './Home';
import ProjectNameField from './ProjectNameField';
import { useAppStore } from '../store/useAppStore';
import { lessonById } from '../curriculum';
import { formatCode } from '../lib/format';

export default function AppShell() {
  const ready = useAppStore((s) => s.ready);
  const view = useAppStore((s) => s.view);
  const goHome = useAppStore((s) => s.goHome);
  const beginnerMode = useAppStore((s) => s.beginnerMode);
  const setBeginnerMode = useAppStore((s) => s.setBeginnerMode);
  const welcomeSeen = useAppStore((s) => s.welcomeSeen);
  const dismissWelcome = useAppStore((s) => s.dismissWelcome);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const projects = useAppStore((s) => s.projects);
  const project = projects.find((p) => p.id === activeProjectId);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const updateBuffer = useAppStore((s) => s.updateBuffer);
  const formatActiveBuffer = useAppStore((s) => s.formatActiveBuffer);
  const advanceStep = useAppStore((s) => s.advanceStep);
  const justCompleted = useAppStore((s) => s.justCompletedLessonId);
  const dismissCelebration = useAppStore((s) => s.dismissCelebration);

  const [cursorLine, setCursorLine] = useState('');
  const [cursorLineNum, setCursorLineNum] = useState(1);
  const [showLesson, setShowLesson] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [isLarge, setIsLarge] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );

  useEffect(() => {
    const onResize = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const completedLesson = useMemo(
    () => (justCompleted ? lessonById(justCompleted) : undefined),
    [justCompleted],
  );

  useEffect(() => {
    setCursorLine('');
  }, [activeTab]);

  if (!ready) {
    return (
      <div className="grid place-items-center h-full">
        <div className="animate-soft-bounce text-4xl">✨</div>
      </div>
    );
  }

  if (view === 'home' || !project) {
    return (
      <>
        <Home />
        <Welcome open={!welcomeSeen} onStart={dismissWelcome} />
      </>
    );
  }

  const value = project.buffers[activeTab];

  const currentLesson =
    project.kind === 'lesson' && project.sourceId ? lessonById(project.sourceId) : undefined;
  const currentStep = currentLesson?.steps[project.activeStepIndex ?? 0];
  const interactiveMode = !!currentStep?.hideEditor;
  const interactiveStep = currentStep?.interactive;

  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex items-center gap-3 px-5 py-3">
        <button className="btn-ghost" onClick={goHome} title="Back to home">
          <ArrowLeft size={16} /> home
        </button>
        <div className="h-6 w-px bg-ink/10" />
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl select-none">{project.emoji}</span>
          <ProjectNameField project={project} />
        </div>
        <SaveStatus />
        <div className="ml-auto flex items-center gap-2">
          <button
            className="btn-ghost"
            onClick={() => setShowLesson((v) => !v)}
            title={showLesson ? 'Hide lesson panel' : 'Show lesson panel'}
          >
            {showLesson ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            <span className="hidden md:inline">lesson</span>
          </button>
          <button
            className="btn-ghost"
            onClick={() => setShowPreview((v) => !v)}
            title={showPreview ? 'Hide preview panel' : 'Show preview panel'}
          >
            {showPreview ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
            <span className="hidden md:inline">preview</span>
          </button>
          <div className="h-6 w-px bg-ink/10" />
          <button
            className="btn-ghost"
            onClick={async () => {
              await formatActiveBuffer(formatCode);
            }}
            title="Clean up the formatting of this file"
          >
            <Wand2 size={14} /> format
          </button>
          <SnapshotHistory />
          <label className="chip bg-white/70 text-ink cursor-pointer select-none hidden sm:inline-flex">
            <input
              type="checkbox"
              className="mr-1 accent-lavender-500"
              checked={beginnerMode}
              onChange={(e) => setBeginnerMode(e.target.checked)}
            />
            beginner mode
          </label>
        </div>
      </header>

      <main className="flex-1 min-h-0 px-5 pb-5">
        <div
          className="h-full grid gap-4 grid-cols-1"
          style={{
            gridTemplateColumns: isLarge
              ? `${showLesson ? '20rem ' : ''}minmax(0,1fr)${
                  showPreview && !interactiveMode ? ' 24rem' : ''
                }`
              : undefined,
          }}
        >
          {showLesson && (
            <aside className="min-h-0 overflow-y-auto pr-1 hidden lg:block">
              <LessonPanel />
            </aside>
          )}

          <section className="min-h-0 flex flex-col gap-4">
            {showLesson && (
              <div className="lg:hidden">
                <LessonPanel />
              </div>
            )}
            {interactiveMode && interactiveStep ? (
              <div className="flex-1 min-h-0 flex">
                <InteractiveStep
                  key={currentStep!.id}
                  step={interactiveStep}
                  onDone={() => advanceStep()}
                />
              </div>
            ) : (
              <div className="card p-3 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between pb-2">
                  <EditorTabs active={activeTab} onChange={setActiveTab} />
                  <div className="hidden md:flex items-center gap-2 text-[11px] text-ink-muted pr-1">
                    <Sparkles size={12} /> saves as you type
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <CodeEditor
                    value={value}
                    language={activeTab}
                    beginnerMode={beginnerMode}
                    onChange={(v) => updateBuffer(activeTab, v)}
                    onCursorLine={(line, num) => {
                      setCursorLine(line);
                      setCursorLineNum(num);
                    }}
                  />
                </div>
              </div>
            )}
          </section>

          {showPreview && !interactiveMode && (
            <aside className="min-h-0 grid grid-rows-[minmax(0,3fr)_minmax(0,2fr)] gap-4 hidden lg:grid">
              <Preview buffers={project.buffers} />
              <TutorPanel cursorLine={cursorLine} lineNumber={cursorLineNum} lang={activeTab} />
            </aside>
          )}
          {showPreview && !interactiveMode && (
            <div className="lg:hidden grid grid-rows-[minmax(0,3fr)_minmax(0,2fr)] gap-4 min-h-0">
              <Preview buffers={project.buffers} />
              <TutorPanel cursorLine={cursorLine} lineNumber={cursorLineNum} lang={activeTab} />
            </div>
          )}
        </div>
      </main>

      {justCompleted && completedLesson && (
        <ConfettiBurst
          lessonTitle={completedLesson.title}
          celebrate={completedLesson.celebrate}
          onDismiss={dismissCelebration}
        />
      )}
    </div>
  );
}
