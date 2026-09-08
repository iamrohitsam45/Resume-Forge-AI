import { useEffect, useRef, useState } from 'react';

/**
 * Debounced autosave: calls `onSave(data)` `delay` ms after `data` stops changing.
 * Returns a status string: 'idle' | 'saving' | 'saved' | 'error'.
 */
export function useAutosave(data, onSave, { delay = 1200, enabled = true } = {}) {
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(null);
  const firstRun = useRef(true);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    setStatus('idle');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (savingRef.current) return;
      savingRef.current = true;
      setStatus('saving');
      try {
        await onSave(data);
        setStatus('saved');
      } catch {
        setStatus('error');
      } finally {
        savingRef.current = false;
      }
    }, delay);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, delay, enabled]);

  return status;
}

export default useAutosave;
