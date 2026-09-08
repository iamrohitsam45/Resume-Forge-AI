import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import cn from '../../utils/cn.js';

export const Select = forwardRef(({ className, label, error, options = [], id, placeholder, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full appearance-none rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 pr-9 text-sm text-slate-900 dark:text-slate-100 transition-shadow focus-ring',
            error ? 'border-red-400 focus-visible:ring-red-400' : 'border-slate-300 dark:border-slate-700',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';

export default Select;
