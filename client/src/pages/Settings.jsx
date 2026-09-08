import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Palette, LayoutTemplate, FileType2, Sparkles, ShieldCheck, KeyRound, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useUIStore } from '../store/useUIStore.js';
import authService from '../services/authService.js';
import { apiErrorMessage } from '../services/api.js';
import { TEMPLATE_LIST } from '../templates/templateStyles.js';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import ThemeToggle from '../components/layout/ThemeToggle.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import cn from '../utils/cn.js';

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'defaults', label: 'Defaults', icon: LayoutTemplate },
  { key: 'ai', label: 'AI Preferences', icon: Sparkles },
  { key: 'privacy', label: 'Privacy', icon: ShieldCheck },
  { key: 'account', label: 'Account', icon: KeyRound },
];

export function Settings() {
  const [tab, setTab] = useState('profile');
  const { user, updateUser, logout } = useAuthStore();
  const toast = useUIStore((s) => s.toast);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [settings, setSettings] = useState(user?.settings || {});
  const [savingSettings, setSavingSettings] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const { user: updated } = await authService.updateProfile({ name });
      updateUser(updated);
      toast({ title: 'Profile updated ✓', variant: 'success' });
    } catch (err) {
      toast({ title: 'Update failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveSettings(next) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    setSavingSettings(true);
    try {
      const { user: updated } = await authService.updateProfile({ settings: merged });
      updateUser(updated);
      toast({ title: 'Preferences saved ✓', variant: 'success', duration: 1500 });
    } catch (err) {
      toast({ title: 'Update failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setSavingSettings(false);
    }
  }

  async function changePassword() {
    setSavingPassword(true);
    try {
      await authService.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      toast({ title: 'Password updated ✓', variant: 'success' });
    } catch (err) {
      toast({ title: 'Password update failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setSavingPassword(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      await authService.deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      toast({ title: 'Delete failed', description: apiErrorMessage(err), variant: 'error' });
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                tab === t.key ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'profile' && (
            <Card className="space-y-4">
              <h2 className="font-semibold text-slate-900 dark:text-white">Profile</h2>
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" value={user?.email || ''} disabled hint="Email cannot be changed." />
              <Button loading={savingProfile} onClick={saveProfile}>Save Changes</Button>
            </Card>
          )}

          {tab === 'appearance' && (
            <Card className="space-y-4">
              <h2 className="font-semibold text-slate-900 dark:text-white">Appearance</h2>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">Theme</p>
                <ThemeToggle />
              </div>
            </Card>
          )}

          {tab === 'defaults' && (
            <Card className="space-y-4">
              <h2 className="font-semibold text-slate-900 dark:text-white">Resume Defaults</h2>
              <Select
                label="Default Template"
                value={settings.defaultTemplate || 'modern-professional'}
                onChange={(e) => saveSettings({ defaultTemplate: e.target.value })}
                options={TEMPLATE_LIST.map((t) => ({ value: t.key, label: t.name }))}
              />
              <Select
                label="Default Page Size"
                value={settings.defaultPageSize || 'A4'}
                onChange={(e) => saveSettings({ defaultPageSize: e.target.value })}
                options={[{ value: 'A4', label: 'A4' }, { value: 'Letter', label: 'Letter' }]}
              />
              {savingSettings && <p className="text-xs text-slate-400">Saving...</p>}
            </Card>
          )}

          {tab === 'ai' && (
            <Card className="space-y-4">
              <h2 className="font-semibold text-slate-900 dark:text-white">AI Preferences</h2>
              <Select
                label="Preferred Writing Tone"
                value={settings.aiTone || 'professional'}
                onChange={(e) => saveSettings({ aiTone: e.target.value })}
                options={[
                  { value: 'professional', label: 'Professional' },
                  { value: 'concise', label: 'Concise' },
                  { value: 'impactful', label: 'Impactful' },
                ]}
              />
              <p className="flex items-start gap-2 text-xs text-slate-400">
                <FileType2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Claude never fabricates metrics, employers, or experience - AI suggestions are always grounded in what
                you've written.
              </p>
            </Card>
          )}

          {tab === 'privacy' && (
            <Card className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <h2 className="font-semibold text-slate-900 dark:text-white">Privacy</h2>
              <p>Your resume data is stored securely in our database and is only ever accessible to your account.</p>
              <p>All AI processing happens through our backend - your Anthropic API key is never exposed to the browser.</p>
              <p>You can delete individual resumes at any time from your Dashboard.</p>
              <p>You can permanently delete your account and all associated resumes from the Account tab.</p>
            </Card>
          )}

          {tab === 'account' && (
            <div className="space-y-6">
              <Card className="space-y-4">
                <h2 className="font-semibold text-slate-900 dark:text-white">Change Password</h2>
                <Input
                  label="Current Password"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                />
                <Input
                  label="New Password"
                  type="password"
                  hint="At least 8 characters"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                />
                <Button loading={savingPassword} onClick={changePassword}>Update Password</Button>
              </Card>

              <Card className="space-y-3 border-red-200 dark:border-red-900">
                <h2 className="font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Permanently delete your account and all resumes. This action cannot be undone.
                </p>
                <Button variant="danger" icon={Trash2} onClick={() => setConfirmDelete(true)}>Delete Account</Button>
              </Card>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteAccount}
        loading={deleting}
        title="Delete your account?"
        description="This permanently deletes your account and every resume you've created. This cannot be undone."
      />
    </div>
  );
}

export default Settings;
