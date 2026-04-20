import type { Lesson } from '../types';

const miniStarter = {
  html: `<body>\n  \n</body>\n`,
  css: `body { font-family: system-ui, sans-serif; padding: 40px; background: #FFFBF5; color: #2B2140; }\n`,
  js: '',
};

const lesson: Lesson = {
  id: 'lesson-00-keyboard-basics',
  unitId: 'unit-00-welcome',
  order: 0,
  title: 'Hello, keyboard!',
  subtitle: 'Before any code — meet your keys.',
  emoji: '⌨️',
  focusTab: 'html',
  celebrate: "You learned how to press keys AND how the editor helps you. You're READY! 💖",
  steps: [
    {
      id: 's1',
      title: 'Welcome to Girlside ♡',
      emoji: '🌸',
      story: 'A short, musical welcome.',
      hideEditor: true,
      interactive: {
        kind: 'intro',
        sound: 'welcome',
        emoji: '🌸',
        lines: [
          'Hi, friend!',
          'Today we will learn how to make a web page.',
          'But first… meet your keyboard.',
        ],
      },
    },
    {
      id: 's2',
      title: 'This is your keyboard',
      emoji: '⌨️',
      story:
        "Every letter, number, and symbol has its own home. You don't have to remember them — they're all right here. When a key lights up, press it.",
      hideEditor: true,
      interactive: {
        kind: 'press-key',
        target: 'a',
        prompt: 'press the A key',
      },
    },
    {
      id: 's3',
      title: 'Nice! Try another one',
      emoji: '✨',
      story: 'Your fingers are warming up. Press H — top row, just right of G.',
      hideEditor: true,
      interactive: {
        kind: 'press-key',
        target: 'h',
        prompt: 'press H',
      },
    },
    {
      id: 's4',
      title: 'The big one at the bottom',
      emoji: '🫧',
      story: "The longest key is called space. It makes the little gap between words.",
      hideEditor: true,
      interactive: {
        kind: 'press-key',
        target: ' ',
        prompt: 'tap the space bar',
      },
    },
    {
      id: 's5',
      title: 'Two VERY important symbols',
      emoji: '🔑',
      story:
        "Code uses < and > a LOT. They're called angle brackets. < is shift + comma. > is shift + period. Try typing: < then >",
      hideEditor: true,
      interactive: {
        kind: 'press-sequence',
        sequence: ['<', '>'],
        prompt: 'type < then >',
      },
    },
    {
      id: 's6',
      title: "Let's spell the word 'hi'",
      emoji: '💬',
      story: 'Press the keys in order: H, I, space. Your keyboard glows to help you find them.',
      hideEditor: true,
      interactive: {
        kind: 'press-sequence',
        sequence: ['h', 'i', ' '],
        prompt: 'type H · I · space',
      },
    },
    {
      id: 's7',
      title: 'A little editor secret',
      emoji: '🪄',
      story:
        "When you type an opening tag like <h1>, the editor magically types the closing </h1> for you. Watch.",
      hideEditor: true,
      interactive: {
        kind: 'autoclose-demo',
      },
    },
    {
      id: 's8',
      title: "Now let's try it for real",
      emoji: '👩‍💻',
      story:
        "Time to open the code editor! It's smaller than the keyboard but you already know what to do. Your goal: type <h1>Hi!</h1> in the HTML box.",
      starter: miniStarter,
      task: 'Inside <body>, type: <h1>Hi!</h1>',
      hints: [
        'Click inside the editor on the right, then start typing <h1 — watch the closing tag appear!',
        'Between the > and < type: Hi!',
      ],
      check: ({ html }) => /<h1[^>]*>\s*\S[\s\S]*?<\/h1>/i.test(html),
      celebrate: 'YES! Your first real tag typed on a keyboard!',
    },
    {
      id: 's9',
      title: 'Change Hi! to your name',
      emoji: '🪪',
      story:
        "Now make it yours. Replace Hi! with your name. The page updates the INSTANT you type. Magic.",
      check: ({ html }) => {
        const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const text = (m?.[1] || '').trim();
        return !!text && text.toLowerCase() !== 'hi!' && text.length >= 2;
      },
      celebrate: 'Hi! 👋',
    },
    {
      id: 's10',
      title: "You're ready!",
      emoji: '🚀',
      story:
        "You know how to find letters, special symbols, and you saw the editor's little magic trick. That is EVERY skill you need to start Lesson 1. Great job!",
    },
  ],
};

export default lesson;
