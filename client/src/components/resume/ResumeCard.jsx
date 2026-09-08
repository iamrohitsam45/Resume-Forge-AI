import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Pencil, Eye, Copy, Download, Gauge, Trash2 } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Dropdown from '../ui/Dropdown.jsx';
import { formatRelative } from '../../utils/date.js';

export function ResumeCard({ resume, onDuplicate, onDelete }) {
  const navigate = useNavigate();
  const scoreVariant = resume.atsScore >= 90 ? 'success' : resume.atsScore >= 70 ? 'brand' : 'warning';

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
      <Card hover className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{resume.title}</h3>
            <p className="mt-0.5 text-xs text-slate-400">Updated {formatRelative(resume.updatedAt)}</p>
          </div>
          <Dropdown
            trigger={
              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreVertical className="h-4 w-4" />
              </button>
            }
            items={[
              { label: 'Edit', icon: Pencil, onClick: () => navigate(`/resume/${resume._id}/edit`) },
              { label: 'Preview', icon: Eye, onClick: () => navigate(`/resume/${resume._id}/preview`) },
              { label: 'Duplicate', icon: Copy, onClick: () => onDuplicate?.(resume) },
              { label: 'ATS Analysis', icon: Gauge, onClick: () => navigate(`/resume/${resume._id}/ats`) },
              { label: 'Download', icon: Download, onClick: () => navigate(`/resume/${resume._id}/download`) },
              { divider: true },
              { label: 'Delete', icon: Trash2, danger: true, onClick: () => onDelete?.(resume) },
            ]}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Badge variant={scoreVariant} icon={Gauge}>ATS Score: {resume.atsScore || 0}</Badge>
          <Badge>{resume.template?.replace(/-/g, ' ') || 'Modern'}</Badge>
        </div>

        <div className="mt-5 flex flex-1 items-end gap-2">
          <button
            onClick={() => navigate(`/resume/${resume._id}/edit`)}
            className="flex-1 rounded-xl bg-slate-900 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Edit
          </button>
          <button
            onClick={() => navigate(`/resume/${resume._id}/preview`)}
            className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Preview
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

export default ResumeCard;
