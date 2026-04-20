import type { Template } from '../types';

const tpl: Template = {
  id: 'tpl-birthday-invite',
  title: 'Birthday invite',
  emoji: '🎂',
  blurb: 'A sweet one-page invitation you can actually send to friends.',
  tips: [
    'Change the name, date, and place to match your real party.',
    'Try a different gradient on the background.',
    "Add an emoji row of the birthday person's favorite things.",
  ],
  html: `<body>
  <div class="card">
    <div class="balloon b1">🎈</div>
    <div class="balloon b2">🎀</div>
    <p class="kicker">you're invited to</p>
    <h1>Maya's 12th<br/>birthday party!</h1>
    <div class="meta">
      <div><strong>when</strong><br/>sat, july 20 · 3pm</div>
      <div><strong>where</strong><br/>our backyard</div>
    </div>
    <p class="bring">bring your appetite for cake 🍰</p>
  </div>
</body>
`,
  css: `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(180deg, #FFD9CE 0%, #EADCF8 100%);
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  color: #2B2140;
}

.card {
  position: relative;
  background: white;
  padding: 36px 32px;
  border-radius: 28px;
  width: min(440px, 100%);
  text-align: center;
  box-shadow: 0 24px 64px -28px rgba(70, 42, 120, 0.45);
  overflow: hidden;
}

.balloon { position: absolute; font-size: 44px; opacity: 0.9; }
.b1 { top: -6px; left: -4px; transform: rotate(-12deg); }
.b2 { bottom: -8px; right: -4px; transform: rotate(14deg); }

.kicker { margin: 0; text-transform: lowercase; letter-spacing: 0.12em; color: #E55C8E; font-weight: 600; }
h1 { font-family: 'Fraunces', serif; margin: 6px 0 20px; font-size: 36px; line-height: 1.05; }

.meta {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  background: #F7F0FF; border-radius: 18px; padding: 14px; margin-bottom: 16px;
}
.meta strong { color: #8E66C4; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
.bring { color: #7C7194; margin: 0; }
`,
  js: ``,
};

export default tpl;
