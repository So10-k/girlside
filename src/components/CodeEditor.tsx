import { useEffect, useRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { HighlightStyle, syntaxHighlighting, bracketMatching, indentOnInput, foldGutter } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { html as htmlLang } from '@codemirror/lang-html';
import { css as cssLang } from '@codemirror/lang-css';
import { javascript as jsLang } from '@codemirror/lang-javascript';

const cottonHighlight = HighlightStyle.define([
  { tag: [t.comment, t.lineComment, t.blockComment], color: '#9a90b0', fontStyle: 'italic' },
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.modifier], color: '#8E66C4', fontWeight: '600' },
  { tag: [t.string, t.special(t.string)], color: '#4CB87A' },
  { tag: [t.number, t.bool, t.null], color: '#E55C8E' },
  { tag: [t.variableName, t.labelName], color: '#2B2140' },
  { tag: [t.definition(t.variableName), t.definition(t.propertyName)], color: '#2B2140', fontWeight: '600' },
  { tag: [t.function(t.variableName), t.function(t.definition(t.variableName))], color: '#8E66C4' },
  { tag: [t.typeName, t.className], color: '#8E66C4' },
  { tag: t.propertyName, color: '#E55C8E' },
  { tag: t.tagName, color: '#8E66C4', fontWeight: '600' },
  { tag: t.attributeName, color: '#E55C8E' },
  { tag: t.attributeValue, color: '#4CB87A' },
  { tag: t.heading, fontWeight: '700' },
  { tag: t.atom, color: '#E55C8E' },
  { tag: t.punctuation, color: '#7C7194' },
  { tag: t.bracket, color: '#7C7194' },
]);

const cottonTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent',
      color: '#2B2140',
      height: '100%',
    },
    '.cm-content': {
      padding: '8px 12px',
      caretColor: '#2B2140',
    },
    '.cm-line': {
      padding: '0 8px',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: '#9a90b0',
      border: 'none',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 12px 0 10px',
      minWidth: '28px',
    },
    '.cm-activeLine': { backgroundColor: 'rgba(234, 220, 248, 0.35)' },
    '.cm-foldPlaceholder': {
      backgroundColor: 'rgba(234, 220, 248, 0.5)',
      color: '#2B2140',
      border: 'none',
      padding: '0 6px',
      borderRadius: '6px',
    },
  },
  { dark: false },
);

export type EditorLanguage = 'html' | 'css' | 'js';

function languageExtension(lang: EditorLanguage) {
  if (lang === 'html') return htmlLang();
  if (lang === 'css') return cssLang();
  return jsLang();
}

interface Props {
  value: string;
  language: EditorLanguage;
  onChange: (v: string) => void;
  beginnerMode?: boolean;
  onCursorLine?: (line: string, lineNumber: number) => void;
}

export default function CodeEditor({ value, language, onChange, beginnerMode = true, onCursorLine }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const onCursorRef = useRef(onCursorLine);

  onChangeRef.current = onChange;
  onCursorRef.current = onCursorLine;

  useEffect(() => {
    if (!hostRef.current) return;
    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        foldGutter(),
        syntaxHighlighting(cottonHighlight, { fallback: true }),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.lineWrapping,
        languageCompartment.current.of(languageExtension(language)),
        cottonTheme,
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            onChangeRef.current(u.state.doc.toString());
          }
          if (u.selectionSet || u.docChanged) {
            const cb = onCursorRef.current;
            if (cb) {
              const head = u.state.selection.main.head;
              const line = u.state.doc.lineAt(head);
              cb(line.text, line.number);
            }
          }
        }),
        EditorState.tabSize.of(2),
      ],
    });
    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap language when tab changes.
  useEffect(() => {
    const v = viewRef.current;
    if (!v) return;
    v.dispatch({
      effects: languageCompartment.current.reconfigure(languageExtension(language)),
    });
  }, [language]);

  // Keep editor in sync with external buffer changes (e.g. restore snapshot).
  useEffect(() => {
    const v = viewRef.current;
    if (!v) return;
    const current = v.state.doc.toString();
    if (current !== value) {
      v.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      className="h-full w-full rounded-2xl bg-white/60 border border-white/80 overflow-hidden"
      style={{ fontSize: beginnerMode ? 15 : 13 }}
    />
  );
}
