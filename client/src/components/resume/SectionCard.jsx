import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, ChevronDown, Copy, Trash2 } from 'lucide-react';
import cn from '../../utils/cn.js';

/** Collapsible, draggable, duplicable card wrapper for a single item in a list-based resume section. */
export function SectionCard({ id, title, subtitle, defaultOpen = true, onDuplicate, onDelete, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button {...attributes} {...listeners} className="cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing" aria-label="Drag to reorder">
          <GripVertical className="h-4 w-4" />
        </button>
        <button className="flex flex-1 items-center justify-between text-left" onClick={() => setOpen((o) => !o)}>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{title || 'Untitled'}</p>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
          <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', open && 'rotate-180')} />
        </button>
        {onDuplicate && (
          <button onClick={onDuplicate} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800" aria-label="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-slate-100 p-4 dark:border-slate-800">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SectionCard;
