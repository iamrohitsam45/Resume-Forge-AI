import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gauge, Sparkles, FileSearch, LayoutTemplate } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { CircularScore } from '../ui/Progress.jsx';

const Scene3D = lazy(() => import('./Scene3D.jsx'));

const SCORE_BARS = [
  { label: 'Keywords', value: 96 },
  { label: 'Formatting', value: 94 },
  { label: 'Experience', value: 91 },
  { label: 'Skills', value: 95 },
];

const KEYWORD_CHIPS = ['React', 'Node.js', 'REST APIs', 'MongoDB', 'AWS', 'TypeScript'];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 pt-16 dark:from-slate-950 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-slate [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <Suspense fallback={null}>
        <Scene3D className="pointer-events-none absolute inset-0 -z-0 opacity-70" />
      </Suspense>
      <div
        aria-hidden
        className="absolute -left-24 top-10 h-72 w-72 animate-blob rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-700/20"
      />
      <div
        aria-hidden
        className="absolute -right-16 top-40 h-72 w-72 animate-blob rounded-full bg-accent-500/20 blur-3xl [animation-delay:4s]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Resume Builder
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.4rem]">
            Build an <span className="gradient-text">ATS-Optimized</span> Resume That Gets Noticed.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Create professional resumes, optimize them for ATS systems, and use AI to transform your experience into
            compelling, job-ready content.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" icon={ArrowRight} className="flex-row-reverse" onClick={() => navigate('/register')}>
              Create My Resume
            </Button>
            <Button size="lg" variant="outline" icon={FileSearch} onClick={() => navigate('/register')}>
              Analyze My Resume
            </Button>
            <Button size="lg" variant="ghost" icon={LayoutTemplate} onClick={() => navigate('/templates')}>
              Explore Templates
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Stat value="10+" label="ATS-friendly templates" />
            <Stat value="90+" label="Avg. optimization score" />
            <Stat value="8" label="AI writing tools" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="glass relative rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">ATS Optimization Score</p>
              <Gauge className="h-4 w-4 text-brand-500" />
            </div>
            <div className="mt-4 flex items-center gap-6">
              <CircularScore score={92} label="Excellent" size={110} />
              <div className="flex-1 space-y-2.5">
                {SCORE_BARS.map((bar, i) => (
                  <div key={bar.label}>
                    <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{bar.label}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{bar.value}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-700/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.value}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {KEYWORD_CHIPS.map((chip, i) => (
                <motion.span
                  key={chip}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  ✓ {chip}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="glass absolute -left-10 -top-8 hidden w-48 rounded-2xl p-3 shadow-xl sm:block animate-float"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <Sparkles className="h-3.5 w-3.5" /> AI Suggestion
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              "Developed and shipped 12+ features for a React/Node.js platform serving 250K+ users."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="glass absolute -top-10 -right-8 hidden w-40 rounded-2xl p-3 shadow-xl sm:block animate-float [animation-delay:1.5s]"
          >
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Software Engineer Resume</p>
            <p className="mt-1 text-[10px] text-slate-400">Updated just now</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-emerald-100 dark:bg-emerald-950">
              <div className="h-full w-[92%] rounded-full bg-emerald-500" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}

export default Hero;
