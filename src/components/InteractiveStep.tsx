import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import type { InteractiveStep as Step } from '../curriculum/types';
import KeyboardDiagram from './KeyboardDiagram';
import { playByName, playCorrect, playKeyTap, playSparkle, playWrong } from '../lib/sounds';

function matchesKey(target: string, pressed: string): boolean {
  const t = target.toLowerCase();
  const p = pressed.toLowerCase();
  if (t === p) return true;
  if (t === ' ' && p === ' ') return true;
  return false;
}

function displayKey(k: string): string {
  if (k === ' ') return 'space';
  if (k.length === 1) return k.toUpperCase();
  return k;
}

export default function InteractiveStep({
  step,
  onDone,
}: {
  step: Step;
  onDone: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  if (step.kind === 'intro') {
    return <IntroVideo step={step} onDone={onDone} muted={muted} setMuted={setMuted} />;
  }
  if (step.kind === 'press-key') {
    return (
      <PressKey
        target={step.target}
        prompt={step.prompt}
        onDone={onDone}
        muted={mutedRef}
        mutedState={muted}
        setMuted={setMuted}
      />
    );
  }
  if (step.kind === 'press-sequence') {
    return (
      <PressSequence
        sequence={step.sequence}
        prompt={step.prompt}
        onDone={onDone}
        muted={mutedRef}
        mutedState={muted}
        setMuted={setMuted}
      />
    );
  }
  return <AutocloseDemo prompt={step.prompt} onDone={onDone} muted={muted} setMuted={setMuted} />;
}

function MuteToggle({ muted, setMuted }: { muted: boolean; setMuted: (v: boolean) => void }) {
  return (
    <button
      className="absolute top-3 right-3 btn-ghost !py-1 !px-2 text-xs"
      onClick={() => setMuted(!muted)}
      title={muted ? 'Turn sound on' : 'Turn sound off'}
    >
      {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
    </button>
  );
}

function IntroVideo({
  step,
  onDone,
  muted,
  setMuted,
}: {
  step: Extract<Step, { kind: 'intro' }>;
  onDone: () => void;
  muted: boolean;
  setMuted: (v: boolean) => void;
}) {
  const [i, setI] = useState(0);
  const total = step.lines.length;
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      if (!muted) playByName(step.sound || 'welcome');
    }
  }, [muted, step.sound]);

  useEffect(() => {
    if (i >= total) return;
    const t = setTimeout(() => {
      if (!muted) playKeyTap();
      setI((v) => v + 1);
    }, i === 0 ? 600 : 1600);
    return () => clearTimeout(t);
  }, [i, total, muted]);

  const done = i >= total;

  return (
    <div className="relative w-full h-full min-h-[320px] rounded-3xl bg-gradient-to-br from-lavender-100 via-peach-50 to-butter-100 p-10 flex flex-col items-center justify-center overflow-hidden">
      <MuteToggle muted={muted} setMuted={setMuted} />

      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-lavender-200/40 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-peach-100/60 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.7, 0.4, 0.7] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {step.emoji && (
        <motion.div
          className="text-7xl mb-6 select-none relative"
          initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        >
          {step.emoji}
        </motion.div>
      )}

      <div className="relative flex flex-col items-center gap-3 text-center max-w-2xl">
        <AnimatePresence>
          {step.lines.slice(0, i).map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className={`font-display ${idx === 0 ? 'text-4xl' : 'text-2xl'} text-ink`}
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {done && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-10 btn-primary text-base"
          onClick={() => {
            if (!muted) playSparkle();
            onDone();
          }}
        >
          let's go! <Sparkles size={16} />
        </motion.button>
      )}
    </div>
  );
}

function PressKey({
  target,
  prompt,
  onDone,
  muted,
  mutedState,
  setMuted,
}: {
  target: string;
  prompt: string;
  onDone: () => void;
  muted: React.MutableRefObject<boolean>;
  mutedState: boolean;
  setMuted: (v: boolean) => void;
}) {
  const [pressed, setPressed] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won) return;
      // Don't swallow modifier-only keys unless target IS a modifier
      if (e.key === 'Tab' && target !== 'Tab') return;
      e.preventDefault();
      setPressed(e.key);
      if (matchesKey(target, e.key)) {
        setWon(true);
        if (!muted.current) playCorrect();
        setTimeout(onDone, 650);
      } else {
        setWrongCount((c) => c + 1);
        if (!muted.current) playWrong();
      }
      setTimeout(() => setPressed(null), 220);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target, won, onDone, muted]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-3xl bg-gradient-to-br from-lavender-50 via-cream to-mint-50 p-8 flex flex-col items-center justify-center gap-6">
      <MuteToggle muted={mutedState} setMuted={setMuted} />

      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-ink-muted">press the key below</div>
        <div className="font-display text-3xl mt-1">{prompt}</div>
        <motion.div
          className="mt-4 inline-flex items-center justify-center bg-white rounded-2xl shadow-soft px-8 py-5 font-mono text-4xl border border-lavender-100"
          animate={won ? { scale: [1, 1.2, 1], rotate: [0, 6, -6, 0] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {displayKey(target)}
        </motion.div>
      </div>

      <KeyboardDiagram pressed={pressed} highlight={won ? null : target} />

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="chip bg-mint-100 text-mint-500 text-sm"
          >
            <Sparkles size={14} /> great!
          </motion.div>
        )}
        {!won && wrongCount > 0 && (
          <motion.div
            key={wrongCount}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-ink-muted"
          >
            oops, that was the {displayKey(pressed || '')} key. try again — the glowing one!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PressSequence({
  sequence,
  prompt,
  onDone,
  muted,
  mutedState,
  setMuted,
}: {
  sequence: string[];
  prompt: string;
  onDone: () => void;
  muted: React.MutableRefObject<boolean>;
  mutedState: boolean;
  setMuted: (v: boolean) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [pressed, setPressed] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const current = sequence[idx];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won) return;
      if (e.key === 'Tab') return;
      const target = sequence[idx];
      e.preventDefault();
      setPressed(e.key);
      if (matchesKey(target, e.key)) {
        if (!muted.current) playKeyTap();
        const next = idx + 1;
        if (next >= sequence.length) {
          setWon(true);
          if (!muted.current) playCorrect();
          setTimeout(onDone, 700);
        } else {
          setIdx(next);
        }
      } else {
        if (!muted.current) playWrong();
      }
      setTimeout(() => setPressed(null), 180);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, sequence, won, onDone, muted]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-3xl bg-gradient-to-br from-lavender-50 via-cream to-peach-50 p-8 flex flex-col items-center justify-center gap-6">
      <MuteToggle muted={mutedState} setMuted={setMuted} />
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-ink-muted">type in order</div>
        <div className="font-display text-2xl mt-1">{prompt}</div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center max-w-xl">
        {sequence.map((k, i) => (
          <motion.div
            key={i}
            className={`rounded-xl px-4 py-3 font-mono text-xl border shadow-soft ${
              i < idx
                ? 'bg-mint-100 text-mint-500 border-mint-200 line-through'
                : i === idx
                ? 'bg-white text-ink border-peach-200 animate-pulse-soft'
                : 'bg-white/60 text-ink-muted border-ink/10'
            }`}
            animate={i === idx ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 1 }}
          >
            {displayKey(k)}
          </motion.div>
        ))}
      </div>

      <KeyboardDiagram pressed={pressed} highlight={current && !won ? current : null} />

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="chip bg-mint-100 text-mint-500"
          >
            <Sparkles size={14} /> you typed it all!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AutocloseDemo({
  prompt,
  onDone,
  muted,
  setMuted,
}: {
  prompt?: string;
  onDone: () => void;
  muted: boolean;
  setMuted: (v: boolean) => void;
}) {
  const script = useMemo(
    () => [
      { typed: '<', wait: 250 },
      { typed: '<h', wait: 180 },
      { typed: '<h1', wait: 180 },
      { typed: '<h1>', wait: 400 },
      { typed: '<h1></h1>', wait: 900, magic: true },
      { typed: '<h1>Hi!</h1>', wait: 800 },
    ],
    [],
  );
  const [step, setStep] = useState(0);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (step >= script.length) return;
    const t = setTimeout(() => {
      if (!muted) {
        if (script[step].magic) playSparkle();
        else playKeyTap();
      }
      setStep((s) => s + 1);
    }, script[step].wait);
    return () => clearTimeout(t);
  }, [step, muted, script]);

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(t);
  }, []);

  const current = step === 0 ? '' : script[step - 1].typed;
  const justAutoclosed = step === 5; // after the <h1></h1> appears

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-3xl bg-gradient-to-br from-mint-50 via-cream to-lavender-50 p-8 flex flex-col items-center justify-center gap-6">
      <MuteToggle muted={muted} setMuted={setMuted} />
      <div className="text-center max-w-xl">
        <div className="text-xs uppercase tracking-widest text-ink-muted">watch this</div>
        <div className="font-display text-2xl mt-1">
          {prompt || 'When you finish an opening tag, the editor finishes the closing tag for you.'}
        </div>
      </div>

      <div className="w-full max-w-xl rounded-2xl bg-white border border-ink/10 shadow-soft p-6 font-mono text-xl">
        <div className="text-xs uppercase tracking-widest text-ink-muted mb-2">your editor</div>
        <div className="relative">
          <span className="whitespace-pre">{current}</span>
          <span className={cursor ? 'inline-block w-2 h-6 align-middle bg-lavender-500 ml-0.5' : 'inline-block w-2 h-6 align-middle ml-0.5'} />
        </div>
      </div>

      <AnimatePresence>
        {justAutoclosed && (
          <motion.div
            key="magic"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="chip bg-butter-100 text-ink"
          >
            <Sparkles size={14} /> the editor added &lt;/h1&gt; for you!
          </motion.div>
        )}
      </AnimatePresence>

      {step >= script.length && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="btn-primary"
          onClick={onDone}
        >
          cool, got it <Sparkles size={14} />
        </motion.button>
      )}
    </div>
  );
}
