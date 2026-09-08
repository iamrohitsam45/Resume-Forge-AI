import { motion } from 'framer-motion';
import {
  Sparkles, Gauge, FileSearch, Code2, LayoutTemplate, Tags, Eye, ShieldCheck, Keyboard, History,
} from 'lucide-react';
import Card from '../components/ui/Card.jsx';

const DETAILED_FEATURES = [
  { icon: Sparkles, title: 'AI Writing Assistant', desc: 'Generate, improve, shorten, or make more ATS-friendly - for summaries, experience bullets, project descriptions, and achievements. Powered by Claude, never fabricating metrics or experience you didn’t provide.' },
  { icon: Gauge, title: 'Explainable ATS Scoring', desc: 'A transparent scoring engine breaks your score into Formatting, Keywords, Experience, Skills, Projects, and Structure - with concrete recommendations for each.' },
  { icon: FileSearch, title: 'Job Description Analyzer', desc: 'Paste any job posting to extract required skills, keywords, and responsibilities, then see exactly how your resume matches up.' },
  { icon: Tags, title: 'Keyword Optimization', desc: 'Identify missing keywords relevant to your target role and get honest suggestions for weaving them in.' },
  { icon: LayoutTemplate, title: '10 ATS-Friendly Templates', desc: 'Role-specific templates for engineers, PMs, data scientists, and new grads - all built on the same parsable, single-column structure.' },
  { icon: Eye, title: 'Live Split-Screen Preview', desc: 'Edit on the left, see a pixel-accurate preview on the right, with zoom, page count, and section visibility controls.' },
  { icon: Code2, title: 'LaTeX Editor', desc: 'A Monaco-powered editor with syntax highlighting for full manual control over your resume’s LaTeX source.' },
  { icon: History, title: 'Autosave & Version History', desc: 'Every change is autosaved. Snapshot versions and restore any of them at any time.' },
  { icon: Keyboard, title: 'Command Palette & Shortcuts', desc: 'Cmd/Ctrl+K opens a command palette; Cmd/Ctrl+S saves, Cmd/Ctrl+P prints - built for speed.' },
  { icon: ShieldCheck, title: 'Secure By Design', desc: 'JWT auth, bcrypt password hashing, rate limiting, and a backend-only AI layer that never exposes API keys to the browser.' },
];

export function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Everything you need to get hired</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          A complete resume workflow - from structured data entry to AI writing, ATS analysis, and export.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {DETAILED_FEATURES.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08 }}>
            <Card className="flex h-full gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 text-brand-600 dark:text-brand-400">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Features;
