import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, Settings, Command } from 'lucide-react';
import { MARKETING_NAV, APP_NAME } from '../../constants/nav.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import ThemeToggle from './ThemeToggle.jsx';
import Button from '../ui/Button.jsx';
import Dropdown from '../ui/Dropdown.jsx';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {MARKETING_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => toggleCommandPalette(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-300 dark:border-slate-700"
          >
            <Command className="h-3 w-3" /> K
          </button>
          <ThemeToggle />
          {isAuthenticated ? (
            <Dropdown
              align="right"
              trigger={
                <button className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm font-medium text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-200">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  {user?.name?.split(' ')[0] || 'Account'}
                </button>
              }
              items={[
                { label: 'Dashboard', icon: LayoutDashboard, onClick: () => navigate('/dashboard') },
                { label: 'Settings', icon: Settings, onClick: () => navigate('/settings') },
                { divider: true },
                {
                  label: 'Log out',
                  icon: LogOut,
                  danger: true,
                  onClick: () => {
                    logout();
                    navigate('/');
                  },
                },
              ]}
            />
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Create My Resume
              </Button>
            </>
          )}
        </div>

        <button className="p-2 text-slate-600 dark:text-slate-300 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              {MARKETING_NAV.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.label}
                </NavLink>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <ThemeToggle />
              </div>
              {isAuthenticated ? (
                <Button onClick={() => { setOpen(false); navigate('/dashboard'); }}>Go to Dashboard</Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={() => { setOpen(false); navigate('/login'); }}>Log in</Button>
                  <Button onClick={() => { setOpen(false); navigate('/register'); }}>Create My Resume</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
