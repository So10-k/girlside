import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  lessonTitle: string;
  celebrate: string;
  onDismiss: () => void;
}

export default function ConfettiBurst({ lessonTitle, celebrate, onDismiss }: Props) {
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        scalar: 0.9,
        colors: ['#EADCF8', '#FFD9CE', '#D6F5E3', '#FFF3C9', '#FF9EC0'],
      });
    };
    fire();
    const t1 = window.setTimeout(fire, 180);
    const t2 = window.setTimeout(fire, 380);
    const auto = window.setTimeout(onDismiss, 4200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(auto);
    };
  }, [onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <button
          onClick={onDismiss}
          className="pointer-events-auto card px-5 py-4 flex items-center gap-3 max-w-[min(480px,92vw)]"
        >
          <span className="w-10 h-10 rounded-full bg-mint-100 text-mint-500 grid place-items-center">
            <Sparkles size={18} />
          </span>
          <div className="text-left">
            <div className="text-xs uppercase tracking-widest text-ink-muted">you did it</div>
            <div className="font-display text-lg leading-tight">{lessonTitle}</div>
            <div className="text-sm text-ink-soft mt-0.5">{celebrate}</div>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
