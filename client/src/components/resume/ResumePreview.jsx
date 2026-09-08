import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, AlertTriangle } from 'lucide-react';
import ResumeDocument from '../../templates/ResumeDocument.jsx';
import cn from '../../utils/cn.js';

const PAGE_ASPECT = { A4: 1 / 1.4142, Letter: 8.5 / 11 };

export function ResumePreview({ resume, className, printId = 'print-root' }) {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;
      const width = container.clientWidth;
      const pageHeight = width / PAGE_ASPECT[resume.pageSize === 'Letter' ? 'Letter' : 'A4'];
      const contentHeight = content.scrollHeight;
      setPageCount(Math.max(1, Math.ceil(contentHeight / pageHeight)));
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [resume]);

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="no-print flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Page {pageCount > 1 ? '1' : '1'} of {pageCount}</span>
          {pageCount > 1 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <AlertTriangle className="h-3 w-3" /> Exceeds one page
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setFullscreen((f) => !f)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle fullscreen">
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'flex-1 overflow-auto bg-slate-100 p-6 dark:bg-slate-900',
          fullscreen && 'fixed inset-0 z-[80] bg-slate-900/95 p-10'
        )}
        ref={containerRef}
      >
        <div className="mx-auto" style={{ maxWidth: 800 * zoom }}>
          <div id={printId} className={cn('resume-page mx-auto overflow-hidden', resume.pageSize === 'Letter' && 'letter')} style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
            <div ref={contentRef}>
              <ResumeDocument resume={resume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;
