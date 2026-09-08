import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../../constants/nav.js';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              {APP_NAME}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">{APP_TAGLINE}</p>
          </div>
          <FooterCol title="Product" links={[{ label: 'Features', to: '/features' }, { label: 'Templates', to: '/templates' }, { label: 'Pricing', to: '/pricing' }]} />
          <FooterCol title="Account" links={[{ label: 'Log in', to: '/login' }, { label: 'Register', to: '/register' }, { label: 'Dashboard', to: '/dashboard' }]} />
          <FooterCol title="Company" links={[{ label: 'Settings', to: '/settings' }]} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-800 sm:flex-row">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>ATS Optimization Scores are estimates, not a guarantee of real-world ATS results.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
