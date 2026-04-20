import type { Lesson } from '../types';

const baseCSS = `body {
  font-family: 'Inter', system-ui, sans-serif;
  padding: 40px;
  background: #FFF8F2;
  color: #2B2140;
  line-height: 1.6;
}
`;

const lesson: Lesson = {
  id: 'lesson-01-hello-heading',
  unitId: 'unit-01-hello',
  order: 1,
  title: 'Your first page',
  subtitle: 'Say hi to the web.',
  emoji: '👋',
  focusTab: 'html',
  celebrate: "You made a real web page from scratch. That's huge! 🌟",
  steps: [
    {
      id: 's1',
      title: 'Welcome!',
      emoji: '🌸',
      story:
        "Hi! Today we're going to write a real web page. It will live in the little preview on the right. You type words on the left, the page wakes up on the right.",
      starter: {
        html: `<body>\n  <!-- You'll write your words here -->\n</body>\n`,
        css: baseCSS,
        js: '',
      },
    },
    {
      id: 's2',
      title: 'Look at the code',
      emoji: '👀',
      story:
        "See those pointy <brackets>? Those are called tags. Tags are labels that tell the browser 'this piece is a heading' or 'this piece is a picture'. Don't change anything yet — just notice them.",
    },
    {
      id: 's3',
      title: 'Type your first tag',
      emoji: '✨',
      task:
        "Inside the <body>, type exactly this on its own line:\n<h1>Hi!</h1>",
      story:
        "<h1> means 'biggest, most important heading'. It comes as a pair: one to open, one to close (with a /). Whatever you put between them shows up huge on the page.",
      hints: [
        'Click inside the <body> tag (the line that says "body"), press Enter, and type <h1>Hi!</h1>',
        "Your HTML should have a line that looks like: <h1>Hi!</h1>",
        'Here you go: <h1>Hi!</h1>',
      ],
      solution: {
        html: `<body>\n  <h1>Hi!</h1>\n</body>\n`,
        css: baseCSS,
        js: '',
      },
      check: ({ html }) => /<h1[^>]*>\s*\S[\s\S]*?<\/h1>/i.test(html),
      celebrate: 'Look at that — your very first tag!',
    },
    {
      id: 's4',
      title: "Make it say your name",
      emoji: '🪪',
      task: "Change the word Hi! to your own name (or any name you like).",
      story:
        "Now for the fun part — the words between the tags are yours. Erase Hi! and type your name. The page changes the instant you type.",
      hints: [
        'Click between the > and < of your h1, delete "Hi!", and type your name.',
        'Example: <h1>Maya</h1>',
      ],
      check: ({ html }) => {
        const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const text = (m?.[1] || '').trim();
        return !!text && text.toLowerCase() !== 'hi!' && text.length >= 2;
      },
      celebrate: 'Nice to meet you! 💫',
    },
    {
      id: 's5',
      title: 'Add a little sentence',
      emoji: '💬',
      task: "Below your <h1>, add this on a new line:\n<p>I am learning to code.</p>",
      story:
        "Headings are short and shouty. Paragraphs are where you say a little more. The <p> tag wraps around regular sentences.",
      hints: [
        "Press Enter after your </h1> and type <p>I am learning to code.</p>",
        "It should look like two lines: one <h1> and one <p>.",
      ],
      check: ({ html }) => /<p[^>]*>\s*\S[\s\S]*?<\/p>/i.test(html),
      celebrate: 'Beautiful — headings and paragraphs, the bread and butter of the web.',
    },
    {
      id: 's6',
      title: 'Make the sentence yours',
      emoji: '🫶',
      task: "Change 'I am learning to code.' to something true about you.",
      story:
        "Anything is fine — your favorite color, a pet, what you had for breakfast. The page cheers you on no matter what you write.",
      check: ({ html }) => {
        const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        const text = (m?.[1] || '').trim().toLowerCase();
        return !!text && text !== 'i am learning to code.';
      },
    },
    {
      id: 's7',
      title: 'Sprinkle an emoji',
      emoji: '🌈',
      task: "Add an emoji somewhere inside your paragraph. Like 🌷 or 🐱 or 🍦.",
      story:
        "Emojis are characters, just like letters. You can pop them anywhere you'd put a letter. Try typing : then searching on your computer, or copy-paste one.",
      hints: [
        'On Mac, press Control + Command + Space to open the emoji picker.',
        "Any non-letter symbol counts, like ✨.",
      ],
      check: ({ html }) => {
        const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        const text = m?.[1] || '';
        return /[^\u0000-\u007F]/.test(text);
      },
      celebrate: 'A sprinkle of sparkle. Perfect.',
    },
    {
      id: 's8',
      title: 'Add another paragraph',
      emoji: '📝',
      task: "Add a SECOND <p> tag underneath the first one with any sentence you like.",
      story:
        "You can have as many paragraphs as you want. The browser stacks them one on top of the other.",
      hints: [
        'Press Enter after your first </p> and type <p>…</p> again with new words.',
        "Something like: <p>I have one little brother.</p>",
      ],
      check: ({ html }) => (html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || []).length >= 2,
    },
    {
      id: 's9',
      title: 'Say a big goodbye',
      emoji: '👋',
      task: "At the very bottom inside <body>, add <h2>bye for now!</h2>",
      story:
        "Just like <h1> is the biggest heading, <h2> is the second biggest. Add one so your page has a little ending.",
      hints: [
        'Put <h2>bye for now!</h2> right before the closing </body>.',
      ],
      check: ({ html }) => /<h2[^>]*>\s*\S[\s\S]*?<\/h2>/i.test(html),
    },
    {
      id: 's10',
      title: 'All done!',
      emoji: '🎉',
      story:
        "You wrote a whole web page. Tags, headings, paragraphs, emojis. Every big website in the world starts exactly like this. Take a second to feel proud — then click Finish to save your progress and pick the next lesson.",
    },
  ],
};

export default lesson;
