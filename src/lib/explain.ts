// A tiny, offline, beginner-friendly "explain this line" engine. It matches
// common HTML / CSS / JS patterns and returns warm, plain-English copy. It is
// intentionally simple — it never runs the code, never calls the network, and
// always returns *something* encouraging.

export type Lang = 'html' | 'css' | 'js';

interface Rule {
  test: RegExp;
  explain: (m: RegExpMatchArray) => string;
}

const htmlRules: Rule[] = [
  {
    test: /<h([1-6])[^>]*>(.*?)<\/h\1>/i,
    explain: (m) =>
      `This is a heading. <h${m[1]}> means "a heading at level ${m[1]}" — ` +
      `<h1> is the biggest, <h6> is the smallest. The text "${m[2]}" will show up ` +
      `bold and large on the page.`,
  },
  {
    test: /<p[^>]*>(.*?)<\/p>/i,
    explain: (m) =>
      `<p> stands for "paragraph". It holds a chunk of regular text, like "${m[1]}". ` +
      `The browser draws a little space above and below paragraphs automatically.`,
  },
  {
    test: /<a\s[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i,
    explain: (m) =>
      `This is a link. The "href" is where clicking it will go — "${m[1]}". ` +
      `The text "${m[2]}" is what people actually see and click.`,
  },
  {
    test: /<button[^>]*>(.*?)<\/button>/i,
    explain: (m) =>
      `A button! "${m[1]}" is its label. By itself it doesn't do anything — ` +
      `pair it with a tiny bit of JavaScript to make it react to clicks.`,
  },
  {
    test: /<img\s[^>]*src=["']([^"']+)["']/i,
    explain: (m) =>
      `<img> shows a picture from the address "${m[1]}". Always add an "alt" ` +
      `attribute too, so screen readers can describe the image out loud.`,
  },
  {
    test: /<div[^>]*>/i,
    explain: () =>
      `A <div> is a plain, invisible box. You use it to group other things together so ` +
      `you can style or move them as one chunk.`,
  },
  {
    test: /<span[^>]*>/i,
    explain: () =>
      `A <span> is a tiny inline wrapper — use it when you want to style just a few words ` +
      `inside a sentence without breaking the line.`,
  },
  {
    test: /<ul[^>]*>|<ol[^>]*>|<li[^>]*>/i,
    explain: () =>
      `Lists! <ul> is a bullet list, <ol> is a numbered list, and each <li> is one item ` +
      `inside the list.`,
  },
  {
    test: /<input[^>]*type=["']([^"']+)["']/i,
    explain: (m) =>
      `An input where people can type. The type "${m[1]}" tells the browser what kind of ` +
      `value to expect (like text, number, or email).`,
  },
  {
    test: /<input[^>]*>/i,
    explain: () =>
      `An <input> is a field people can type into. Add type="text" for words, type="password" ` +
      `to hide what they type, or type="email" for email addresses.`,
  },
  {
    test: /<label[^>]*for=["']([^"']+)["'][^>]*>(.*?)<\/label>/i,
    explain: (m) =>
      `A <label> is a friendly name for an input. "for=\\"${m[1]}\\"" links it to the input ` +
      `whose id is "${m[1]}" — clicking the label "${m[2]}" focuses that input.`,
  },
  {
    test: /<form[^>]*>/i,
    explain: () =>
      `A <form> is a container for inputs and a submit button. When someone presses enter or ` +
      `clicks submit, the form fires a "submit" event that your JS can catch.`,
  },
];

const cssRules: Rule[] = [
  {
    test: /color\s*:\s*([^;]+);?/i,
    explain: (m) =>
      `"color" changes the text color. Here it's set to ${m[1].trim()}. ` +
      `You can use color names (like "hotpink"), hex codes (like "#FF8AB8"), or rgb().`,
  },
  {
    test: /background(-color)?\s*:\s*([^;]+);?/i,
    explain: (m) =>
      `This sets the background to ${m[2].trim()}. That's the color or image behind the element, ` +
      `sitting under the text.`,
  },
  {
    test: /font-family\s*:\s*([^;]+);?/i,
    explain: (m) =>
      `"font-family" picks the typeface. Here it tries ${m[1].trim()}. The list is a ` +
      `fallback chain — if the first font isn't available, the browser moves to the next.`,
  },
  {
    test: /font-size\s*:\s*([^;]+);?/i,
    explain: (m) =>
      `"font-size" controls how big the text is — here it's ${m[1].trim()}. ` +
      `"px" is pixels; "rem" scales with the page's base size.`,
  },
  {
    test: /padding(-\w+)?\s*:\s*([^;]+);?/i,
    explain: (m) =>
      `Padding is the soft cushion *inside* an element, between its edge and its content. ` +
      `Here it's ${m[2].trim()}.`,
  },
  {
    test: /margin(-\w+)?\s*:\s*([^;]+);?/i,
    explain: (m) =>
      `Margin is the empty space *outside* an element — it pushes neighbors away. ` +
      `Here it's ${m[2].trim()}.`,
  },
  {
    test: /display\s*:\s*flex/i,
    explain: () =>
      `"display: flex" turns this box into a flex container. Its children will line up in a ` +
      `row by default, and you can space them out easily.`,
  },
  {
    test: /border-radius\s*:\s*([^;]+);?/i,
    explain: (m) =>
      `"border-radius" rounds the corners. ${m[1].trim()} is how round — bigger numbers mean ` +
      `softer, more pill-shaped corners.`,
  },
  {
    test: /box-shadow\s*:\s*([^;]+);?/i,
    explain: () =>
      `A box-shadow adds a soft drop shadow behind the element. Play with the numbers to ` +
      `make it closer or further away.`,
  },
  {
    test: /^[.#]?[\w-]+\s*\{/,
    explain: () =>
      `This is a CSS selector — it picks which elements the styles below apply to. ` +
      `"." means "a class", "#" means "an id", and no prefix means "a tag name".`,
  },
];

const jsRules: Rule[] = [
  {
    test: /db\.auth\.signUp\s*\(/i,
    explain: () =>
      `db.auth.signUp creates a new account. Pass an object like { username, password } — ` +
      `it throws if the username is already taken, otherwise it signs them in right away.`,
  },
  {
    test: /db\.auth\.signIn\s*\(/i,
    explain: () =>
      `db.auth.signIn checks a username and password. It returns the user if they match, ` +
      `or null if not. Great for wiring up a login form.`,
  },
  {
    test: /db\.auth\.currentUser\s*\(/i,
    explain: () =>
      `db.auth.currentUser() tells you who is signed in right now — or null if nobody is. ` +
      `Use it whenever the page first loads to decide what to show.`,
  },
  {
    test: /db\.auth\.signOut\s*\(/i,
    explain: () =>
      `db.auth.signOut() logs the current user out. After this, currentUser() returns null.`,
  },
  {
    test: /db\.(\w+)\.create\s*\(/i,
    explain: (m) =>
      `db.${m[1]}.create saves a new record into the "${m[1]}" collection. You pass an object ` +
      `with whatever fields you like — an id and createdAt are added for you.`,
  },
  {
    test: /db\.(\w+)\.find\s*\(/i,
    explain: (m) =>
      `db.${m[1]}.find({...}) returns the FIRST record in "${m[1]}" that matches every field ` +
      `in the query — or null if nothing matches.`,
  },
  {
    test: /db\.(\w+)\.all\s*\(/i,
    explain: (m) =>
      `db.${m[1]}.all() returns EVERY record in "${m[1]}" as an array. Loop over it with ` +
      `forEach or map to show them on the page.`,
  },
  {
    test: /db\.seedDemoUsers\s*\(/i,
    explain: () =>
      `db.seedDemoUsers() fills the users collection with a couple of practice accounts ` +
      `(ada / lovelace and grace / hopper). Handy while learning.`,
  },
  {
    test: /(\w+)\.addEventListener\(["']submit["']/i,
    explain: (m) =>
      `Listening for "${m[1]}" to be submitted. Inside the handler you'll usually call ` +
      `e.preventDefault() to stop the page from reloading, then read the input values.`,
  },
  {
    test: /\.preventDefault\s*\(\s*\)/i,
    explain: () =>
      `preventDefault() stops the browser's normal reaction to an event — like reloading the ` +
      `page when a form submits. You do your own thing with JavaScript instead.`,
  },
  {
    test: /const\s+(\w+)\s*=\s*document\.querySelector\(["']([^"']+)["']\)/i,
    explain: (m) =>
      `This grabs the first element on the page that matches "${m[2]}" and saves it in a ` +
      `box called "${m[1]}" so you can do things with it later.`,
  },
  {
    test: /document\.getElementById\(["']([^"']+)["']\)/i,
    explain: (m) =>
      `This finds the element whose id is "${m[1]}". Every id on a page should be unique.`,
  },
  {
    test: /(\w+)\.addEventListener\(["'](\w+)["'],/i,
    explain: (m) =>
      `This tells "${m[1]}" to listen for the "${m[2]}" event (like a click). When it happens, ` +
      `the function right after runs.`,
  },
  {
    test: /(\w+)\.textContent\s*=\s*(.+);?/i,
    explain: (m) =>
      `This changes the words inside "${m[1]}" to ${m[2].trim()}. It's a simple way to update ` +
      `what the page shows.`,
  },
  {
    test: /(\w+)\.style\.(\w+)\s*=\s*(.+);?/i,
    explain: (m) =>
      `This changes the ${m[2]} of "${m[1]}" to ${m[3].trim()} — like editing CSS from inside ` +
      `JavaScript.`,
  },
  {
    test: /function\s+(\w+)\s*\(/i,
    explain: (m) =>
      `This creates a function named "${m[1]}". A function is a reusable recipe — define it ` +
      `once, call it as many times as you like.`,
  },
  {
    test: /console\.log\((.+)\)/i,
    explain: (m) =>
      `"console.log" prints ${m[1].trim()} to the developer console — super handy for peeking ` +
      `at what's happening inside your code.`,
  },
  {
    test: /if\s*\(/i,
    explain: () =>
      `An "if" checks a condition. If the thing in the parentheses is true, the block runs; ` +
      `otherwise it's skipped.`,
  },
  {
    test: /for\s*\(/i,
    explain: () =>
      `A "for" loop repeats the block inside — great when you want to do the same thing a ` +
      `bunch of times.`,
  },
  {
    test: /let\s+(\w+)\s*=\s*(.+);?/i,
    explain: (m) =>
      `"let" makes a new variable "${m[1]}" holding ${m[2].trim()}. Because it's "let", ` +
      `you can change it later.`,
  },
  {
    test: /const\s+(\w+)\s*=\s*(.+);?/i,
    explain: (m) =>
      `"const" makes a new variable "${m[1]}" holding ${m[2].trim()}. "const" means the value ` +
      `shouldn't be reassigned — it's a steady label.`,
  },
];

const FALLBACKS: Record<Lang, string> = {
  html: `This is an HTML line — the bones of your page. HTML tags come in pairs like <thing>…</thing>, ` +
    `and they tell the browser what kind of thing each piece of content is.`,
  css: `This is a CSS line — the outfit of your page. CSS takes HTML and makes it pretty with colors, ` +
    `sizes, fonts, and spacing.`,
  js: `This is a JavaScript line — the behavior of your page. JavaScript can react to clicks, ` +
    `change what's showing, and make things move.`,
};

export function explainLine(lang: Lang, line: string): string {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('<!--') || trimmed.startsWith('/*')) {
    return "That's a comment — a little note for yourself or future you. The browser ignores it.";
  }
  const rules = lang === 'html' ? htmlRules : lang === 'css' ? cssRules : jsRules;
  for (const r of rules) {
    const m = trimmed.match(r.test);
    if (m) return r.explain(m);
  }
  return FALLBACKS[lang];
}

export function friendlyError(raw: string): { title: string; hint: string } {
  const msg = (raw || '').trim();
  if (!msg) return { title: 'Hmm, something tripped up.', hint: 'Try refreshing the preview.' };
  // Common error translations
  if (/is not defined/.test(msg)) {
    const name = msg.match(/(\w+) is not defined/)?.[1];
    return {
      title: name ? `JavaScript hasn't met "${name}" yet.` : `A name wasn't recognized.`,
      hint: `Check the spelling, and make sure you created it (with "let" or "const") before using it.`,
    };
  }
  if (/unexpected token/i.test(msg)) {
    return {
      title: `JavaScript got surprised by a symbol.`,
      hint: `Usually a missing ")", "}", or ";". Look at the line number above and double-check the punctuation.`,
    };
  }
  if (/cannot read propert(y|ies) of (null|undefined)/i.test(msg)) {
    return {
      title: `Tried to use something that wasn't there yet.`,
      hint: `Most of the time this means querySelector didn't find what you asked for. Check your selector spelling.`,
    };
  }
  if (/is not a function/.test(msg)) {
    return {
      title: `That thing isn't a function.`,
      hint: `Check the name and make sure you're using the right dots and parentheses.`,
    };
  }
  return {
    title: `Little bump in the road.`,
    hint: msg,
  };
}
