import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Printer, FileCode2, FileType2, Share2, Loader2 } from 'lucide-react';
import resumeService from '../services/resumeService.js';
import { apiErrorMessage } from '../services/api.js';
import { useUIStore } from '../store/useUIStore.js';
import ResumePreview from '../components/resume/ResumePreview.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Tooltip from '../components/ui/Tooltip.jsx';
import { CircularScore } from '../components/ui/Progress.jsx';

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function ResumeDownload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useUIStore((s) => s.toast);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    resumeService.get(id).then(setResume).catch((err) => setError(apiErrorMessage(err)));
  }, [id]);

  async function download(format) {
    setBusy(format);
    try {
      const blob = await resumeService.downloadExport(id, format);
      const ext = format === 'latex' ? 'tex' : 'pdf';
      triggerBlobDownload(blob, `${(resume.title || 'resume').replace(/\s+/g, '-').toLowerCase()}.${ext}`);
      toast({ title: `${format === 'latex' ? 'LaTeX' : 'PDF'} ready ✓`, variant: 'success' });
    } catch (err) {
      toast({ title: 'Export failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setBusy('');
    }
  }

  async function share() {
    const url = `${window.location.origin}/resume/${id}/preview`;
    if (navigator.share) {
      try {
        await navigator.share({ title: resume.title, url });
        return;
      } catch {
        /* user cancelled - fall through to clipboard */
      }
    }
    await navigator.clipboard?.writeText(url);
    toast({ title: 'Link copied', description: 'Note: viewers must be logged into your account to open it.', variant: 'success' });
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="no-print mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="no-print overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <ResumePreview resume={resume} printId="print-root-onscreen" />
        </div>

        <div className="no-print space-y-5">
          <Card className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resume Ready</p>
            <div className="mt-3 flex justify-center">
              <CircularScore score={resume.atsScore || 0} label={resume.atsAnalysis?.rating || 'Not analyzed'} />
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{resume.title}</p>
          </Card>

          <Card className="space-y-2.5">
            <Button className="w-full" icon={Download} loading={busy === 'pdf'} onClick={() => download('pdf')}>
              Download PDF
            </Button>
            <Button className="w-full" variant="outline" icon={Printer} onClick={() => window.print()}>
              Print Resume
            </Button>
            <Button className="w-full" variant="outline" icon={FileCode2} loading={busy === 'latex'} onClick={() => download('latex')}>
              Download LaTeX
            </Button>
            <Tooltip label="DOCX export is coming soon" side="top">
              <Button className="w-full" variant="outline" icon={FileType2} disabled>
                Download DOCX
              </Button>
            </Tooltip>
            <Button className="w-full" variant="ghost" icon={Share2} onClick={share}>
              Share Resume
            </Button>
          </Card>
        </div>
      </div>

      {/* Print-only surface: everything else is hidden via @media print rules in index.css */}
      <div className="hidden print:block">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}

export default ResumeDownload;
