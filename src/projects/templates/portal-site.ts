import type { Template } from '../types';

const tpl: Template = {
  id: 'tpl-portal',
  title: 'Portal site',
  emoji: '🔐',
  blurb: 'A members-only portal with signup, signin, and signout — all working.',
  tips: [
    "Pick your own theme colors for the portal — rename the headings to anything you like.",
    "Add a third form field (like a favorite color) and save it with db.auth.signUp.",
    "After signin, show a personal welcome using db.auth.currentUser().username.",
    "Call db.seedDemoUsers() if you want a couple of practice accounts ready.",
  ],
  html: `<body>
  <header>
    <h1>🌷 Petal Portal</h1>
    <div id="status">Not signed in.</div>
  </header>

  <main>
    <section id="auth">
      <div class="card">
        <h2>Sign up</h2>
        <form id="signup">
          <input id="su-user" name="username" placeholder="username" />
          <input id="su-pass" name="password" type="password" placeholder="password" />
          <button type="submit">Create account</button>
        </form>
      </div>

      <div class="card">
        <h2>Sign in</h2>
        <form id="signin">
          <input id="si-user" name="username" placeholder="username" />
          <input id="si-pass" name="password" type="password" placeholder="password" />
          <button type="submit">Sign in</button>
        </form>
      </div>
    </section>

    <section id="members" hidden>
      <div class="card welcome">
        <h2 id="hello">Welcome!</h2>
        <p>You're in the secret garden. 🌿</p>
        <button id="signout">Sign out</button>
      </div>
    </section>

    <p class="hint">Try the seeded account: <code>ada / lovelace</code></p>
  </main>
</body>
`,
  css: `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(180deg, #F4EFFC 0%, #FFF0F5 100%);
  color: #2B2140;
  padding: 40px 20px;
  max-width: 640px;
  margin: 0 auto;
}
h1 { font-family: 'Fraunces', serif; color: #6E45B0; margin: 0; }
header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 10px; }
#status { font-size: 14px; padding: 6px 12px; background: white; border-radius: 999px; color: #6B5D84; box-shadow: 0 6px 16px -12px rgba(110,69,176,0.3); }
#auth { display: grid; gap: 14px; grid-template-columns: 1fr 1fr; margin-top: 24px; }
.card { background: white; border-radius: 20px; padding: 18px 20px; box-shadow: 0 14px 32px -22px rgba(70,42,120,0.25); }
.card h2 { margin: 0 0 10px; color: #8E66C4; font-size: 17px; }
form { display: flex; flex-direction: column; gap: 8px; }
input { padding: 10px 12px; border-radius: 12px; border: 1px solid #EADCF8; font-size: 14px; font-family: inherit; }
button { padding: 10px 14px; border-radius: 999px; border: 0; background: #8E66C4; color: white; font-size: 14px; cursor: pointer; font-family: inherit; }
button:hover { filter: brightness(1.05); }
.welcome { text-align: center; background: #FFF6F1; }
.welcome h2 { color: #C46A7A; font-size: 20px; }
#signout { background: #D48CA0; margin-top: 8px; }
.hint { margin-top: 20px; font-size: 13px; color: #6B5D84; text-align: center; }
code { background: white; padding: 2px 6px; border-radius: 6px; }
@media (max-width: 520px) {
  #auth { grid-template-columns: 1fr; }
}
`,
  js: `db.seedDemoUsers();

const statusEl = document.querySelector("#status");
const authSection = document.querySelector("#auth");
const membersSection = document.querySelector("#members");
const helloEl = document.querySelector("#hello");

function refresh() {
  const user = db.auth.currentUser();
  if (user) {
    statusEl.textContent = "Signed in";
    helloEl.textContent = "Welcome, " + user.username + "!";
    authSection.hidden = true;
    membersSection.hidden = false;
  } else {
    statusEl.textContent = "Not signed in.";
    authSection.hidden = false;
    membersSection.hidden = true;
  }
}

document.querySelector("#signup").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.querySelector("#su-user").value.trim();
  const password = document.querySelector("#su-pass").value;
  if (!username || !password) return alert("Please fill both fields");
  try {
    db.auth.signUp({ username, password });
    refresh();
  } catch (err) {
    alert(err.message);
  }
});

document.querySelector("#signin").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.querySelector("#si-user").value.trim();
  const password = document.querySelector("#si-pass").value;
  const user = db.auth.signIn(username, password);
  if (user) refresh();
  else alert("Wrong username or password");
});

document.querySelector("#signout").addEventListener("click", () => {
  db.auth.signOut();
  refresh();
});

refresh();
`,
};

export default tpl;
