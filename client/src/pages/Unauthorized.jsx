import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

export function Unauthorized() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <ShieldAlert className="h-14 w-14 text-amber-400" />
      <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Access restricted</h1>
      <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
        You need to be logged in to view this page.
      </p>
      <Link to="/login">
        <Button className="mt-6">Log In</Button>
      </Link>
    </div>
  );
}

export default Unauthorized;
