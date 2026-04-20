import type { Lesson } from '../types';

const lesson: Lesson = {
  id: 'lesson-07-flex-layout',
  unitId: 'unit-04-layout',
  order: 7,
  title: 'Side by side with flex',
  subtitle: 'Line things up in a row.',
  emoji: '🧩',
  focusTab: 'css',
  celebrate: 'You can arrange things on a page now. That is a superpower. 🪄',
  steps: [
    {
      id: 's1',
      title: 'The stacking problem',
      emoji: '🥞',
      story:
        "Look at the preview. Three little cards are stacked on top of each other. By default, boxes stack vertically. Today we'll line them up in a ROW instead.",
      starter: {
        html: `<body>\n  <h1>My fruit bowl</h1>\n  <div class="bowl">\n    <div class="fruit">🍓</div>\n    <div class="fruit">🍋</div>\n    <div class="fruit">🫐</div>\n  </div>\n</body>\n`,
        css: `body { font-family: system-ui, sans-serif; padding: 40px; background: #FFFBF5; color: #2B2140; }\n\n.bowl {\n}\n\n.fruit {\n  background: white;\n  border-radius: 20px;\n  padding: 32px;\n  font-size: 48px;\n  box-shadow: 0 10px 30px -12px rgba(70,42,120,0.2);\n}\n`,
        js: '',
      },
    },
    {
      id: 's2',
      title: 'Meet flexbox',
      emoji: '🧺',
      story:
        "Flexbox is CSS magic. Add 'display: flex' to a container (like .bowl), and its children line up in a row automatically.",
    },
    {
      id: 's3',
      title: 'Turn on flex',
      emoji: '⚡',
      task: "Inside the .bowl block, add display: flex;",
      story: "Let's flip the switch and watch the fruits line up.",
      check: ({ css }) => /\.bowl[^{}]*\{[^{}]*display\s*:\s*flex/i.test(css),
      celebrate: 'Zoom! Look at them.',
    },
    {
      id: 's4',
      title: 'Add a gap between fruits',
      emoji: '📏',
      task: "In the .bowl block, add gap: 16px;",
      story:
        "Right now the fruits might be smooshed together. 'gap' adds a clean space between every child.",
      check: ({ css }) => /\.bowl[^{}]*\{[^{}]*gap\s*:\s*\d+/i.test(css),
    },
    {
      id: 's5',
      title: 'Add a fourth fruit',
      emoji: '🍊',
      task: 'Add one more <div class="fruit">🍊</div> inside .bowl.',
      story: "Add another fruit to the HTML and watch flex lay it out with the others.",
      check: ({ html }) =>
        (html.match(/<div[^>]*class=["'][^"']*fruit[^"']*["'][^>]*>[\s\S]*?<\/div>/gi) || []).length >= 4,
    },
    {
      id: 's6',
      title: 'Space them out evenly',
      emoji: '📐',
      task: "In .bowl, add justify-content: center;",
      story:
        "justify-content says where to put the items along the row. Try 'center' to push them to the middle. Other options: flex-start, flex-end, space-between.",
      check: ({ css }) => /\.bowl[^{}]*\{[^{}]*justify-content\s*:/i.test(css),
    },
    {
      id: 's7',
      title: 'Let the fruits grow',
      emoji: '🌱',
      task: "In the .fruit block, add flex: 1;",
      story:
        "'flex: 1' tells each fruit: 'share the row equally'. All the fruits will stretch to the same width.",
      check: ({ css }) => /\.fruit[^{}]*\{[^{}]*flex\s*:\s*1/i.test(css),
      celebrate: 'Snapped into a tidy row!',
    },
    {
      id: 's8',
      title: 'Center the content in each fruit',
      emoji: '🎯',
      task: "In the .fruit block, add text-align: center;",
      story: "This centers the emoji inside each card.",
      check: ({ css }) => /\.fruit[^{}]*\{[^{}]*text-align\s*:\s*center/i.test(css),
    },
    {
      id: 's9',
      title: 'Wrap on smaller screens',
      emoji: '🌯',
      task: "In .bowl, add flex-wrap: wrap;",
      story:
        "Without this, a narrow screen squishes your fruits. With it, they jump to a new row when they run out of space.",
      check: ({ css }) => /\.bowl[^{}]*\{[^{}]*flex-wrap\s*:\s*wrap/i.test(css),
    },
    {
      id: 's10',
      title: 'That is layout!',
      emoji: '🎨',
      story:
        "display: flex, gap, justify-content, flex: 1, flex-wrap. Those five little lines arrange almost every row you'll ever see on the web.",
    },
  ],
};

export default lesson;
