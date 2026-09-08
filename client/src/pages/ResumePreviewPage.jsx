import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Download, Loader2 } from 'lucide-react';
import resumeService from '../services/resumeService.js';
import { apiErrorMessage } from '../services/api.js';
import ResumePreview from '../components/resume/ResumePreview.jsx';
import Button from '../components/ui/Button.jsx';

export function ResumePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    resumeService.get(id).then(setResume).catch((err) => setError(apiErrorMessage(err)));
  }, [id]);

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
      <div className="no-print flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={Pencil} onClick={() => navigate(`/resume/${id}/edit`)}>
            Edit
          </Button>
          <Button size="sm" icon={Download} onClick={() => navigate(`/resume/${id}/download`)}>
            Download
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}

export default ResumePreviewPage;
