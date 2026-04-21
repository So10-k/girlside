import { motion } from 'framer-motion';
import type { Buffers } from '../lib/buildSrcDoc';
import { extractCodeHint, keyLocationFor, nextCharToType } from '../lib/typingGuide';
import KeyboardDiagram from './KeyboardDiagram';
import { useEffect, useState } from 'react';

function displayChar(c: string): string {
  if (c === ' ') return '␣';
  if (c === '\n') return '⏎';
  if (c === '\t') return '⇥';
  return c;
}

export default function TypingHint({ task, buffers }: { task?: string; buffers: Buffers }) {
  const hint = extractCodeHint(task);
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setPressed(e.key);
      const t = window.setTimeout(() => setPressed(null), 200);
      return () => window.clearTimeout(t);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!hint) return null;
  const info = nextCharToType(hint, buffers);
  const nextChar = info.char;
  const done = nextChar === null;
  const loc = nextChar ? keyLocationFor(nextChar) : { key: '', shift: false };

  return (
    <div className="card p-3 flex flex-col gap-2 animate-fade-up">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-ink-muted shrink-0">
            type this
          </div>
          <div className="font-mono text-sm overflow-x-auto whitespace-pre">
            {hint.split('').map((c, i) => {
              const state = i < info.typed ? 'done' : i === info.typed ? 'next' : 'todo';
              return (
                <span
                  key={i}
                  className={
                    state === 'done'
                      ? 'text-mint-500'
                      : state === 'next'
                      ? 'bg-peach-100 text-peach-500 rounded px-0.5'
                      : 'text-ink-soft'
                  }
                >
                  {displayChar(c)}
                </span>
              );
            })}
          </div>
        </div>

        {!done && (
          <motion.div
            key={nextChar}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="chip bg-peach-50 text-peach-500 whitespace-nowrap"
          >
            next: {loc.shift && <span className="mr-0.5 opacity-70">shift +</span>}
            <span className="font-mono">{displayChar(nextChar!)}</span>
          </motion.div>
        )}
        {done && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="chip bg-mint-100 text-mint-500 whitespace-nowrap"
          >
            all typed ✓
          </motion.div>
        )}
      </div>

      {!done && (
        <KeyboardDiagram
          compact
          pressed={pressed}
          highlight={nextChar}
          shiftHighlight={loc.shift}
        />
      )}
    </div>
  );
}
