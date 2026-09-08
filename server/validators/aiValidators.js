import { z } from 'zod';

export const summarySchema = z.object({
  title: z.string().trim().max(200).default(''),
  yearsOfExperience: z.string().trim().max(50).default(''),
  industry: z.string().trim().max(200).default(''),
  primarySkills: z.array(z.string()).default([]),
  careerGoal: z.string().trim().max(500).default(''),
  action: z.enum(['generate', 'improve', 'shorten', 'more_professional', 'more_ats', 'add_keywords']).default('generate'),
  currentText: z.string().trim().max(2000).default(''),
});

export const experienceSchema = z.object({
  company: z.string().trim().max(200).default(''),
  role: z.string().trim().max(200).default(''),
  rawInput: z.string().trim().max(3000).default(''),
  technologies: z.array(z.string()).default([]),
  action: z.enum(['generate', 'improve', 'add_metrics', 'ats_friendly']).default('generate'),
});

export const projectSchema = z.object({
  name: z.string().trim().max(200).default(''),
  rawInput: z.string().trim().max(3000).default(''),
  technologies: z.array(z.string()).default([]),
  action: z.enum(['generate', 'improve', 'bullets', 'add_keywords', 'ats_friendly']).default('generate'),
});

export const achievementSchema = z.object({
  title: z.string().trim().max(200).default(''),
  rawInput: z.string().trim().max(2000).default(''),
  action: z.enum(['generate', 'improve', 'impact', 'ats_friendly']).default('generate'),
});

export const improveBulletSchema = z.object({
  text: z.string().trim().min(1, 'Text is required').max(2000),
  instruction: z.string().trim().max(500).default('Improve this for a professional, ATS-friendly resume.'),
});

export const atsAnalysisSchema = z.object({
  resume: z.record(z.string(), z.any()),
  jobDescription: z.string().trim().max(8000).default(''),
});

export const jobAnalysisSchema = z.object({
  jobDescription: z.string().trim().min(20, 'Please paste a fuller job description').max(8000),
});

export const keywordOptimizationSchema = z.object({
  resume: z.record(z.string(), z.any()),
  jobDescription: z.string().trim().min(1).max(8000),
});

export const askAssistantSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  resume: z.record(z.string(), z.any()).optional(),
});
