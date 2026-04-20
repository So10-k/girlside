import type { Lesson } from '../types';

const baseCSS = `body {
  font-family: 'Inter', system-ui, sans-serif;
  padding: 40px;
  background: #F7F0FF;
  color: #2B2140;
  line-height: 1.6;
}
`;

const lesson: Lesson = {
  id: 'lesson-02-paragraphs',
  unitId: 'unit-01-hello',
  order: 2,
  title: 'Big words and small words',
  subtitle: 'Headings, paragraphs, bold, and italics.',
  emoji: '📖',
  focusTab: 'html',
  celebrate: 'You can make any kind of text now. Pretty cool! ✨',
  steps: [
    {
      id: 's1',
      title: "Let's talk about size",
      emoji: '🔤',
      story:
        "Web pages have different sized words. A big title. A smaller sub-title. Tiny notes. Today we meet the tags that do that.",
      starter: {
        html: `<body>\n  <h1>My day</h1>\n  <p>Today was pretty great.</p>\n</body>\n`,
        css: baseCSS,
        js: '',
      },
    },
    {
      id: 's2',
      title: 'Meet h1, h2, h3',
      emoji: '🪜',
      story:
        "Think of headings like stairs. <h1> is the top step — the biggest. <h2> is a little smaller. <h3> even smaller. All the way to <h6>.",
    },
    {
      id: 's3',
      title: 'Add a sub-heading',
      emoji: '📝',
      task: "Under the <h1>, add <h2>what I ate</h2>",
      story:
        "A sub-heading is a heading inside a bigger section. Let's say your page is about your day — under 'My day', add a smaller title for 'what I ate'.",
      hints: ['Right before the <p>, add <h2>what I ate</h2> on its own line.'],
      check: ({ html }) => /<h2[^>]*>\s*\S[\s\S]*?<\/h2>/i.test(html),
    },
    {
      id: 's4',
      title: 'Describe it in a paragraph',
      emoji: '🥐',
      task: "Add a <p> under your <h2> telling what you ate today (or would like to).",
      story: "Each heading gets a paragraph to go with it. Let's add one.",
      check: ({ html }) => (html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || []).length >= 2,
    },
    {
      id: 's5',
      title: 'Add another section',
      emoji: '🏃',
      task: "Add another <h2> and another <p> — this time about something you did.",
      story:
        "Web pages are lots of little sections. Each section starts with a heading and has a paragraph or two.",
      hints: [
        'Below your food paragraph, add:\n<h2>what I did</h2>\n<p>I rode my scooter.</p>',
      ],
      check: ({ html }) => {
        const h2 = (html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || []).length;
        const p = (html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || []).length;
        return h2 >= 2 && p >= 3;
      },
    },
    {
      id: 's6',
      title: 'Make a word bold',
      emoji: '💪',
      task: "Inside one of your paragraphs, wrap a word in <strong>...</strong>",
      story:
        "<strong> means 'this word is important!' The browser draws it bold and loud.",
      hints: [
        "Before the word you want bold type <strong>, and after it type </strong>.",
        "Example: I ate <strong>pancakes</strong> for breakfast.",
      ],
      check: ({ html }) => /<strong[^>]*>\s*\S[\s\S]*?<\/strong>/i.test(html),
      celebrate: 'Bold moves! 💪',
    },
    {
      id: 's7',
      title: 'Make a word slanty',
      emoji: '🎨',
      task: "Wrap a different word in <em>...</em> (em is short for emphasis).",
      story:
        "<em> tilts a word into *italics* — like you're saying it a little more softly or specially.",
      hints: ['Example: It was <em>amazing</em>.'],
      check: ({ html }) => /<em[^>]*>\s*\S[\s\S]*?<\/em>/i.test(html),
    },
    {
      id: 's8',
      title: 'Make a list',
      emoji: '🧾',
      task: "Add a bullet list under one of your paragraphs. Like this:\n<ul>\n  <li>pancakes</li>\n  <li>banana</li>\n  <li>tea</li>\n</ul>",
      story:
        "A bullet list is <ul> (unordered list) with <li> (list item) inside. One <li> for each bullet.",
      hints: [
        "Copy the example. You can change the three items to anything you want.",
      ],
      check: ({ html }) =>
        /<ul[\s\S]*?<\/ul>/i.test(html) &&
        (html.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || []).length >= 2,
      celebrate: 'A neat little list!',
    },
    {
      id: 's9',
      title: 'Add a line break',
      emoji: '↩️',
      task: "Inside one of your paragraphs, put <br> where you want the text to drop to a new line.",
      story:
        "<br> is a special tag — it has no closing partner. It just says 'start a new line right here.'",
      check: ({ html }) => /<br\s*\/?>/i.test(html),
    },
    {
      id: 's10',
      title: "Look at your little page!",
      emoji: '🌟',
      story:
        "You've got headings, paragraphs, bold, italics, a list, and line breaks. That's like half the tags on every blog in the world. Onward!",
    },
  ],
};

export default lesson;
