import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { registerSchema } from '../utils/validators.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useUIStore } from '../store/useUIStore.js';
import { apiErrorMessage } from '../services/api.js';
import { APP_NAME } from '../constants/nav.js';

export function Register() {
  const navigate = useNavigate();
  const register_ = useAuthStore((s) => s.register);
  const toast = useUIStore((s) => s.toast);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values) {
    setServerError('');
    try {
      await register_(values);
      toast({ title: 'Welcome to ResumeForge AI 🎉', variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      setServerError(apiErrorMessage(err, 'Registration failed'));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4 dark:from-slate-950 dark:to-slate-900">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl">{APP_NAME}</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Build your first ATS-optimized resume in minutes.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card-surface space-y-4 p-6">
          {serverError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{serverError}</p>}
          <Input label="Full Name" icon={User} placeholder="Jordan Avery" error={errors.name?.message} {...register('name')} />
          <Input label="Email" icon={Mail} type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Input label="Password" icon={Lock} type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} />
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create My Resume
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
