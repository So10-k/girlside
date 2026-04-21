import type { Lesson } from '../types';

const startHTML = `<body>
  <h1>Join the club ✨</h1>
  <p>We'll build a signup form step by step.</p>
  <!-- form goes here -->
</body>
`;

const startCSS = `body { font-family: system-ui, sans-serif; padding: 40px; background: #FFF6F1; color: #2B2140; }
h1 { color: #C46A7A; }
form { display: flex; flex-direction: column; gap: 10px; max-width: 280px; margin-top: 16px; }
label { font-size: 14px; color: #6B5D84; }
input { padding: 10px 12px; border-radius: 12px; border: 1px solid #EADCF8; font-size: 15px; }
button { padding: 10px 14px; border-radius: 999px; border: 0; background: #8E66C4; color: white; font-size: 15px; cursor: pointer; }
`;

const lesson: Lesson = {
  id: 'lesson-09-forms',
  unitId: 'unit-06-advanced',
  order: 9,
  title: 'Make a form',
  subtitle: 'Inputs, labels, and a submit button — the start of any portal site.',
  emoji: '📝',
  focusTab: 'html',
  celebrate: 'You built a real signup form! Next we give it a brain. 🧠',
  steps: [
    {
      id: 's1',
      title: 'What is a form?',
      emoji: '📝',
      story:
        "Every portal site — every login, every signup, every 'join the club' — starts with a form. A form is just a little box where people type things and press a button.",
      starter: { html: startHTML, css: startCSS, js: `// we'll use this in the next lesson\n` },
    },
    {
      id: 's2',
      title: 'Add a <form> tag',
      emoji: '📦',
      task: 'Replace the comment with:\n<form id="signup">\n</form>',
      story:
        "A <form> is a container. Anything inside it is part of the form. We give it an id so we can find it from JavaScript later.",
      check: ({ html }) => /<form[^>]*id=["']signup["']/i.test(html),
      celebrate: 'The container is there!',
    },
    {
      id: 's3',
      title: 'Add a label',
      emoji: '🏷️',
      task: 'Inside the form, add:\n<label for="username">Username</label>',
      story:
        "A <label> is a friendly name next to a field. 'for' matches an input's id so clicking the label focuses the input. Screen readers love this too.",
      check: ({ html }) => /<label[^>]*for=["']username["'][^>]*>/i.test(html),
    },
    {
      id: 's4',
      title: 'Add the username input',
      emoji: '⌨️',
      task: 'Under the label, add:\n<input id="username" name="username" type="text" />',
      story:
        "An <input> is where people type. type='text' means regular letters. 'name' is how the value gets labelled when the form is submitted.",
      check: ({ html }) => /<input[^>]*id=["']username["']/i.test(html),
    },
    {
      id: 's5',
      title: 'Add a password label',
      emoji: '🔐',
      task: 'Add:\n<label for="password">Password</label>',
      story: "Same idea as the username label — just for the password field.",
      check: ({ html }) => /<label[^>]*for=["']password["']/i.test(html),
    },
    {
      id: 's6',
      title: 'Add the password input',
      emoji: '🔑',
      task: 'Add:\n<input id="password" name="password" type="password" />',
      story:
        "type='password' tells the browser: hide what they type with dots. Very important! Never show passwords as plain text.",
      check: ({ html }) => /<input[^>]*type=["']password["']/i.test(html),
      celebrate: 'Now the password stays secret. 🤫',
    },
    {
      id: 's7',
      title: 'Add a submit button',
      emoji: '🚀',
      task: 'Add:\n<button type="submit">Sign up</button>',
      story:
        "type='submit' tells the browser: when this is clicked, submit the form. Later we'll catch that submit from JavaScript.",
      check: ({ html }) => /<button[^>]*type=["']submit["'][^>]*>/i.test(html),
    },
    {
      id: 's8',
      title: 'Try it!',
      emoji: '👉',
      story:
        "Click inside the preview and type in the boxes. Notice how the password shows as dots. Press the button — the page reloads (that's the default). We'll change that soon.",
    },
    {
      id: 's9',
      title: 'Add a placeholder',
      emoji: '💡',
      task: 'On the username input, add placeholder="pick a username":\n<input id="username" name="username" type="text" placeholder="pick a username" />',
      story:
        "'placeholder' is ghost text that shows inside an empty field. It hints at what to type and disappears when the user starts typing.",
      check: ({ html }) => /<input[^>]*id=["']username["'][^>]*placeholder=/i.test(html),
    },
    {
      id: 's10',
      title: 'Form complete!',
      emoji: '🎉',
      story:
        "You have a full signup form. No code yet to make it actually sign someone up — but the shape is there. Next lesson: teach it to remember people in a little database!",
    },
  ],
};

export default lesson;
