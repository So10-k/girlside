import type { Buffers } from './buildSrcDoc';

export type CheckFn = (buffers: Buffers) => boolean;

export function safeRun(check: CheckFn | undefined, buffers: Buffers): boolean {
  if (!check) return false;
  try {
    return !!check(buffers);
  } catch {
    return false;
  }
}
