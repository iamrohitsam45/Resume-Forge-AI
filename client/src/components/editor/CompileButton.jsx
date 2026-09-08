import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';
import resumeService from '../../services/resumeService.js';
import { apiErrorMessage } from '../../services/api.js';
import { useUIStore } from '../../store/useUIStore.js';

/**
 * "Compile" here renders the structured resume data to PDF via the server
 * (Puppeteer). There is no sandboxed LaTeX toolchain in this environment, so
 * editing raw .tex source does not feed a live PDF compile - it's for manual
 * control and export of the LaTeX source itself. This keeps the preview honest
 * about what it actually reflects.
 */
export function CompileButton({ resumeId }) {
  const [loading, setLoading] = useState(false);
  const toast = useUIStore((s) => s.toast);

  async function compile() {
    setLoading(true);
    try {
      const blob = await resumeService.downloadExport(resumeId, 'pdf');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      toast({ title: 'PDF preview ready ✓', variant: 'success' });
    } catch (err) {
      toast({ title: 'Compile failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" icon={PlayCircle} loading={loading} onClick={compile}>
      Compile Preview
    </Button>
  );
}

export default CompileButton;
