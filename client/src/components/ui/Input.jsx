import { forwardRef } from 'react';
import cn from '../../utils/cn.js';

export const Input = forwardRef(({ className, label, error, hint, icon: Icon, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-shadow focus-ring',
            Icon && 'pl-9',
            error ? 'border-red-400 focus-visible:ring-red-400' : 'border-slate-300 dark:border-slate-700',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export default Input;
