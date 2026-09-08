import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from '../../utils/cn.js';

export function Dropdown({ trigger, items = [], align = 'right', className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-40 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            {items.map((item, i) =>
              item.divider ? (
                <div key={i} className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                    item.danger && 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
