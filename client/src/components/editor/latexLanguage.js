// Minimal LaTeX syntax highlighting for Monaco - not a full LaTeX grammar, just
// enough to make resume .tex source readable (commands, braces, comments, math).
export function registerLatexLanguage(monaco) {
  if (monaco.languages.getLanguages().some((l) => l.id === 'latex')) return;

  monaco.languages.register({ id: 'latex' });

  monaco.languages.setMonarchTokensProvider('latex', {
    tokenizer: {
      root: [
        [/%.*$/, 'comment'],
        [/\\[a-zA-Z]+/, 'keyword'],
        [/[{}]/, 'delimiter.bracket'],
        [/\[[^\]]*\]/, 'annotation'],
        [/\$[^$]*\$/, 'string'],
      ],
    },
  });

  monaco.languages.setLanguageConfiguration('latex', {
    comments: { lineComment: '%' },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
    ],
  });
}

export default registerLatexLanguage;
