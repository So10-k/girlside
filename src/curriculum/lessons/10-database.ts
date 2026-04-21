import type { Lesson } from '../types';

const startHTML = `<body>
  <h1>My tiny database 📒</h1>
  <p>Open the tutor panel's console to watch what happens.</p>
  <button id="add">Add a user</button>
  <button id="show">Show all users</button>
  <ul id="list"></ul>
</body>
`;

const startCSS = `body { font-family: system-ui, sans-serif; padding: 40px; background: #F2FBF4; color: #2B2140; }
h1 { color: #38936B; }
button { padding: 10px 14px; margin-right: 8px; border-radius: 999px; border: 0; background: #6CC49A; color: white; font-size: 15px; cursor: pointer; }
ul { margin-top: 20px; padding-left: 18px; }
li { padding: 4px 0; }
`;

const lesson: Lesson = {
  id: 'lesson-10-database',
  unitId: 'unit-06-advanced',
  order: 10,
  title: 'A little database',
  subtitle: 'Save, list, and find records with window.db — no backend needed.',
  emoji: '📒',
  focusTab: 'js',
  celebrate: 'You used a real database API! Every big app works this way. 🗄️',
  steps: [
    {
      id: 's1',
      title: 'What is a database?',
      emoji: '📒',
      story:
        "A database is just a place to keep things safe — like a notebook that remembers. Your preview has a magical one built in called window.db. It lives only on this page, so nothing leaves your computer.",
      starter: {
        html: startHTML,
        css: startCSS,
        js: `// window.db.users is a ready-made collection for storing people.\n`,
      },
    },
    {
      id: 's2',
      title: 'Peek at what is there',
      emoji: '👀',
      task: 'Add this line:\nconsole.log(db.users.all());',
      story:
        "db.users.all() returns every user as an array. At first it's empty — an empty list []. Check the tutor console to see.",
      check: ({ js }) => /db\.users\.all\s*\(\s*\)/i.test(js),
      celebrate: 'Empty list ✓ — that is a perfectly valid database!',
    },
    {
      id: 's3',
      title: 'Create your first user',
      emoji: '✨',
      task: 'Add:\ndb.users.create({ username: "sam", displayName: "Sam" });',
      story:
        "create() adds a new record. You pass an object with whatever fields you want — username, displayName, favoriteColor, anything. The db fills in an id and a createdAt time automatically.",
      check: ({ js }) => /db\.users\.create\s*\(\s*\{/i.test(js),
      celebrate: 'You wrote to a database!',
    },
    {
      id: 's4',
      title: 'Check the console',
      emoji: '🔎',
      story:
        "Look at the tutor panel's console. You'll see two lines: the empty all() from before, then [db] users.create with your new record. The db auto-logs everything it does so you can learn by watching.",
    },
    {
      id: 's5',
      title: 'Add another user',
      emoji: '👯',
      task: 'Add:\ndb.users.create({ username: "mina", displayName: "Mina" });',
      story: "Each call to create() adds a new record. Let's add a second person so we have a real list to work with.",
      check: ({ js }) => /db\.users\.create[\s\S]*db\.users\.create/i.test(js),
    },
    {
      id: 's6',
      title: 'List them all',
      emoji: '📋',
      task: 'Add:\nconsole.log("everyone:", db.users.all());',
      story: "Now all() returns two users. You can see every field you saved, plus the auto-added id and createdAt.",
      check: ({ js }) => /console\.log\([^)]*db\.users\.all\s*\(\s*\)/i.test(js),
    },
    {
      id: 's7',
      title: 'Find one user',
      emoji: '🎯',
      task: 'Add:\nconst sam = db.users.find({ username: "sam" });\nconsole.log("sam is:", sam);',
      story:
        "find() takes a query like { username: 'sam' } and returns the FIRST matching record (or null). It's how you look someone up by name.",
      check: ({ js }) => /db\.users\.find\s*\(\s*\{\s*username/i.test(js),
    },
    {
      id: 's8',
      title: 'Wire up the Add button',
      emoji: '➕',
      task: `Add:\ndocument.querySelector("#add").addEventListener("click", () => {\n  const name = prompt("Who shall we add?");\n  if (name) db.users.create({ username: name });\n});`,
      story:
        "Now clicking the Add button in the preview pops up a prompt, then saves whatever you typed. Try it! Each click adds a new record.",
      check: ({ js }) =>
        /querySelector\(["']#add["']\)[\s\S]*addEventListener/i.test(js) &&
        /db\.users\.create/i.test(js),
      celebrate: 'You can add people by clicking a button!',
    },
    {
      id: 's9',
      title: 'Render the list',
      emoji: '🖼️',
      task: `Add:\ndocument.querySelector("#show").addEventListener("click", () => {\n  const list = document.querySelector("#list");\n  list.innerHTML = "";\n  db.users.all().forEach((u) => {\n    const li = document.createElement("li");\n    li.textContent = u.username;\n    list.appendChild(li);\n  });\n});`,
      story:
        "We grab the <ul>, empty it, and for each user add a <li>. forEach means 'do this for every item in the array'. Click Show all users in the preview — your list appears on the page!",
      check: ({ js }) =>
        /querySelector\(["']#show["']\)[\s\S]*addEventListener/i.test(js) &&
        /forEach/i.test(js),
    },
    {
      id: 's10',
      title: 'You just built a CRUD app!',
      emoji: '🚀',
      story:
        "CRUD = Create, Read, Update, Delete. You used Create (create) and Read (all + find). The same API has db.users.update(id, {...}) and db.users.remove(id) for the other two. Every portal, forum, and social app starts exactly like this.",
    },
  ],
};

export default lesson;
