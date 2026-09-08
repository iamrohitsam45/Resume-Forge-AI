import { useEffect } from 'react';

/**
 * shortcuts: { 'mod+s': handler, 'mod+k': handler, 'mod+p': handler, ... }
 * 'mod' maps to Cmd on Mac and Ctrl elsewhere.
 */
export function useKeyboardShortcuts(shortcuts, deps = []) {
  useEffect(() => {
    function onKeyDown(e) {
      const mod = e.metaKey || e.ctrlKey;
      for (const combo of Object.keys(shortcuts)) {
        const parts = combo.split('+');
        const key = parts[parts.length - 1];
        const needsMod = parts.includes('mod');
        const needsShift = parts.includes('shift');
        if (needsMod && !mod) continue;
        if (needsShift && !e.shiftKey) continue;
        if (e.key.toLowerCase() === key.toLowerCase()) {
          e.preventDefault();
          shortcuts[combo](e);
          return;
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useKeyboardShortcuts;
