import { BUILDER_SECTIONS } from '../../constants/sections.js';
import { ICON_MAP } from '../../utils/iconMap.js';
import cn from '../../utils/cn.js';

export function ResumeFormSidebar({ active, onSelect, className }) {
  return (
    <nav className={cn('flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible', className)}>
      {BUILDER_SECTIONS.map((s) => {
        const Icon = ICON_MAP[s.icon];
        const isActive = active === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onSelect(s.key)}
            className={cn(
              'flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-ring lg:w-full',
              isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {s.label}
          </button>
        );
      })}
    </nav>
  );
}

export default ResumeFormSidebar;
