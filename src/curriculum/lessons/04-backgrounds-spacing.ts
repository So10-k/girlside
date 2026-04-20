import type { Lesson } from '../types';

const lesson: Lesson = {
  id: 'lesson-04-backgrounds-spacing',
  unitId: 'unit-02-style',
  order: 4,
  title: 'Cozy spacing',
  subtitle: 'Padding, margin, rounded corners, and a soft shadow.',
  emoji: '🧁',
  focusTab: 'css',
  celebrate: 'Your page feels cozy now. Like it wants a hug. 🧸',
  steps: [
    {
      id: 's1',
      title: 'Boxes, boxes everywhere',
      emoji: '📦',
      story:
        "Every element on a page is a little box. Today we'll learn how to make those boxes breathe — with space, colors, and soft edges.",
      starter: {
        html: `<body>\n  <div class="card">\n    <h1>Welcome!</h1>\n    <p>This is a little card on the page.</p>\n  </div>\n</body>\n`,
        css: `body {\n  font-family: system-ui, sans-serif;\n  background: #FFF3C9;\n  padding: 40px;\n  color: #2B2140;\n}\n\n.card {\n  background: white;\n}\n`,
        js: '',
      },
    },
    {
      id: 's2',
      title: 'What is .card?',
      emoji: '🔖',
      story:
        "See class=\"card\" on the <div> in the HTML? That's a label. In CSS, .card (with a dot) means 'style every element with the label card'. Labels let us style specific things.",
    },
    {
      id: 's3',
      title: 'Add padding inside the card',
      emoji: '🪶',
      task: "In the .card block, add padding: 24px;",
      story:
        "Padding is the SOFT CUSHION INSIDE a box — between the edge and what's inside. Without padding, the words squish right against the edge.",
      check: ({ css }) => /\.card[^{}]*\{[^{}]*padding\s*:\s*\d+px/i.test(css),
      celebrate: 'So much cozier already!',
    },
    {
      id: 's4',
      title: 'Round the corners',
      emoji: '🫧',
      task: "In the .card block, add border-radius: 20px;",
      story:
        "border-radius rounds off the corners. 0 means sharp. 20px is soft and friendly. 999px makes pill shapes.",
      check: ({ css }) => /\.card[^{}]*\{[^{}]*border-radius\s*:\s*\d+/i.test(css),
    },
    {
      id: 's5',
      title: 'Give it a soft shadow',
      emoji: '🌫️',
      task: "In the .card block, add box-shadow: 0 10px 30px -12px rgba(70,42,120,0.25);",
      story:
        "A soft shadow makes the card feel like it's floating just above the page. Those numbers say: no left/right nudge, 10px down, 30px of soft blur, pull the shadow in a bit.",
      check: ({ css }) => /\.card[^{}]*\{[^{}]*box-shadow\s*:/i.test(css),
      celebrate: "Ooooh that's dreamy.",
    },
    {
      id: 's6',
      title: 'Add space OUTSIDE the card',
      emoji: '💨',
      task: "In the .card block, add margin-top: 40px;",
      story:
        "Margin is the empty space OUTSIDE a box — it pushes neighbors away. Padding = cushion inside. Margin = space outside. Easy to mix up!",
      check: ({ css }) => /\.card[^{}]*\{[^{}]*margin-top\s*:\s*\d+px/i.test(css),
    },
    {
      id: 's7',
      title: 'Give it a max width',
      emoji: '📐',
      task: "In the .card block, add max-width: 420px;",
      story:
        "Without a max-width, the card stretches as wide as the screen. Capping it makes it feel neat, like a postcard.",
      check: ({ css }) => /\.card[^{}]*\{[^{}]*max-width\s*:/i.test(css),
    },
    {
      id: 's8',
      title: 'Center it on the page',
      emoji: '🎯',
      task: "In the .card block, add margin-left: auto; and margin-right: auto;",
      story:
        "'auto' on both sides tells the browser to split the extra space evenly — which centers the card.",
      check: ({ css }) =>
        /\.card[^{}]*\{[^{}]*margin-left\s*:\s*auto/i.test(css) &&
        /\.card[^{}]*\{[^{}]*margin-right\s*:\s*auto/i.test(css),
      celebrate: 'Right in the middle. So nice.',
    },
    {
      id: 's9',
      title: 'Center the text inside',
      emoji: '✒️',
      task: "In the .card block, add text-align: center;",
      story:
        "text-align moves the text inside — left, right, or center.",
      check: ({ css }) => /\.card[^{}]*\{[^{}]*text-align\s*:\s*center/i.test(css),
    },
    {
      id: 's10',
      title: 'Beautiful!',
      emoji: '🧁',
      story:
        "That card of yours is a real thing of beauty. Padding, rounded corners, a soft shadow, a max-width, centered both ways — those four tricks make almost any element look 'designed'.",
    },
  ],
};

export default lesson;
