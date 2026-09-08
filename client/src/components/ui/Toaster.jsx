import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore.js';
import cn from '../../utils/cn.js';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  default: Info,
};

const COLORS = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  default: 'text-brand-500',
};

export function Toaster() {
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant] || ICONS.default;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="glass pointer-events-auto flex items-start gap-3 rounded-xl p-3.5 shadow-xl"
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', COLORS[t.variant] || COLORS.default)} />
              <div className="flex-1">
                {t.title && <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</p>}
                {t.description && <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{t.description}</p>}
              </div>
              <button onClick={() => dismissToast(t.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default Toaster;
