/**
 * Tiny Web Audio effects. No asset files needed. Nothing here is loud.
 *
 * The browser blocks audio until the user has interacted with the page —
 * our contexts are created lazily on the first call, which happens inside a
 * click/keydown handler, so that's fine.
 */

let ctx: AudioContext | null = null;
function audio(): AudioContext {
  if (!ctx) {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function beep(freq: number, ms = 120, type: OscillatorType = 'sine', gain = 0.08) {
  try {
    const c = audio();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = 0;
    osc.connect(g).connect(c.destination);
    const now = c.currentTime;
    g.gain.linearRampToValueAtTime(gain, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + ms / 1000);
    osc.start(now);
    osc.stop(now + ms / 1000 + 0.02);
  } catch {
    /* audio blocked — silently skip */
  }
}

export function playCorrect() {
  beep(660, 80, 'sine', 0.1);
  setTimeout(() => beep(990, 120, 'sine', 0.1), 70);
}

export function playWrong() {
  beep(180, 140, 'sawtooth', 0.05);
}

export function playKeyTap() {
  beep(520, 40, 'triangle', 0.05);
}

export function playSparkle() {
  const notes = [784, 988, 1318, 1568];
  notes.forEach((n, i) => setTimeout(() => beep(n, 90, 'triangle', 0.07), i * 70));
}

export function playWelcome() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => setTimeout(() => beep(n, 180, 'sine', 0.08), i * 150));
}

export function playSoft() {
  beep(392, 220, 'sine', 0.05);
  setTimeout(() => beep(523, 260, 'sine', 0.05), 180);
}

export function playByName(name: 'welcome' | 'soft' | 'sparkle') {
  if (name === 'welcome') return playWelcome();
  if (name === 'soft') return playSoft();
  return playSparkle();
}
