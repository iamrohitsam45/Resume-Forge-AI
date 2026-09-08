import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MarketingLayout from './layouts/MarketingLayout.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Toaster from './components/ui/Toaster.jsx';
import CommandPalette from './components/ui/CommandPalette.jsx';
import { useAuthStore } from './store/useAuthStore.js';

import Home from './pages/Home.jsx';
import Features from './pages/Features.jsx';
import Templates from './pages/Templates.jsx';
import Pricing from './pages/Pricing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const ResumeNew = lazy(() => import('./pages/ResumeNew.jsx'));
const ResumeEdit = lazy(() => import('./pages/ResumeEdit.jsx'));
const ResumePreviewPage = lazy(() => import('./pages/ResumePreviewPage.jsx'));
const ResumeDownload = lazy(() => import('./pages/ResumeDownload.jsx'));
const ResumeATS = lazy(() => import('./pages/ResumeATS.jsx'));
const LatexEditorPage = lazy(() => import('./pages/LatexEditorPage.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));

function PageLoader() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
    </div>
  );
}

export function App() {
  const refreshMe = useAuthStore((s) => s.refreshMe);

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/pricing" element={<Pricing />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/resume/new" element={<ResumeNew />} />
            <Route path="/resume/:id/edit" element={<ResumeEdit />} />
            <Route path="/resume/:id/preview" element={<ResumePreviewPage />} />
            <Route path="/resume/:id/download" element={<ResumeDownload />} />
            <Route path="/resume/:id/ats" element={<ResumeATS />} />
            <Route path="/resume/:id/latex" element={<LatexEditorPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
      <CommandPalette />
    </>
  );
}

export default App;
