import { useState } from 'react';
import { X } from 'lucide-react';
import cn from '../../utils/cn.js';

export function TagInput({ label, value = [], onChange, placeholder = 'Type and press Enter', className }) {
  const [draft, setDraft] = useState('');

  function commit() {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft('');
  }

  function removeAt(i) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className={cn('flex flex-wrap gap-1.5 rounded-xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900')}>
        {value.map((tag, i) => (
          <span key={tag + i} className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
            {tag}
            <button onClick={() => removeAt(i)} aria-label={`Remove ${tag}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Backspace' && !draft && value.length) {
              removeAt(value.length - 1);
            }
          }}
          onBlur={commit}
          placeholder={placeholder}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </div>
    </div>
  );
}

export default TagInput;
