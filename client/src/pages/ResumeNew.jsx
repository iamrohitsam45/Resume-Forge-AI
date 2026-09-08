import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import resumeService from '../services/resumeService.js';
import { apiErrorMessage } from '../services/api.js';
import { useUIStore } from '../store/useUIStore.js';

export function ResumeNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const toast = useUIStore((s) => s.toast);
  const created = useRef(false);

  useEffect(() => {
    if (created.current) return;
    created.current = true;
    const template = searchParams.get('template') || 'modern-professional';
    resumeService
      .create({ title: 'Untitled Resume', template })
      .then((resume) => navigate(`/resume/${resume._id}/edit`, { replace: true }))
      .catch((err) => {
        setError(apiErrorMessage(err));
        toast({ title: 'Could not create resume', description: apiErrorMessage(err), variant: 'error' });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-3 text-slate-500">
      {!error ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          <p>Creating your resume...</p>
        </>
      ) : (
        <p className="text-red-500">{error}</p>
      )}
    </div>
  );
}

export default ResumeNew;
