import { Plus, Trash2, GripVertical } from 'lucide-react';

export function BulletListEditor({ label, value = [], onChange, placeholder = 'Describe an impact, action, or result...' }) {
  function updateAt(i, text) {
    const next = [...value];
    next[i] = text;
    onChange(next);
  }
  function removeAt(i) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...value, '']);
  }

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="space-y-2">
        {value.map((bullet, i) => (
          <div key={i} className="flex items-start gap-2">
            <GripVertical className="mt-2.5 h-3.5 w-3.5 shrink-0 text-slate-300" />
            <textarea
              rows={2}
              value={bullet}
              onChange={(e) => updateAt(i, e.target.value)}
              placeholder={placeholder}
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus-ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button onClick={() => removeAt(i)} className="mt-2 shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40" aria-label="Remove bullet">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
        <Plus className="h-3.5 w-3.5" /> Add bullet
      </button>
    </div>
  );
}

export default BulletListEditor;
