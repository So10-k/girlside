import type { Lesson } from '../types';

const startHTML = `<body>
  <h1>Hi, I'm Maya!</h1>
  <p>I love drawing and making things.</p>
</body>
`;

const lesson: Lesson = {
  id: 'lesson-03-colors-and-fonts',
  unitId: 'unit-02-style',
  order: 3,
  title: 'Colors and fonts',
  subtitle: 'Make your page look the way you feel.',
  emoji: '🎨',
  focusTab: 'css',
  celebrate: 'You are dressing up the web! 🎨',
  steps: [
    {
      id: 's1',
      title: 'Meet CSS',
      emoji: '✨',
      story:
        "HTML is the BONES of a page (what's there). CSS is the OUTFIT (how it looks). We'll work in the styles.css tab now.",
      starter: {
        html: startHTML,
        css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 40px;\n  background: #FFFBF5;\n}\n`,
        js: '',
      },
    },
    {
      id: 's2',
      title: 'Read a CSS rule',
      emoji: '🔎',
      story:
        "A CSS rule looks like this:\n\nthing {\n  property: value;\n}\n\nThe 'thing' is what you're styling (like body or h1). The lines inside change how it looks.",
    },
    {
      id: 's3',
      title: 'Pick a text color',
      emoji: '🖍️',
      task: "Add a new block in styles.css:\n\nh1 {\n  color: hotpink;\n}",
      story:
        "Let's make the big heading a pretty color. 'color' changes the TEXT color. Try hotpink, or pick any color word.",
      hints: [
        'Under the body block, add:\nh1 {\n  color: hotpink;\n}',
        "Don't forget the curly braces and the semicolon.",
      ],
      check: ({ css }) => /h1[^{}]*\{[^{}]*color\s*:\s*[^;}]+/i.test(css),
      celebrate: 'Gorgeous — pink is a power move.',
    },
    {
      id: 's4',
      title: 'Try a hex color',
      emoji: '🧪',
      task: "Change h1's color from hotpink to #8E66C4 (a pretty purple).",
      story:
        "Colors can also be written as a code starting with #. #8E66C4 is lavender purple. Every color on the screen has a code like this.",
      hints: ["Replace 'hotpink' with #8E66C4 — keep the semicolon."],
      check: ({ css }) => /h1[^{}]*\{[^{}]*color\s*:\s*#8E66C4/i.test(css),
    },
    {
      id: 's5',
      title: 'Color the paragraph too',
      emoji: '📝',
      task: "Add a p block that sets color to #7C7194",
      story:
        "We can style different tags differently. Let's give paragraphs their own softer color.",
      hints: [
        'Add under the h1 block:\np {\n  color: #7C7194;\n}',
      ],
      check: ({ css }) => /p[^{}]*\{[^{}]*color\s*:\s*#7C7194/i.test(css),
    },
    {
      id: 's6',
      title: 'Make the page background warm',
      emoji: '🕯️',
      task: "Inside the body block, change background to #FFF3C9",
      story:
        "The body block styles the whole page. Changing the background paints the whole thing.",
      check: ({ css }) => /body[^{}]*\{[^{}]*background\s*:\s*#FFF3C9/i.test(css),
    },
    {
      id: 's7',
      title: 'Change the font',
      emoji: '🔤',
      task: "In the body block, change font-family to 'Georgia', serif",
      story:
        "Fonts are the shape of letters. Some look crisp (system-ui). Some look classic (Georgia). Try Georgia — it's more old-book-y.",
      hints: [
        "Change the line to:\nfont-family: 'Georgia', serif;",
      ],
      check: ({ css }) => /body[^{}]*\{[^{}]*font-family\s*:[^;}]*georgia/i.test(css),
    },
    {
      id: 's8',
      title: 'Make the heading HUGE',
      emoji: '🔠',
      task: "Add font-size: 56px; to the h1 block.",
      story:
        "font-size controls how big the letters are. 56 pixels is nice and bold.",
      check: ({ css }) =>
        /h1[^{}]*\{[^{}]*font-size\s*:\s*\d{2,}px/i.test(css),
    },
    {
      id: 's9',
      title: 'Add a dash of space between letters',
      emoji: '📏',
      task: "In the h1 block, add letter-spacing: 1px;",
      story:
        "Tiny design touch. Spreading the letters out just a little makes a heading feel expensive.",
      check: ({ css }) => /h1[^{}]*\{[^{}]*letter-spacing\s*:/i.test(css),
    },
    {
      id: 's10',
      title: 'Look how pretty!',
      emoji: '🌷',
      story:
        "You just changed colors, fonts, and sizes. You're doing real design work now. Honest!",
    },
  ],
};

export default lesson;
