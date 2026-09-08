import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { CircularScore } from '../ui/Progress.jsx';
import Progress from '../ui/Progress.jsx';

export function ATSScore({ analysis, compact = false }) {
  if (!analysis) {
    return <p className="text-sm text-slate-400">Run an ATS analysis to see your optimization score.</p>;
  }

  const entries = Object.values(analysis.breakdown || {});

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <CircularScore score={analysis.score} label={analysis.rating} size={compact ? 80 : 110} />
        <div className="flex-1 space-y-2">
          {entries.map((e) => (
            <div key={e.label}>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{e.label}</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{e.score}/{e.max}</span>
              </div>
              <Progress value={e.score} max={e.max} className="mt-0.5 h-1.5" />
            </div>
          ))}
        </div>
      </div>
      {!compact && analysis.recommendations?.length > 0 && (
        <div className="space-y-1.5">
          {analysis.recommendations.slice(0, 8).map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              {r.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              ) : (
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              )}
              <span className="text-slate-600 dark:text-slate-300">{r.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ATSScore;
