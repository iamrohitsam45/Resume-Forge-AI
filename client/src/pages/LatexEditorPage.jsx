import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, RotateCcw, WandSparkles, Loader2, Info } from 'lucide-react';
import resumeService from '../services/resumeService.js';
import { apiErrorMessage } from '../services/api.js';
import { useUIStore } from '../store/useUIStore.js';
import LatexEditor from '../components/editor/LatexEditor.jsx';
import CompileButton from '../components/editor/CompileButton.jsx';
import ResumeDocument from '../templates/ResumeDocument.jsx';
import Button from '../components/ui/Button.jsx';

export function LatexEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useUIStore((s) => s.toast);

  const [resume, setResume] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    resumeService
      .get(id)
      .then(async (r) => {
        setResume(r);
        if (r.latexCode) {
          setCode(r.latexCode);
        } else {
          const blob = await resumeService.downloadExport(id, 'latex');
          setCode(await blob.text());
        }
      })
      .catch((err) => setError(apiErrorMessage(err)));
  }, [id]);

  async function save() {
    setSaving(true);
    try {
      await resumeService.update(id, { latexCode: code });
      toast({ title: 'LaTeX saved ✓', variant: 'success' });
    } catch (err) {
      toast({ title: 'Save failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    setResetting(true);
    try {
      const blob = await resumeService.downloadExport(id, 'latex');
      setCode(await blob.text());
      toast({ title: 'Regenerated from your resume data', variant: 'success' });
    } catch (err) {
      toast({ title: 'Reset failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setResetting(false);
    }
  }

  function format() {
    setCode((prev) => prev.split('\n').map((l) => l.replace(/\s+$/g, '')).join('\n'));
    toast({ title: 'Formatted', variant: 'success', duration: 1500 });
  }

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!resume) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/resume/${id}/edit`)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-sm font-semibold text-slate-900 dark:text-white">LaTeX Resume Editor</h1>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={WandSparkles} onClick={format}>Format</Button>
          <Button size="sm" variant="outline" icon={RotateCcw} loading={resetting} onClick={reset}>Reset</Button>
          <Button size="sm" icon={Save} loading={saving} onClick={save}>Save</Button>
          <CompileButton resumeId={id} />
        </div>
      </div>

      <div className="flex items-start gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This editor gives you full manual control over your resume's LaTeX source for export. The preview on the right
        mirrors your structured resume data (the same one used for PDF export) rather than compiling your raw edits live -
        there's no sandboxed LaTeX toolchain in this environment.
      </div>

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="h-full overflow-hidden border-r border-slate-200 dark:border-slate-800">
          <LatexEditor value={code} onChange={setCode} />
        </div>
        <div className="hidden overflow-y-auto bg-slate-100 p-6 dark:bg-slate-900 lg:block">
          <div className="resume-page mx-auto overflow-hidden">
            <ResumeDocument resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatexEditorPage;
