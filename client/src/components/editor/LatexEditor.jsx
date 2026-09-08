import Editor from '@monaco-editor/react';
import { useUIStore } from '../../store/useUIStore.js';
import registerLatexLanguage from './latexLanguage.js';

export function LatexEditor({ value, onChange, height = '100%' }) {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  return (
    <Editor
      height={height}
      language="latex"
      theme={isDark ? 'vs-dark' : 'light'}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      beforeMount={registerLatexLanguage}
      options={{
        fontSize: 13,
        minimap: { enabled: false },
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        padding: { top: 16 },
        automaticLayout: true,
      }}
    />
  );
}

export default LatexEditor;
