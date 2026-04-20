import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'soft' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Yes, do it',
  cancelLabel = 'Nevermind',
  tone = 'soft',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="card p-6 w-[min(420px,92vw)]"
            initial={{ y: 10, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 6, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <h3 className="font-display text-xl">{title}</h3>
            {body && <p className="text-sm text-ink-soft mt-2 leading-relaxed">{body}</p>}
            <div className="flex justify-end gap-2 mt-5">
              <button className="btn-ghost" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button
                className={tone === 'danger' ? 'btn bg-rose-500 text-white hover:bg-rose-300' : 'btn-primary'}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
