import { useCallback, useRef, useState } from 'react';
import { useUIStore } from '../store/useUIStore.js';
import { apiErrorMessage } from '../services/api.js';

/** Manages the request/loading/result lifecycle behind an AI suggestion modal. */
export function useAISuggestion() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const lastFetcher = useRef(null);
  const toast = useUIStore((s) => s.toast);

  const run = useCallback(
    async (fetcher) => {
      lastFetcher.current = fetcher;
      setOpen(true);
      setLoading(true);
      setResult(null);
      try {
        const data = await fetcher();
        setResult(data);
      } catch (err) {
        toast({ title: 'AI request failed', description: apiErrorMessage(err), variant: 'error' });
        setOpen(false);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const regenerate = useCallback(() => {
    if (lastFetcher.current) run(lastFetcher.current);
  }, [run]);

  const close = useCallback(() => setOpen(false), []);

  return { open, loading, result, run, regenerate, close };
}

export default useAISuggestion;
