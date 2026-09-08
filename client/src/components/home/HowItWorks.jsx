import { motion } from 'framer-motion';
import { UserPen, LayoutTemplate, Sparkles, Gauge, Download } from 'lucide-react';

const STEPS = [
  { icon: UserPen, title: 'Enter Your Details', desc: 'Add your experience, education, skills, and projects in a guided form.' },
  { icon: LayoutTemplate, title: 'Choose a Template', desc: 'Pick from 10 ATS-friendly templates tailored to your target role.' },
  { icon: Sparkles, title: 'Enhance With AI', desc: 'Let Claude sharpen your summary, bullets, and project descriptions.' },
  { icon: Gauge, title: 'Optimize ATS Score', desc: 'Match against a job description and close keyword gaps honestly.' },
  { icon: Download, title: 'Download & Apply', desc: 'Export a pixel-accurate PDF or LaTeX source and start applying.' },
];

export function HowItWorks() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Five steps from a blank page to a job-ready resume.</p>
        </div>
        <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 lg:block" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                <step.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="mt-1.5 max-w-[200px] text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
