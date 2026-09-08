import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Target, Gauge, Sparkles, Wand2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useUIStore } from '../store/useUIStore.js';
import resumeService from '../services/resumeService.js';
import { apiErrorMessage } from '../services/api.js';
import { DEMO_RESUME } from '../constants/demoResume.js';
import ResumeCard from '../components/resume/ResumeCard.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const toast = useUIStore((s) => s.toast);
  const [resumes, setResumes] = useState(null);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      const data = await resumeService.list();
      setResumes(data);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    if (!resumes) return null;
    const avgScore = resumes.length ? Math.round(resumes.reduce((a, r) => a + (r.atsScore || 0), 0) / resumes.length) : 0;
    return {
      resumes: resumes.length,
      applications: resumes.length, // proxy metric until an applications feature exists
      avgScore,
      aiImprovements: resumes.filter((r) => r.atsAnalysis).length,
    };
  }, [resumes]);

  async function handleDuplicate(resume) {
    try {
      const copy = await resumeService.duplicate(resume._id);
      setResumes((prev) => [copy, ...prev]);
      toast({ title: 'Resume duplicated', description: copy.title, variant: 'success' });
    } catch (err) {
      toast({ title: 'Duplicate failed', description: apiErrorMessage(err), variant: 'error' });
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await resumeService.remove(pendingDelete._id);
      setResumes((prev) => prev.filter((r) => r._id !== pendingDelete._id));
      toast({ title: 'Resume deleted', variant: 'success' });
    } catch (err) {
      toast({ title: 'Delete failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  async function loadDemoResume() {
    try {
      const created = await resumeService.create({ title: DEMO_RESUME.title, template: DEMO_RESUME.template });
      const updated = await resumeService.update(created._id, DEMO_RESUME);
      setResumes((prev) => [updated, ...(prev || [])]);
      toast({ title: 'Demo resume loaded', variant: 'success' });
      navigate(`/resume/${updated._id}/edit`);
    } catch (err) {
      toast({ title: 'Could not load demo resume', description: apiErrorMessage(err), variant: 'error' });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Build your next opportunity.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Wand2} onClick={loadDemoResume}>
            Load Demo Resume
          </Button>
          <Button icon={Plus} onClick={() => navigate('/resume/new')}>
            Create New Resume
          </Button>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileText} label="Resumes" value={stats?.resumes} loading={!stats} />
        <StatCard icon={Target} label="Applications" value={stats?.applications} loading={!stats} />
        <StatCard icon={Gauge} label="Average ATS Score" value={stats?.avgScore} suffix={stats ? '/100' : ''} loading={!stats} />
        <StatCard icon={Sparkles} label="AI Improvements" value={stats?.aiImprovements} loading={!stats} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Your Resumes</h2>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!resumes && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        )}
        {resumes && resumes.length === 0 && (
          <Card className="flex flex-col items-center py-16 text-center">
            <FileText className="h-10 w-10 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">No resumes yet</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Create your first resume from scratch, or load a demo resume to explore the builder.
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" onClick={loadDemoResume}>Load Demo Resume</Button>
              <Button icon={Plus} onClick={() => navigate('/resume/new')}>Create New Resume</Button>
            </div>
          </Card>
        )}
        {resumes && resumes.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {resumes.map((r) => (
                <ResumeCard key={r._id} resume={r} onDuplicate={handleDuplicate} onDelete={setPendingDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this resume?"
        description={pendingDelete ? `"${pendingDelete.title}" will be permanently deleted. This cannot be undone.` : ''}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, suffix = '', loading }) {
  return (
    <Card className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        {loading ? <Skeleton className="mt-1 h-5 w-10" /> : <p className="text-lg font-bold text-slate-900 dark:text-white">{value}{suffix}</p>}
      </div>
    </Card>
  );
}

export default Dashboard;
