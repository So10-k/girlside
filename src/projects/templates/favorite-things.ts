import type { Template } from '../types';

const tpl: Template = {
  id: 'tpl-favorite-things',
  title: 'Favorite things',
  emoji: '🍰',
  blurb: 'A soft, scrollable list of things that make you happy.',
  tips: [
    'Add your own items to the list.',
    'Change the emoji and the background color.',
    'Try adding a photo next to one of the items with <img>.',
  ],
  html: `<body>
  <header>
    <h1>A few of my favorite things</h1>
    <p>in no particular order</p>
  </header>
  <ul class="things">
    <li><span>🍵</span><div><strong>Matcha lattes</strong><br/><small>especially iced</small></div></li>
    <li><span>📚</span><div><strong>Cozy mysteries</strong><br/><small>small town, big feelings</small></div></li>
    <li><span>🌧️</span><div><strong>Rainy afternoons</strong><br/><small>with a blanket, obviously</small></div></li>
    <li><span>🎨</span><div><strong>Making tiny art</strong><br/><small>little sketches, big joy</small></div></li>
  </ul>
</body>
`,
  css: `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #FFFBF5;
  color: #2B2140;
  padding: 40px 24px;
  max-width: 640px;
  margin: 0 auto;
}

header { text-align: center; margin-bottom: 28px; }
h1 { margin: 0 0 4px; }
header p { color: #7C7194; }

.things { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.things li {
  display: flex; gap: 16px; align-items: center;
  background: white; padding: 16px 18px; border-radius: 20px;
  box-shadow: 0 12px 28px -20px rgba(70, 42, 120, 0.35);
}
.things span { font-size: 28px; }
small { color: #7C7194; }
`,
  js: ``,
};

export default tpl;
