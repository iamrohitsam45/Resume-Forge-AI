import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Everything you need to build and export your first ATS-ready resume.',
    features: ['1 active resume', 'All 10 ATS-friendly templates', 'ATS Optimization Score', 'PDF & LaTeX export', 'Live preview & autosave'],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/ month',
    desc: 'For active job seekers tailoring resumes to multiple roles.',
    features: ['Unlimited resumes & duplicates', 'Full AI writing assistant', 'Job description matching', 'Keyword optimization', 'Version history', 'Priority AI response times'],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Teams',
    price: 'Custom',
    period: '',
    desc: 'For bootcamps, universities, and career coaching teams.',
    features: ['Everything in Pro', 'Shared template library', 'Usage analytics', 'Dedicated support'],
    cta: 'Contact Sales',
  },
];

export function Pricing() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Start free. Upgrade when you need unlimited resumes and the full AI toolkit.</p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Card
              className={`relative flex h-full flex-col ${plan.highlighted ? 'border-brand-400 ring-2 ring-brand-400/60 dark:border-brand-500' : ''}`}
            >
              {plan.highlighted && (
                <Badge variant="brand" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-sm text-slate-400">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full" variant={plan.highlighted ? 'primary' : 'outline'} onClick={() => navigate('/register')}>
                {plan.cta}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
