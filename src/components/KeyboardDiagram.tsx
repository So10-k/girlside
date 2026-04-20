import { motion } from 'framer-motion';

type Key = { label: string; target?: string; w?: number; tone?: 'light' | 'mod' };

const ROWS: Key[][] = [
  [
    { label: '` ~', target: '`' },
    { label: '1 !', target: '1' },
    { label: '2 @', target: '2' },
    { label: '3 #', target: '3' },
    { label: '4 $', target: '4' },
    { label: '5 %', target: '5' },
    { label: '6 ^', target: '6' },
    { label: '7 &', target: '7' },
    { label: '8 *', target: '8' },
    { label: '9 (', target: '9' },
    { label: '0 )', target: '0' },
    { label: '- _', target: '-' },
    { label: '= +', target: '=' },
    { label: 'delete', w: 1.6, tone: 'mod' },
  ],
  [
    { label: 'tab', w: 1.4, tone: 'mod' },
    { label: 'Q' },
    { label: 'W' },
    { label: 'E' },
    { label: 'R' },
    { label: 'T' },
    { label: 'Y' },
    { label: 'U' },
    { label: 'I' },
    { label: 'O' },
    { label: 'P' },
    { label: '[ {', target: '[' },
    { label: '] }', target: ']' },
    { label: '\\', target: '\\', w: 1.3 },
  ],
  [
    { label: 'caps', w: 1.7, tone: 'mod' },
    { label: 'A' },
    { label: 'S' },
    { label: 'D' },
    { label: 'F' },
    { label: 'G' },
    { label: 'H' },
    { label: 'J' },
    { label: 'K' },
    { label: 'L' },
    { label: '; :', target: ';' },
    { label: "' \"", target: "'" },
    { label: 'enter', w: 2.0, tone: 'mod' },
  ],
  [
    { label: 'shift', w: 2.2, tone: 'mod', target: 'Shift' },
    { label: 'Z' },
    { label: 'X' },
    { label: 'C' },
    { label: 'V' },
    { label: 'B' },
    { label: 'N' },
    { label: 'M' },
    { label: ', <', target: ',' },
    { label: '. >', target: '.' },
    { label: '/ ?', target: '/' },
    { label: 'shift', w: 2.2, tone: 'mod', target: 'Shift' },
  ],
  [
    { label: 'fn', w: 1.1, tone: 'mod' },
    { label: 'ctrl', w: 1.1, tone: 'mod', target: 'Control' },
    { label: 'opt', w: 1.1, tone: 'mod', target: 'Alt' },
    { label: 'cmd', w: 1.3, tone: 'mod', target: 'Meta' },
    { label: 'space', w: 6.2, target: ' ' },
    { label: 'cmd', w: 1.3, tone: 'mod', target: 'Meta' },
    { label: 'opt', w: 1.1, tone: 'mod', target: 'Alt' },
    { label: '◀', w: 1.1, tone: 'mod', target: 'ArrowLeft' },
    { label: '▲▼', w: 1.1, tone: 'mod' },
    { label: '▶', w: 1.1, tone: 'mod', target: 'ArrowRight' },
  ],
];

function matches(key: Key, pressed: string | null, highlight: string | null): { on: boolean; hint: boolean } {
  if (!pressed && !highlight) return { on: false, hint: false };
  const compare = (val: string, k: Key): boolean => {
    const v = val.toLowerCase();
    if (k.target && k.target.toLowerCase() === v) return true;
    if (!k.target && k.label.toLowerCase() === v) return true;
    if (v === ' ' && k.label === 'space') return true;
    if (v.length === 1 && k.label.toLowerCase() === v) return true;
    return false;
  };
  return {
    on: pressed ? compare(pressed, key) : false,
    hint: highlight ? compare(highlight, key) : false,
  };
}

export default function KeyboardDiagram({
  pressed,
  highlight,
}: {
  pressed?: string | null;
  highlight?: string | null;
}) {
  return (
    <div className="w-full max-w-3xl mx-auto select-none">
      <div className="bg-white/80 rounded-3xl p-3 shadow-soft border border-white/80">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5 mb-1.5 justify-center last:mb-0">
            {row.map((k, ki) => {
              const { on, hint } = matches(k, pressed || null, highlight || null);
              const width = `${(k.w || 1) * 2.4}rem`;
              return (
                <motion.div
                  key={ri + '-' + ki}
                  className={`h-10 rounded-lg grid place-items-center text-[11px] font-medium border transition-colors
                    ${
                      on
                        ? 'bg-mint-200 border-mint-300 text-mint-500 shadow-inner'
                        : hint
                        ? 'bg-peach-100 border-peach-200 text-peach-500 animate-pulse-soft'
                        : k.tone === 'mod'
                        ? 'bg-lavender-50 border-lavender-100 text-ink-muted'
                        : 'bg-white border-ink/10 text-ink'
                    }`}
                  style={{ width, flex: `0 0 ${width}` }}
                  animate={on ? { scale: [1, 0.95, 1] } : { scale: 1 }}
                  transition={{ duration: 0.12 }}
                >
                  {k.label}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
