import type { Template } from '../types';

const tpl: Template = {
  id: 'tpl-quiz',
  title: 'Mini quiz',
  emoji: '💡',
  blurb: 'A tiny one-question quiz with friendly feedback.',
  tips: [
    "Change the question and the right answer to anything you like.",
    "Add a second question by copying the block and tweaking the variables.",
    "Try making wrong answers shake by adding a CSS animation.",
  ],
  html: `<body>
  <main>
    <h1>Tiny quiz 🍀</h1>
    <p class="question">Which planet is closest to the sun?</p>
    <div class="choices">
      <button data-answer="Mercury">Mercury</button>
      <button data-answer="Venus">Venus</button>
      <button data-answer="Mars">Mars</button>
    </div>
    <p id="feedback"></p>
  </main>
</body>
`,
  css: `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #FFFBEA;
  color: #2B2140;
  padding: 40px 20px;
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
}
h1 { font-family: 'Fraunces', serif; }
.question { font-size: 20px; color: #4A3D63; }
.choices { display: grid; gap: 10px; margin: 20px 0; }
.choices button {
  font: inherit; padding: 14px 16px; border: 0;
  background: white; border-radius: 16px; cursor: pointer;
  box-shadow: 0 10px 24px -18px rgba(70,42,120,0.35);
  transition: transform 120ms ease;
}
.choices button:hover { transform: translateY(-1px); }
.choices button.right { background: #D6F5E3; }
.choices button.wrong { background: #FFD6E4; }
#feedback { font-weight: 600; min-height: 1.5em; }
`,
  js: `const correct = "Mercury";
const buttons = document.querySelectorAll(".choices button");
const feedback = document.querySelector("#feedback");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("right", "wrong"));
    if (btn.dataset.answer === correct) {
      btn.classList.add("right");
      feedback.textContent = "Yes! Nicely done. 🌟";
    } else {
      btn.classList.add("wrong");
      feedback.textContent = "So close — try again!";
    }
  });
});
`,
};

export default tpl;
