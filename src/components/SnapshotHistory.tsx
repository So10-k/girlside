import { AnimatePresence, motion } from 'framer-motion';
import { Clock, History, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import ConfirmDialog from './ConfirmDialog';

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function SnapshotHistory() {
  const snaps = useAppStore((s) => s.snapshots);
  const saveSnapshot = useAppStore((s) => s.saveSnapshot);
  const restoreSnapshot = useAppStore((s) => s.restoreSnapshot);
  const [open, setOpen] = useState(false);
  const [restoreId, setRestoreId] = useState<string | undefined>();

  return (
    <>
      <button className="btn-ghost" onClick={() => setOpen(true)} title="Saved versions">
        <History size={14} /> versions
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.aside
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[min(420px,92vw)] bg-cream shadow-pop border-l border-white/70 p-5 flex flex-col gap-4"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <header className="flex items-center gap-2">
                <Clock size={16} />
                <h3 className="font-display text-xl flex-1">Saved versions</h3>
                <button className="btn-ghost !p-1" onClick={() => setOpen(false)}>
                  <X size={16} />
                </button>
              </header>
              <p className="text-sm text-ink-soft">
                Your work autosaves all the time. You can also save a named version whenever you hit a
                point you love — it's a checkpoint you can come back to anytime.
              </p>
              <button className="btn-primary self-start" onClick={() => saveSnapshot()}>
                Save a version now
              </button>
              <div className="flex-1 overflow-y-auto -mx-1 pr-1 flex flex-col gap-2">
                {snaps.length === 0 && (
                  <div className="text-sm text-ink-muted mt-2">No saved versions yet.</div>
                )}
                {snaps.map((s) => (
                  <div key={s.id} className="card p-3 flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{s.label || 'Snapshot'}</div>
                      <div className="text-[11px] text-ink-muted">{fmt(s.createdAt)}</div>
                    </div>
                    <button
                      className="btn-soft !py-1 !px-3 text-xs"
                      onClick={() => setRestoreId(s.id)}
                    >
                      <RotateCcw size={12} /> restore
                    </button>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmDialog
        open={!!restoreId}
        title="Go back to this version?"
        body="We'll bring your editor back to how it looked then. Your current code will be replaced (you can save a version first if you want to keep it)."
        confirmLabel="Yes, restore it"
        onConfirm={() => {
          if (restoreId) restoreSnapshot(restoreId);
          setRestoreId(undefined);
        }}
        onCancel={() => setRestoreId(undefined)}
      />
    </>
  );
}
