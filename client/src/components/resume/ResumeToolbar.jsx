import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, LayoutTemplate, Eye, Download, Gauge, Code2 } from 'lucide-react';
import Button from '../ui/Button.jsx';
import cn from '../../utils/cn.js';

const STATUS_LABEL = {
  idle: '',
  saving: 'Saving...',
  saved: 'Saved',
  error: 'Save failed',
};

export function ResumeToolbar({ resumeId, title, onTitleChange, saveStatus, onOpenTemplates }) {
  const navigate = useNavigate();

  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Back to dashboard">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="min-w-0 max-w-[240px] truncate rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-slate-900 outline-none hover:border-slate-200 focus:border-brand-300 focus-ring dark:text-white dark:hover:border-slate-700 sm:max-w-xs"
        />
        <span className={cn('flex items-center gap-1 text-xs', saveStatus === 'error' ? 'text-red-500' : 'text-slate-400')}>
          {saveStatus === 'saving' && <Loader2 className="h-3 w-3 animate-spin" />}
          {saveStatus === 'saved' && <Check className="h-3 w-3 text-emerald-500" />}
          {STATUS_LABEL[saveStatus]}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" icon={LayoutTemplate} onClick={onOpenTemplates}>
          Template
        </Button>
        <Button size="sm" variant="outline" icon={Gauge} onClick={() => navigate(`/resume/${resumeId}/ats`)}>
          ATS
        </Button>
        <Button size="sm" variant="outline" icon={Code2} onClick={() => navigate(`/resume/${resumeId}/latex`)}>
          LaTeX
        </Button>
        <Button size="sm" variant="outline" icon={Eye} onClick={() => navigate(`/resume/${resumeId}/preview`)}>
          Preview
        </Button>
        <Button size="sm" icon={Download} onClick={() => navigate(`/resume/${resumeId}/download`)}>
          Download
        </Button>
      </div>
    </div>
  );
}

export default ResumeToolbar;
