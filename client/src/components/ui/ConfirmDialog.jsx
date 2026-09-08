import { AlertTriangle } from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description, confirmLabel = 'Delete', loading }) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        <div className="mt-6 flex w-full gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
