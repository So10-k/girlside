import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Heart, Palette, Sparkles } from 'lucide-react';

interface Props {
  open: boolean;
  onStart: () => void;
}

const SLIDES = [
  {
    emoji: '🌸',
    title: 'Welcome to Girlside',
    body: "A cozy little studio for learning how to build your very own websites, one tiny step at a time. Nothing is scary here. Promise.",
    icon: <Heart size={18} />,
  },
  {
    emoji: '🎨',
    title: 'Three pieces, one page',
    body: "Websites are made of HTML (what's on the page), CSS (how it looks), and JavaScript (how it moves). We'll meet them one at a time.",
    icon: <Palette size={18} />,
  },
  {
    emoji: '✨',
    title: "We save everything",
    body: 'Your work saves automatically — even if you close the tab, the computer restarts, or the power blinks. You can always come back.',
    icon: <Sparkles size={18} />,
  },
];

export default function Welcome({ open, onStart }: Props) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-cream/70 backdrop-blur-md grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="card p-8 w-[min(520px,100%)] text-center"
            initial={{ y: 16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-5xl mb-3">{slide.emoji}</div>
                <h2 className="font-display text-3xl leading-tight">{slide.title}</h2>
                <p className="text-ink-soft mt-3 leading-relaxed">{slide.body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 mt-6">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-ink' : 'bg-ink/20'}`}
                />
              ))}
            </div>

            <div className="flex gap-2 justify-center mt-6">
              <button className="btn-ghost" onClick={onStart}>
                skip
              </button>
              {step < SLIDES.length - 1 ? (
                <button className="btn-primary" onClick={() => setStep(step + 1)}>
                  next <ArrowRight size={14} />
                </button>
              ) : (
                <button className="btn-primary" onClick={onStart}>
                  let's go <ArrowRight size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
