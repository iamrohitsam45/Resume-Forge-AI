import { motion } from 'framer-motion';
import { Gauge, Sparkles, LayoutTemplate, Eye, Code2, FileSearch, Tags, Download } from 'lucide-react';
import Card from '../ui/Card.jsx';

const FEATURES = [
  { icon: Gauge, title: '90+ ATS Optimization', desc: 'A transparent, explainable scoring engine analyzes formatting, keywords, and structure.' },
  { icon: Sparkles, title: 'AI Resume Writing', desc: 'Claude-powered generation for summaries, experience bullets, and project descriptions.' },
  { icon: LayoutTemplate, title: 'Professional Templates', desc: '10 ATS-friendly templates tailored to specific roles and career stages.' },
  { icon: Eye, title: 'Live Resume Preview', desc: 'See every edit reflected instantly in a pixel-accurate A4/Letter preview.' },
  { icon: Code2, title: 'LaTeX Editor', desc: 'A Monaco-powered code editor for full control over your resume source.' },
  { icon: FileSearch, title: 'Job Description Matching', desc: 'Paste a job posting and get an instant match score with a keyword gap analysis.' },
  { icon: Tags, title: 'Keyword Optimization', desc: 'Identify missing keywords and weave them in without fabricating experience.' },
  { icon: Download, title: 'PDF Export', desc: 'Download a crisp, text-selectable PDF that mirrors your live preview exactly.' },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Why ResumeForge AI?</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Everything you need to go from raw experience to an interview-ready, ATS-optimized resume.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
          >
            <Card hover className="h-full">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 text-brand-600 dark:text-brand-400">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FeatureGrid;
