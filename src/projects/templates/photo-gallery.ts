import type { Template } from '../types';

const tpl: Template = {
  id: 'tpl-photo-gallery',
  title: 'Photo gallery',
  emoji: '🖼️',
  blurb: 'A neat grid of pictures with a soft rounded look.',
  tips: [
    'Swap any src URL with your own favorite photo link.',
    'Change the number in grid-template-columns to show more or fewer per row.',
    'Try adding a caption under each image.',
  ],
  html: `<body>
  <h1>Places I'd like to visit</h1>
  <div class="grid">
    <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640" alt="A misty forest">
    <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640" alt="Mountain lake">
    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640" alt="Sunny beach">
    <img src="https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=640" alt="Cobblestone street">
  </div>
</body>
`,
  css: `body { font-family: 'Inter', system-ui, sans-serif; background: #EFFAF3; color: #2B2140; padding: 40px 24px; max-width: 900px; margin: 0 auto; }
h1 { text-align: center; margin-bottom: 24px; }
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.grid img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 14px 36px -20px rgba(70,42,120,0.4);
}
`,
  js: ``,
};

export default tpl;
