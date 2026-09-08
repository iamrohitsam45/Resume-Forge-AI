import { Sun, Moon, Monitor } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore.js';
import cn from '../../utils/cn.js';

const OPTIONS = [
  { key: 'light', icon: Sun },
  { key: 'dark', icon: Moon },
  { key: 'system', icon: Monitor },
];

export function ThemeToggle({ className }) {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  return (
    <div className={cn('flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900', className)}>
      {OPTIONS.map(({ key, icon: Icon }) => (
        <button
          key={key}
          aria-label={`${key} theme`}
          onClick={() => setTheme(key)}
          className={cn(
            'rounded-full p-1.5 transition-colors focus-ring',
            theme === key ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
