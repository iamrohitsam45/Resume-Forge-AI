import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  settings: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      defaultTemplate: z.string().optional(),
      defaultPageSize: z.enum(['A4', 'Letter']).optional(),
      aiTone: z.enum(['professional', 'concise', 'impactful']).optional(),
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(128),
});
