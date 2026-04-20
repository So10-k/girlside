import { Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

function timeAgo(ts?: number): string {
  if (!ts) return '';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export default function SaveStatus() {
  const state = useAppStore((s) => s.saveState);
  const ts = useAppStore((s) => s.lastSavedAt);
  if (state === 'saving')
    return (
      <span className="chip bg-white/70 text-ink-muted">
        <Loader2 size={12} className="animate-spin" /> saving…
      </span>
    );
  if (state === 'saved')
    return (
      <span className="chip bg-mint-100 text-mint-500">
        <Cloud size={12} /> all saved · {timeAgo(ts)}
      </span>
    );
  return (
    <span className="chip bg-white/70 text-ink-muted">
      <CloudOff size={12} /> ready
    </span>
  );
}
