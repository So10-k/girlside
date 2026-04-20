import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MessageCircleHeart, Sparkles, Terminal } from 'lucide-react';
import { explainLine } from '../lib/explain';
import { useAppStore } from '../store/useAppStore';

interface Props {
  cursorLine: string;
  lineNumber: number;
  lang: 'html' | 'css' | 'js';
}

const ENCOURAGEMENTS = [
  "You're doing great. One step at a time.",
  'Coding is mostly tinkering — try things and see what happens.',
  "Don't worry about getting it perfect on the first try.",
  "Every professional dev had a Day 1 too.",
  "If something breaks, it usually means you're learning something new.",
];

export default function TutorPanel({ cursorLine, lineNumber, lang }: Props) {
  const lines = useAppStore((s) => s.consoleLines);
  const clearConsole = useAppStore((s) => s.clearConsole);
  const encouragement = ENCOURAGEMENTS[lineNumber % ENCOURAGEMENTS.length];
  const tip = cursorLine.trim() ? explainLine(lang, cursorLine) : 'Put your cursor on any line and I\'ll explain what it does.';

  return (
    <div className="card p-4 flex flex-col gap-3 h-full overflow-hidden">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-lavender-100 text-lavender-500 grid place-items-center">
          <MessageCircleHeart size={14} />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold">Your friendly tutor</div>
          <div className="text-[11px] text-ink-muted">here whenever you need a hand</div>
        </div>
      </div>

      <div className="bg-lavender-50 border border-lavender-100 rounded-2xl p-3">
        <div className="text-[11px] uppercase tracking-widest text-ink-muted mb-1 flex items-center gap-1">
          <Sparkles size={11} /> explain this line · line {lineNumber}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={cursorLine + lineNumber}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm leading-relaxed"
          >
            {tip}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="bg-mint-50 border border-mint-100 rounded-2xl p-3 flex items-start gap-2">
        <Heart size={14} className="text-mint-500 mt-0.5" />
        <p className="text-xs text-ink-soft leading-relaxed">{encouragement}</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-white/70 rounded-2xl border border-white/80 p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[11px] uppercase tracking-widest text-ink-muted flex items-center gap-1">
            <Terminal size={11} /> console.log
          </div>
          {lines.length > 0 && (
            <button className="text-[10px] text-ink-muted hover:text-ink" onClick={clearConsole}>
              clear
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto text-xs font-mono leading-relaxed text-ink-soft">
          {lines.length === 0 ? (
            <p className="text-ink-muted">Anything you console.log shows up here, like a little diary of your program.</p>
          ) : (
            lines.map((l, i) => (
              <div key={i} className="py-0.5 break-words">
                {l}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
