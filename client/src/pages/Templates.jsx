import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { TEMPLATE_LIST } from '../templates/templateStyles.js';
import ResumeDocument from '../templates/ResumeDocument.jsx';
import { DEMO_RESUME } from '../constants/demoResume.js';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

export function Templates() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  function useTemplate(templateKey) {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    navigate(`/resume/new?template=${templateKey}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">ATS-friendly resume templates</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Every template shares the same clean, single-column, parseable structure - no graphics, columns, or text
          embedded in images that could confuse an ATS.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_LIST.map((t, i) => (
          <motion.div
            key={t.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: (i % 3) * 0.08 }}
            className="group card-surface overflow-hidden"
          >
            <div className="relative aspect-[210/297] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <div style={{ width: '357%', transform: 'scale(0.28)', transformOrigin: 'top left' }}>
                <ResumeDocument resume={{ ...DEMO_RESUME, template: t.key }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <Button
                size="sm"
                icon={ArrowRight}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex-row-reverse opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => useTemplate(t.key)}
              >
                Use Template
              </Button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                <Badge variant="success" icon={ShieldCheck}>ATS Friendly</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.bestFor}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">ATS Compatibility</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t.atsScore}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Templates;
