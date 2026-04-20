import type { Lesson } from '../types';

const IMG1 = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640';
const IMG2 = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640';

const lesson: Lesson = {
  id: 'lesson-06-images',
  unitId: 'unit-03-click',
  order: 6,
  title: 'Pictures!',
  subtitle: 'Put real photos on your page.',
  emoji: '🖼️',
  focusTab: 'html',
  celebrate: 'Your page is officially a picture book. 📸',
  steps: [
    {
      id: 's1',
      title: 'A different kind of tag',
      emoji: '🖼️',
      story:
        "Most tags come in pairs, like <h1>...</h1>. But <img> is different — it stands alone. It doesn't have a closing tag because it just shows one picture.",
      starter: {
        html: `<body>\n  <h1>Favorite places</h1>\n  <p>Scroll to see them.</p>\n</body>\n`,
        css: `body { font-family: system-ui, sans-serif; padding: 40px; background: #FFFBF5; color: #2B2140; }\nimg { display: block; }\n`,
        js: '',
      },
    },
    {
      id: 's2',
      title: 'Add your first image',
      emoji: '📷',
      task: `Under the paragraph, add:\n<img src="${IMG1}" alt="A foggy forest">`,
      story:
        "src is the ADDRESS of the picture. alt is a short DESCRIPTION of what's in the picture (so people who can't see it still know what's there).",
      hints: [
        'Copy the whole line above exactly. Keep the quotes.',
      ],
      check: ({ html }) => /<img\s[^>]*src=["']https?:\/\/[^"']+["']/i.test(html),
      celebrate: 'Welcome, forest!',
    },
    {
      id: 's3',
      title: 'Make sure alt text is good',
      emoji: '♿',
      task: "Change the alt text to describe the picture in your own words.",
      story:
        "Good alt text is short and true: 'A foggy forest'. Not 'image1' or 'pic'. This helps people with screen readers.",
      check: ({ html }) => {
        const m = html.match(/<img\s[^>]*alt=["']([^"']*)["']/i);
        const alt = (m?.[1] || '').trim().toLowerCase();
        return !!alt && alt.length >= 4 && alt !== 'a foggy forest';
      },
    },
    {
      id: 's4',
      title: 'Size the image with CSS',
      emoji: '📏',
      task: 'In styles.css, change the img rule to:\n\nimg {\n  display: block;\n  max-width: 320px;\n}',
      story:
        "Without a size, some pictures are huge. max-width caps how wide they can be, but lets smaller ones stay small.",
      check: ({ css }) => /img[^{}]*\{[^{}]*max-width\s*:\s*\d+/i.test(css),
    },
    {
      id: 's5',
      title: 'Round the corners',
      emoji: '🫧',
      task: "Add border-radius: 16px; to the img rule.",
      story:
        "Rounded-corner photos feel friendly and polished. Same trick we used on the card!",
      check: ({ css }) => /img[^{}]*\{[^{}]*border-radius\s*:\s*\d+/i.test(css),
    },
    {
      id: 's6',
      title: 'Add a second image',
      emoji: '🌅',
      task: `Under the first img tag, add:\n<img src="${IMG2}" alt="A sunny beach">`,
      story: "Pages can have lots of images. Let's add another one with a different URL.",
      check: ({ html }) =>
        (html.match(/<img\s[^>]*src=["']https?:\/\/[^"']+["'][^>]*>/gi) || []).length >= 2,
    },
    {
      id: 's7',
      title: 'Write a caption',
      emoji: '✒️',
      task: "Under each image, add a <p> telling where it is or what it shows.",
      story:
        "Captions help people make sense of a picture. Short is great.",
      check: ({ html }) => (html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || []).length >= 2,
    },
    {
      id: 's8',
      title: 'Give the pictures breathing room',
      emoji: '💨',
      task: "In the img rule, add margin-top: 16px;",
      story:
        "A little space between images feels much calmer.",
      check: ({ css }) => /img[^{}]*\{[^{}]*margin-top\s*:/i.test(css),
    },
    {
      id: 's9',
      title: 'Make them clickable',
      emoji: '👆',
      task: "Wrap one <img> inside an <a href=\"https://example.com\">...</a>.",
      story:
        "You can put any tag inside a link! Wrapping an image in <a> makes the whole picture clickable.",
      hints: [
        "Example:\n<a href=\"https://example.com\">\n  <img src=\"...\" alt=\"...\">\n</a>",
      ],
      check: ({ html }) => /<a\s[^>]*href=["'][^"']+["'][^>]*>[\s\S]*?<img[\s\S]*?<\/a>/i.test(html),
      celebrate: 'The photo is a door now.',
    },
    {
      id: 's10',
      title: 'Looking good!',
      emoji: '🌟',
      story:
        "Two photos, captions, rounded corners, clickable. This is already a real webpage people would enjoy looking at.",
    },
  ],
};

export default lesson;
