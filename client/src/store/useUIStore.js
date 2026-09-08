import { create } from 'zustand';
import { uid } from '../utils/id.js';

function getSystemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function applyTheme(theme) {
  const isDark = theme === 'dark' || (theme === 'system' && getSystemPrefersDark());
  document.documentElement.classList.toggle('dark', isDark);
}

const initialTheme = localStorage.getItem('resumeforge_theme') || 'system';
applyTheme(initialTheme);

export const useUIStore = create((set, get) => ({
  theme: initialTheme,
  commandPaletteOpen: false,
  toasts: [],

  setTheme(theme) {
    localStorage.setItem('resumeforge_theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleCommandPalette(open) {
    set((s) => ({ commandPaletteOpen: open ?? !s.commandPaletteOpen }));
  },

  toast({ title, description, variant = 'default', duration = 4000 }) {
    const id = uid();
    set((s) => ({ toasts: [...s.toasts, { id, title, description, variant }] }));
    if (duration) {
      setTimeout(() => get().dismissToast(id), duration);
    }
    return id;
  },

  dismissToast(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
  const { theme } = useUIStore.getState();
  if (theme === 'system') applyTheme('system');
});

export default useUIStore;
