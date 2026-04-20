import type { Lesson } from '../types';

const startHTML = `<body>
  <h1 id="title">Click the button!</h1>
  <button id="cheer">cheer me up</button>
</body>
`;

const startCSS = `body { font-family: system-ui, sans-serif; padding: 40px; background: #F7F0FF; text-align: center; color: #2B2140; }
button { font-size: 18px; padding: 12px 20px; border-radius: 999px; border: 0; background: #8E66C4; color: white; cursor: pointer; }
`;

const lesson: Lesson = {
  id: 'lesson-08-first-javascript',
  unitId: 'unit-05-move',
  order: 8,
  title: 'Make it move',
  subtitle: 'Your first JavaScript — a button that does something.',
  emoji: '✨',
  focusTab: 'js',
  celebrate: 'You made a page REACT. That is exactly how every app in the world works. 🚀',
  steps: [
    {
      id: 's1',
      title: 'What is JavaScript?',
      emoji: '🎩',
      story:
        "HTML puts things on the page. CSS styles them. JavaScript makes them DO things — like react when you click. Today we teach a button a trick.",
      starter: { html: startHTML, css: startCSS, js: `// We'll write code here!\n` },
    },
    {
      id: 's2',
      title: 'Look at the HTML',
      emoji: '🔎',
      story:
        "Notice the <h1 id=\"title\"> and <button id=\"cheer\">. 'id' is like a name tag. We'll use those names to find them from JavaScript.",
    },
    {
      id: 's3',
      title: 'Grab the button',
      emoji: '🎯',
      task: 'Add this line to script.js:\nconst button = document.querySelector("#cheer");',
      story:
        "querySelector means 'find the first element that matches this'. The # means 'with this id'. We're saving the button in a box called 'button'.",
      hints: [
        'Replace the comment with the line above.',
        "Make sure the quote marks are straight, not curly.",
      ],
      check: ({ js }) => /const\s+button\s*=\s*document\.querySelector\(["']#cheer["']\)/i.test(js),
      celebrate: 'You grabbed the button!',
    },
    {
      id: 's4',
      title: 'Grab the heading too',
      emoji: '🏷️',
      task: 'On the next line, add:\nconst title = document.querySelector("#title");',
      story: "Same trick, for the heading. We'll want to change what it says.",
      check: ({ js }) => /const\s+title\s*=\s*document\.querySelector\(["']#title["']\)/i.test(js),
    },
    {
      id: 's5',
      title: 'Listen for a click',
      emoji: '👂',
      task: 'Add:\nbutton.addEventListener("click", () => {\n  // what happens here\n});',
      story:
        "addEventListener means 'when something happens, run this code'. We're telling the button: 'when you get CLICKED, do what is inside the curly braces'.",
      hints: [
        "Paste the block exactly. We'll fill in the inside next step.",
      ],
      check: ({ js }) => /button\.addEventListener\(\s*["']click["']\s*,\s*\(\s*\)\s*=>\s*\{/i.test(js),
    },
    {
      id: 's6',
      title: 'Change the words on click',
      emoji: '💬',
      task: `Inside the addEventListener, add:\ntitle.textContent = "You're amazing!";`,
      story:
        "textContent is the words inside an element. Setting it changes what people see. Your whole function should now have one real line inside the curly braces.",
      check: ({ js }) => /addEventListener\(\s*["']click["'][\s\S]*?title\.textContent\s*=\s*["'][^"']+["']/i.test(js),
      celebrate: 'Try clicking the button in the preview!',
    },
    {
      id: 's7',
      title: 'Change the color too',
      emoji: '🎨',
      task: 'Inside the click handler, add a new line:\ntitle.style.color = "hotpink";',
      story:
        "You can also change CSS from JavaScript. element.style.color works just like the CSS color property.",
      check: ({ js }) => /addEventListener[\s\S]*?title\.style\.color\s*=\s*["'][^"']+["']/i.test(js),
    },
    {
      id: 's8',
      title: 'Say something different every time',
      emoji: '🎲',
      task: 'Before the handler code, add:\nconst messages = ["You rock!", "Keep going!", "So proud of you."];\n\nAnd change the textContent line to:\ntitle.textContent = messages[Math.floor(Math.random() * messages.length)];',
      story:
        "An array holds a list of things. Math.random() * messages.length picks a random position. Now every click shows a different cheer.",
      hints: [
        'You can pick your own list of cheers!',
      ],
      check: ({ js }) =>
        /const\s+messages\s*=\s*\[/i.test(js) &&
        /messages\s*\[\s*Math\.floor/i.test(js),
      celebrate: 'A surprise every click! 🎉',
    },
    {
      id: 's9',
      title: 'Log to the console',
      emoji: '📓',
      task: 'Inside the click handler, add:\nconsole.log("someone clicked the button!");',
      story:
        "console.log prints to the tutor panel's little console. Super handy for peeking at what your code is doing. Click the button and you'll see the message pile up.",
      check: ({ js }) => /console\.log\(\s*["'][^"']+["']\s*\)/i.test(js),
    },
    {
      id: 's10',
      title: 'You made an app!',
      emoji: '🚀',
      story:
        "Seriously — an interactive web page is an app. You wrote HTML, CSS, and JavaScript. That's the whole stack. Every website begins like this and just grows bigger. Well done!",
    },
  ],
};

export default lesson;
