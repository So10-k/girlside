import type { Template } from '../types';

const tpl: Template = {
  id: 'tpl-profile',
  title: 'Profile page',
  emoji: '🌷',
  blurb: 'A little page about you — name, photo, a few fun facts.',
  tips: [
    'Try changing the background color to your favorite.',
    'Swap the emoji next to each fact.',
    'Add one more fact to the list.',
  ],
  html: `<body>
  <main class="card">
    <div class="avatar">🌸</div>
    <h1>Hi, I'm Maya</h1>
    <p class="tagline">drawing · reading · definitely not a morning person</p>
    <ul class="facts">
      <li>🍓 favorite snack: strawberries</li>
      <li>🎧 on repeat: soft pop</li>
      <li>🐢 spirit animal: turtle</li>
    </ul>
  </main>
</body>
`,
  css: `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(160deg, #FFD9CE, #EADCF8);
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  color: #2B2140;
}

.card {
  background: white;
  padding: 36px;
  border-radius: 28px;
  width: min(420px, 100%);
  text-align: center;
  box-shadow: 0 20px 60px -24px rgba(70, 42, 120, 0.35);
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: #FFF3C9;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  font-size: 44px;
}

h1 { margin: 0; font-size: 32px; }
.tagline { color: #7C7194; margin: 8px 0 20px; }

.facts { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.facts li {
  background: #F7F0FF;
  border-radius: 16px;
  padding: 12px 16px;
  text-align: left;
}
`,
  js: `// No JavaScript needed for this one — but you can add some if you like!
`,
};

export default tpl;
