import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, FilePlus2, LayoutTemplate, Gauge, Sparkles, Download, Settings, FolderOpen } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';

export function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const toggle = useUIStore((s) => s.toggleCommandPalette);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const commands = useMemo(
    () => [
      { label: 'Create New Resume', icon: FilePlus2, action: () => navigate('/resume/new'), auth: true },
      { label: 'Open Dashboard', icon: FolderOpen, action: () => navigate('/dashboard'), auth: true },
      { label: 'Explore Templates', icon: LayoutTemplate, action: () => navigate('/templates') },
      { label: 'Analyze My Resume (ATS)', icon: Gauge, action: () => navigate('/dashboard'), auth: true },
      { label: 'Open AI Features', icon: Sparkles, action: () => navigate('/features') },
      { label: 'Open Settings', icon: Settings, action: () => navigate('/settings'), auth: true },
      { label: 'Go to Pricing', icon: Download, action: () => navigate('/pricing') },
    ],
    [navigate]
  );

  const filtered = commands
    .filter((c) => !c.auth || isAuthenticated)
    .filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  function run(cmd) {
    cmd.action();
    toggle(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => toggle(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <kbd className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-700">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && <p className="p-4 text-center text-sm text-slate-400">No matching commands</p>}
              {filtered.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => run(cmd)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <cmd.icon className="h-4 w-4 text-brand-500" />
                  {cmd.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
