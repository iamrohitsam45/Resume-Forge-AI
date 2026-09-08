import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="h-14 w-14 text-brand-400" />
      <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/">
        <Button className="mt-6">Back to Home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
