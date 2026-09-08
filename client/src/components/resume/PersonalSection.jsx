import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Input from '../ui/Input.jsx';
import authService from '../../services/authService.js';
import { useUIStore } from '../../store/useUIStore.js';
import { apiErrorMessage } from '../../services/api.js';

const PRIMARY_FIELDS = [
  { key: 'fullName', label: 'Full Name', placeholder: 'Jordan Avery' },
  { key: 'title', label: 'Professional Title', placeholder: 'Software Engineer' },
  { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
  { key: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567' },
  { key: 'location', label: 'Location', placeholder: 'Austin, TX' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/you' },
  { key: 'github', label: 'GitHub', placeholder: 'github.com/you' },
  { key: 'portfolio', label: 'Portfolio', placeholder: 'yourdomain.dev' },
];

const OPTIONAL_FIELDS = [
  { key: 'twitter', label: 'Twitter / X', placeholder: 'x.com/you' },
  { key: 'leetcode', label: 'LeetCode', placeholder: 'leetcode.com/you' },
  { key: 'stackoverflow', label: 'Stack Overflow', placeholder: 'stackoverflow.com/users/you' },
  { key: 'medium', label: 'Medium', placeholder: 'medium.com/@you' },
  { key: 'behance', label: 'Behance', placeholder: 'behance.net/you' },
  { key: 'dribbble', label: 'Dribbble', placeholder: 'dribbble.com/you' },
];

export function PersonalSection({ personal, onChange }) {
  const [showOptional, setShowOptional] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useUIStore((s) => s.toast);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { profileImage } = await authService.uploadProfileImage(file);
      onChange('profileImage', profileImage);
      toast({ title: 'Profile image uploaded', variant: 'success' });
    } catch (err) {
      toast({ title: 'Upload failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
        >
          {personal.profileImage ? (
            <img src={personal.profileImage} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            </span>
          )}
        </button>
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Profile Photo</p>
          <p className="text-xs text-slate-400">JPG, PNG or WEBP. Max 5MB. Optional.</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleFile} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRIMARY_FIELDS.map((f) => (
          <Input
            key={f.key}
            label={f.label}
            type={f.type || 'text'}
            placeholder={f.placeholder}
            value={personal[f.key] || ''}
            onChange={(e) => onChange(f.key, e.target.value)}
          />
        ))}
      </div>

      <button type="button" onClick={() => setShowOptional((s) => !s)} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
        {showOptional ? 'Hide' : 'Show'} additional profiles (Twitter/X, LeetCode, Stack Overflow...)
      </button>
      {showOptional && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OPTIONAL_FIELDS.map((f) => (
            <Input
              key={f.key}
              label={f.label}
              placeholder={f.placeholder}
              value={personal[f.key] || ''}
              onChange={(e) => onChange(f.key, e.target.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalSection;
