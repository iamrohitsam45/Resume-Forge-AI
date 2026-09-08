import cn from '../../utils/cn.js';

const VARIANTS = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
};

export function Badge({ children, variant = 'default', className, icon: Icon }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', VARIANTS[variant], className)}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

export default Badge;
