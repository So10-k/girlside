import type { Lesson } from '../types';

const lesson: Lesson = {
  id: 'lesson-05-buttons-and-links',
  unitId: 'unit-03-click',
  order: 5,
  title: 'Links and buttons',
  subtitle: 'Make things you can click.',
  emoji: '🔗',
  focusTab: 'html',
  celebrate: 'The internet is full of clickable things. Now you can make them too. ✨',
  steps: [
    {
      id: 's1',
      title: 'Clickable things',
      emoji: '🖱️',
      story:
        "Almost everything on the internet is clickable. Today we'll make two kinds: links (that go somewhere) and buttons (that will do something later).",
      starter: {
        html: `<body>\n  <h1>My favorite places</h1>\n  <p>Here are some cool things on the web.</p>\n</body>\n`,
        css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 40px;\n  background: #EFFAF3;\n  color: #2B2140;\n  line-height: 1.7;\n}\na { color: #8E66C4; font-weight: 600; }\nbutton { font: inherit; padding: 10px 16px; border-radius: 999px; border: 0; background: #8E66C4; color: white; cursor: pointer; }\n`,
        js: '',
      },
    },
    {
      id: 's2',
      title: 'Add your first link',
      emoji: '🔗',
      task: "Under the paragraph, add:\n<a href=\"https://example.com\">visit example</a>",
      story:
        "<a> is the 'anchor' tag — it's a link. The href is the web address it goes to. The words inside are what people click on.",
      hints: [
        "Put it on a new line inside body.",
        'The address must be in quotes.',
      ],
      check: ({ html }) => /<a\s[^>]*href=["']https?:\/\/[^"']+["'][^>]*>\s*\S[\s\S]*?<\/a>/i.test(html),
      celebrate: 'A real live link!',
    },
    {
      id: 's3',
      title: 'Change the words of your link',
      emoji: '✏️',
      task: "Change the words between <a>...</a> to something other than 'visit example'.",
      story:
        "The words people click don't have to match the address. They should tell people where they're going.",
      check: ({ html }) => {
        const m = html.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
        const text = (m?.[1] || '').trim().toLowerCase();
        return !!text && text !== 'visit example';
      },
    },
    {
      id: 's4',
      title: 'Add a second link',
      emoji: '🔗',
      task: "Below the first link, add another <a> going to a different website.",
      story: "A page can have as many links as you want. Let's add a second one.",
      hints: ['Pick a real website you know. Keep the https:// at the front.'],
      check: ({ html }) =>
        (html.match(/<a\s[^>]*href=["']https?:\/\/[^"']+["'][^>]*>[\s\S]*?<\/a>/gi) || []).length >= 2,
    },
    {
      id: 's5',
      title: 'Open links in a new tab',
      emoji: '🗂️',
      task: "On one of your <a> tags, add target=\"_blank\" (inside the opening tag).",
      story:
        "target=\"_blank\" tells the browser: when someone clicks, open it in a NEW tab so they don't lose our page.",
      hints: [
        "Example: <a href=\"https://example.com\" target=\"_blank\">example</a>",
      ],
      check: ({ html }) => /<a[^>]*target=["']_blank["'][^>]*>/i.test(html),
    },
    {
      id: 's6',
      title: 'Meet the button',
      emoji: '🔘',
      task: "Add <button>press me</button> at the bottom of the body.",
      story:
        "<button> makes a clickable button. Right now it doesn't DO anything — we'll give it a job later with JavaScript.",
      check: ({ html }) => /<button[^>]*>\s*\S[\s\S]*?<\/button>/i.test(html),
    },
    {
      id: 's7',
      title: 'Change the button words',
      emoji: '🏷️',
      task: "Change 'press me' to something else, like 'click for magic' or 'say hi'.",
      story: "Just like links, button words are yours to pick.",
      check: ({ html }) => {
        const m = html.match(/<button[^>]*>([\s\S]*?)<\/button>/i);
        const text = (m?.[1] || '').trim().toLowerCase();
        return !!text && text !== 'press me';
      },
    },
    {
      id: 's8',
      title: 'Add a second button',
      emoji: '🎛️',
      task: "Add another <button> right after the first.",
      story:
        "Pages can have lots of buttons. Keep the text short so they feel clickable.",
      check: ({ html }) => (html.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || []).length >= 2,
    },
    {
      id: 's9',
      title: 'Space the buttons out',
      emoji: '📎',
      task: "In styles.css, add:\nbutton { margin-right: 8px; }",
      story:
        "By default, buttons sit right next to each other. Adding margin pushes them apart.",
      hints: [
        "Find the existing button line in CSS and add margin-right: 8px; inside.",
      ],
      check: ({ css }) => /button[^{}]*\{[^{}]*margin-right\s*:\s*\d+px/i.test(css),
    },
    {
      id: 's10',
      title: 'Ready to move',
      emoji: '🚀',
      story:
        "You've got working links and stylish buttons. Next up: we'll teach the buttons tricks.",
    },
  ],
};

export default lesson;
