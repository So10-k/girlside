import type { Lesson } from '../types';

const startHTML = `<body>
  <header>
    <h1>My portal 🔐</h1>
    <div id="status">Not signed in.</div>
  </header>

  <section id="signup-section">
    <h2>Sign up</h2>
    <form id="signup">
      <input id="su-user" name="username" placeholder="username" />
      <input id="su-pass" name="password" type="password" placeholder="password" />
      <button type="submit">Create account</button>
    </form>
  </section>

  <section id="signin-section">
    <h2>Sign in</h2>
    <form id="signin">
      <input id="si-user" name="username" placeholder="username" />
      <input id="si-pass" name="password" type="password" placeholder="password" />
      <button type="submit">Sign in</button>
    </form>
  </section>

  <button id="signout" hidden>Sign out</button>

  <p id="hint">Try seeded accounts: <code>ada / lovelace</code> or <code>grace / hopper</code>.</p>
</body>
`;

const startCSS = `body { font-family: system-ui, sans-serif; padding: 40px; background: #F4EFFC; color: #2B2140; max-width: 520px; margin: 0 auto; }
h1 { color: #6E45B0; margin: 0; }
h2 { color: #8E66C4; font-size: 18px; margin-top: 24px; }
header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 10px; }
#status { font-size: 14px; padding: 4px 10px; background: white; border-radius: 999px; color: #6B5D84; }
form { display: flex; flex-direction: column; gap: 8px; max-width: 280px; margin-top: 8px; }
input { padding: 10px 12px; border-radius: 12px; border: 1px solid #EADCF8; font-size: 15px; }
button { padding: 10px 14px; border-radius: 999px; border: 0; background: #8E66C4; color: white; font-size: 15px; cursor: pointer; align-self: flex-start; }
#signout { margin-top: 20px; background: #D48CA0; }
#hint { margin-top: 24px; font-size: 13px; color: #6B5D84; }
code { background: white; padding: 2px 6px; border-radius: 6px; }
`;

const lesson: Lesson = {
  id: 'lesson-11-login',
  unitId: 'unit-06-advanced',
  order: 11,
  title: 'Sign up & sign in',
  subtitle: 'Wire forms to the auth API — real signup / login logic.',
  emoji: '🔐',
  focusTab: 'js',
  celebrate: 'You built a working portal site! 💖 Logins, signups, the whole deal.',
  steps: [
    {
      id: 's1',
      title: 'Meet window.db.auth',
      emoji: '🔐',
      story:
        "Your preview has a built-in auth helper: db.auth. It knows how to sign people up, sign them in, remember who is logged in, and sign them out. We'll connect it to the forms on the page.",
      starter: { html: startHTML, css: startCSS, js: `// our login logic goes here\n` },
    },
    {
      id: 's2',
      title: 'Seed some demo users',
      emoji: '🌱',
      task: 'Add:\ndb.seedDemoUsers();',
      story:
        "seedDemoUsers() creates 'ada / lovelace' and 'grace / hopper' so there is already someone to sign in as. It only runs the first time (it skips if users already exist).",
      check: ({ js }) => /db\.seedDemoUsers\s*\(\s*\)/i.test(js),
    },
    {
      id: 's3',
      title: 'Add a helper to show status',
      emoji: '🪞',
      task: `Add:\nfunction refresh() {\n  const user = db.auth.currentUser();\n  document.querySelector("#status").textContent =\n    user ? "Signed in as " + user.username : "Not signed in.";\n  document.querySelector("#signout").hidden = !user;\n}\nrefresh();`,
      story:
        "currentUser() returns the signed-in user, or null. We use that to update the status chip and show/hide the Sign out button. Calling refresh() once at the start paints the initial state.",
      check: ({ js }) => /function\s+refresh\s*\(/i.test(js) && /db\.auth\.currentUser/i.test(js),
    },
    {
      id: 's4',
      title: 'Catch the signup form',
      emoji: '📝',
      task: `Add:\ndocument.querySelector("#signup").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const username = document.querySelector("#su-user").value;\n  const password = document.querySelector("#su-pass").value;\n  // we'll call auth.signUp next\n});`,
      story:
        "e.preventDefault() stops the browser from reloading the page when the form submits. Then we grab what the user typed. In the next step we actually save them.",
      check: ({ js }) =>
        /querySelector\(["']#signup["']\)[\s\S]*addEventListener\(\s*["']submit["']/i.test(js) &&
        /preventDefault/i.test(js),
    },
    {
      id: 's5',
      title: 'Call auth.signUp',
      emoji: '✨',
      task: `Inside the signup handler, replace the comment with:\ntry {\n  const user = db.auth.signUp({ username, password });\n  console.log("signed up!", user);\n  refresh();\n} catch (err) {\n  alert(err.message);\n}`,
      story:
        "signUp takes { username, password }. If the username is free, it creates the user and automatically signs them in. If it's taken, it throws an error — which we show with alert().",
      check: ({ js }) => /db\.auth\.signUp\s*\(/i.test(js),
      celebrate: 'Try it! Type a username and password, click Create account.',
    },
    {
      id: 's6',
      title: 'Catch the signin form',
      emoji: '🔑',
      task: `Add:\ndocument.querySelector("#signin").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const username = document.querySelector("#si-user").value;\n  const password = document.querySelector("#si-pass").value;\n  const user = db.auth.signIn(username, password);\n  if (user) {\n    console.log("welcome back!", user);\n    refresh();\n  } else {\n    alert("Wrong username or password");\n  }\n});`,
      story:
        "signIn(username, password) returns the user if the password matches, or null if not. We show a friendly alert on failure. Try it with ada / lovelace!",
      check: ({ js }) => /db\.auth\.signIn\s*\(/i.test(js),
    },
    {
      id: 's7',
      title: 'Wire the sign-out button',
      emoji: '👋',
      task: `Add:\ndocument.querySelector("#signout").addEventListener("click", () => {\n  db.auth.signOut();\n  refresh();\n});`,
      story:
        "signOut() clears the session. Then refresh() updates the UI to show 'Not signed in.' Simple and clean.",
      check: ({ js }) => /db\.auth\.signOut\s*\(/i.test(js),
    },
    {
      id: 's8',
      title: 'Try the full flow',
      emoji: '🎬',
      story:
        "In the preview: sign up with a new username. You'll see the status change. Click Sign out. Then sign in again with the same username — it should recognize you. Try the seeded ada / lovelace too.",
    },
    {
      id: 's9',
      title: 'Peek behind the curtain',
      emoji: '🔭',
      task: 'Add:\nconsole.log("all users:", db.users.all());',
      story:
        "Everyone you signed up is a record in db.users. auth is just a friendly layer on top. Open the tutor console — you can see their usernames and (redacted) passwords in the log.",
      check: ({ js }) => /db\.users\.all/i.test(js),
    },
    {
      id: 's10',
      title: 'You built a portal site 🎉',
      emoji: '💖',
      story:
        "Signup, signin, signout, remembered sessions — that's the core of every members-only site on the internet. Now go remix this into anything you want: a fan club, a diary, a pet profile app. You have the tools.",
    },
  ],
};

export default lesson;
