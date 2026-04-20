export interface Buffers {
  html: string;
  css: string;
  js: string;
}

// A small runtime we inject into every preview. It forwards JS errors from the
// iframe back to the parent window so we can show a calm, beginner-friendly
// error overlay instead of silently failing.
const RUNTIME = `
<script>
(function () {
  function send(kind, payload) {
    try { parent.postMessage({ __girlside: true, kind: kind, payload: payload }, '*'); } catch (e) {}
  }
  window.addEventListener('error', function (e) {
    send('error', { message: e.message || 'Something went wrong.', line: e.lineno, col: e.colno });
  });
  window.addEventListener('unhandledrejection', function (e) {
    var m = (e.reason && (e.reason.message || String(e.reason))) || 'A promise was rejected.';
    send('error', { message: m });
  });
  var _log = console.log;
  console.log = function () {
    try {
      var parts = Array.prototype.slice.call(arguments).map(function (a) {
        try { return typeof a === 'string' ? a : JSON.stringify(a); } catch (e) { return String(a); }
      });
      send('log', { line: parts.join(' ') });
    } catch (e) {}
    _log.apply(console, arguments);
  };
  send('ready', {});
})();
</script>`;

export function buildSrcDoc({ html, css, js }: Buffers): string {
  // If the user wrote a full document, respect it. Otherwise wrap in a
  // friendly skeleton so beginners only need to write the interesting bits.
  const hasDocType = /<!doctype/i.test(html);
  const hasHtmlTag = /<html[\s>]/i.test(html);
  const bodyInner = hasHtmlTag ? html : `<!doctype html><html><head><meta charset="utf-8"/></head><body>${html}</body></html>`;
  const doc = hasDocType && hasHtmlTag ? html : bodyInner;

  // Inject <style> into <head>, and <script> + runtime before </body>.
  const styleTag = `<style>\n${css}\n</style>`;
  const userScript = `<script>\ntry {\n${js}\n} catch (err) {\n  parent.postMessage({ __girlside: true, kind: 'error', payload: { message: err && err.message ? err.message : String(err) } }, '*');\n}\n<\/script>`;

  let out = doc;
  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `${styleTag}</head>`);
  } else if (/<html[^>]*>/i.test(out)) {
    out = out.replace(/<html[^>]*>/i, (m) => `${m}<head>${styleTag}</head>`);
  } else {
    out = `${styleTag}\n${out}`;
  }

  if (/<\/body>/i.test(out)) {
    out = out.replace(/<\/body>/i, `${RUNTIME}${userScript}</body>`);
  } else {
    out = `${out}${RUNTIME}${userScript}`;
  }
  return out;
}
