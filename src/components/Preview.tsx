import { useEffect, useMemo, useRef, useState } from 'react';
import { Monitor, RefreshCw, Smartphone, AlertTriangle } from 'lucide-react';
import { buildSrcDoc, Buffers } from '../lib/buildSrcDoc';
import { friendlyError } from '../lib/explain';
import { useAppStore } from '../store/useAppStore';

interface Props {
  buffers: Buffers;
}

const DEVICE_WIDTHS = {
  desktop: '100%',
  phone: '390px',
} as const;

type Device = keyof typeof DEVICE_WIDTHS;

export default function Preview({ buffers }: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [device, setDevice] = useState<Device>('desktop');
  const [nonce, setNonce] = useState(0);
  const previewError = useAppStore((s) => s.previewError);
  const setPreviewError = useAppStore((s) => s.setPreviewError);
  const pushConsoleLine = useAppStore((s) => s.pushConsoleLine);

  const srcDoc = useMemo(() => buildSrcDoc(buffers), [buffers]);

  // Debounced rerender: we change srcDoc directly, but we also give a gentle
  // "typing" state between keypresses so it doesn't thrash the iframe.
  const [renderedDoc, setRenderedDoc] = useState(srcDoc);
  useEffect(() => {
    const t = window.setTimeout(() => {
      setRenderedDoc(srcDoc);
      setPreviewError(undefined);
    }, 300);
    return () => window.clearTimeout(t);
  }, [srcDoc, nonce, setPreviewError]);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data;
      if (!data || !data.__girlside) return;
      if (data.kind === 'error') {
        const payload = data.payload || {};
        const f = friendlyError(payload.message || '');
        setPreviewError(f);
      }
      if (data.kind === 'log') {
        pushConsoleLine(String(data.payload?.line || ''));
      }
      if (data.kind === 'ready') {
        setPreviewError(undefined);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [setPreviewError, pushConsoleLine]);

  return (
    <div className="card p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="chip bg-mint-100 text-mint-500">live preview</span>
          <span className="text-xs text-ink-muted hidden sm:inline">updates as you type</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className={`btn-ghost !px-2 !py-1 text-xs ${device === 'desktop' ? 'bg-white/80' : ''}`}
            onClick={() => setDevice('desktop')}
            title="Desktop size"
          >
            <Monitor size={14} />
          </button>
          <button
            className={`btn-ghost !px-2 !py-1 text-xs ${device === 'phone' ? 'bg-white/80' : ''}`}
            onClick={() => setDevice('phone')}
            title="Phone size"
          >
            <Smartphone size={14} />
          </button>
          <button
            className="btn-ghost !px-2 !py-1 text-xs"
            onClick={() => setNonce((n) => n + 1)}
            title="Refresh preview"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="relative flex-1 rounded-xl overflow-hidden bg-white border border-white/70">
        <div
          className="mx-auto h-full transition-all"
          style={{ width: DEVICE_WIDTHS[device], maxWidth: '100%' }}
        >
          <iframe
            ref={iframeRef}
            key={nonce}
            title="Preview"
            sandbox="allow-scripts"
            srcDoc={renderedDoc}
            className="w-full h-full bg-white"
          />
        </div>
        {previewError && (
          <div className="absolute bottom-3 left-3 right-3 bg-peach-50 border border-peach-200 rounded-2xl p-3 flex gap-3 animate-fade-up">
            <div className="w-9 h-9 rounded-full bg-peach-100 grid place-items-center shrink-0">
              <AlertTriangle size={16} className="text-rose-500" />
            </div>
            <div>
              <div className="text-sm font-semibold">{previewError.title}</div>
              <div className="text-xs text-ink-soft mt-0.5">{previewError.hint}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
