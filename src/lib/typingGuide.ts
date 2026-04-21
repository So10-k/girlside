import type { Buffers } from './buildSrcDoc';

/**
 * Pull out the actual code a learner should type from a lesson step's `task`
 * string. Tasks mix prose with code — we only want the code so we can show it
 * as a typing target.
 *
 * Heuristic: keep lines that look like code (start with <, ., #, /, a tag
 * keyword, or match "property: value" / "name.method(...)"). Drop prose lines.
 */
export function extractCodeHint(task?: string): string | null {
  if (!task) return null;
  const lines = task.split(/\r?\n/);
  const codeLines: string[] = [];
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const looksLikeCode =
      /^[<{.#/]/.test(trimmed) ||
      /^[a-z-]+:\s*\S/i.test(trimmed) ||
      /^\w+\.\w+/.test(trimmed) ||
      /^const\s/.test(trimmed) ||
      /^\/\//.test(trimmed) ||
      /^[a-z]+\s*=\s*/i.test(trimmed);
    if (looksLikeCode) codeLines.push(trimmed);
  }
  if (codeLines.length === 0) return null;
  return codeLines.join('\n');
}

export interface NextKeyInfo {
  /** The next character the learner should type. `null` when the hint is
   *  already fully typed. */
  char: string | null;
  /** How many characters of the hint are already in the buffer. */
  typed: number;
  /** Full hint string, unchanged. */
  hint: string;
}

/**
 * Walk the hint and figure out how much of it already appears somewhere in
 * the combined code buffers. Return the next character to type — or null if
 * the learner has finished.
 */
export function nextCharToType(hint: string, buffers: Buffers): NextKeyInfo {
  const combined = buffers.html + '\n' + buffers.css + '\n' + buffers.js;
  for (let len = hint.length; len > 0; len--) {
    const prefix = hint.slice(0, len);
    if (combined.includes(prefix)) {
      if (len === hint.length) {
        return { char: null, typed: len, hint };
      }
      return { char: hint[len], typed: len, hint };
    }
  }
  return { char: hint[0] ?? null, typed: 0, hint };
}

/**
 * Given a character the learner needs to type, return the keyboard key that
 * makes it. For shifted symbols we return the unshifted key (e.g. `<` → `,`),
 * plus a flag that says "also hold Shift".
 */
export function keyLocationFor(ch: string): { key: string; shift: boolean } {
  if (!ch) return { key: '', shift: false };
  const shifted: Record<string, string> = {
    '<': ',',
    '>': '.',
    '?': '/',
    ':': ';',
    '"': "'",
    '{': '[',
    '}': ']',
    '|': '\\',
    '~': '`',
    '!': '1',
    '@': '2',
    '#': '3',
    $: '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    _: '-',
    '+': '=',
  };
  if (ch in shifted) return { key: shifted[ch], shift: true };
  if (ch >= 'A' && ch <= 'Z') return { key: ch.toLowerCase(), shift: true };
  if (ch === '\n') return { key: 'enter', shift: false };
  if (ch === '\t') return { key: 'tab', shift: false };
  return { key: ch, shift: false };
}
