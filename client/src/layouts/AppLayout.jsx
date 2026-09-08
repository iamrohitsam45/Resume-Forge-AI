import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
