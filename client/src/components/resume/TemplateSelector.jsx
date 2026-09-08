import Modal from '../ui/Modal.jsx';
import Badge from '../ui/Badge.jsx';
import { TEMPLATE_LIST } from '../../templates/templateStyles.js';
import ResumeDocument from '../../templates/ResumeDocument.jsx';
import { ShieldCheck } from 'lucide-react';
import cn from '../../utils/cn.js';

export function TemplateSelector({ open, onClose, resume, onSelect }) {
  return (
    <Modal open={open} onClose={onClose} title="Choose a Template" className="max-w-4xl">
      <div className="grid max-h-[65vh] grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3">
        {TEMPLATE_LIST.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              onSelect(t.key);
              onClose();
            }}
            className={cn(
              'group overflow-hidden rounded-xl border-2 text-left transition-colors',
              resume.template === t.key ? 'border-brand-500' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
            )}
          >
            <div className="relative aspect-[210/297] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <div style={{ width: '357%', transform: 'scale(0.28)', transformOrigin: 'top left' }}>
                <ResumeDocument resume={{ ...resume, template: t.key }} />
              </div>
            </div>
            <div className="p-2.5">
              <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{t.name}</p>
              <div className="mt-1 flex items-center justify-between">
                <Badge variant="success" icon={ShieldCheck} className="text-[10px]">ATS {t.atsScore}%</Badge>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default TemplateSelector;
