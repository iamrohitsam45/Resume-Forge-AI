import { motion } from 'framer-motion';
import cn from '../../utils/cn.js';

export function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn('flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/60', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'relative flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-ring',
            active === tab.value ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          )}
        >
          {active === tab.value && (
            <motion.span
              layoutId="tabs-pill"
              className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-700"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default Tabs;
