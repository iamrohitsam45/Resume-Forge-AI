import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import cn from '../../utils/cn.js';

const VARIANTS = {
  primary: 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow hover:from-brand-700 hover:to-brand-600 disabled:opacity-60',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
  outline: 'border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 bg-transparent',
  ghost: 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 bg-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ai: 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:from-violet-700 hover:to-fuchsia-600',
};

const SIZES = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-base px-6 py-3.5 gap-2 rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

export const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, icon: Icon, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-ring disabled:cursor-not-allowed',
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
