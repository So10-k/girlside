import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FileCode2, Paintbrush, Sparkles } from 'lucide-react';

type Tab = 'html' | 'css' | 'js';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

const tabs: { id: Tab; label: string; sub: string; icon: JSX.Element; tint: string }[] = [
  {
    id: 'html',
    label: 'index.html',
    sub: 'structure',
    icon: <FileCode2 size={14} />,
    tint: 'bg-lavender-100 text-lavender-500',
  },
  {
    id: 'css',
    label: 'styles.css',
    sub: 'looks',
    icon: <Paintbrush size={14} />,
    tint: 'bg-peach-100 text-rose-500',
  },
  {
    id: 'js',
    label: 'script.js',
    sub: 'behavior',
    icon: <Sparkles size={14} />,
    tint: 'bg-butter-100 text-ink',
  },
];

export default function EditorTabs({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white/60 rounded-full border border-white/80 shadow-soft">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-white shadow-pop"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className={clsx('relative grid place-items-center w-6 h-6 rounded-full', tab.tint)}>
              {tab.icon}
            </span>
            <span className="relative">{tab.label}</span>
            <span className="relative hidden sm:inline text-[10px] text-ink-muted uppercase tracking-wider">
              {tab.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
