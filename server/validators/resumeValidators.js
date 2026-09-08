import { z } from 'zod';

const orderedItem = z.object({ order: z.number().optional() }).passthrough();

export const createResumeSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(150).default('Untitled Resume'),
  template: z.string().trim().default('modern-professional'),
  pageSize: z.enum(['A4', 'Letter']).default('A4'),
});

// The resume document has many nested, evolving sections. We validate structure
// loosely (types + reasonable limits) rather than locking every field, since the
// builder autosaves partial drafts constantly.
export const updateResumeSchema = z
  .object({
    title: z.string().trim().min(1).max(150).optional(),
    template: z.string().optional(),
    pageSize: z.enum(['A4', 'Letter']).optional(),
    personal: z.record(z.string(), z.any()).optional(),
    summary: z.record(z.string(), z.any()).optional(),
    experience: z.array(orderedItem).optional(),
    education: z.array(orderedItem).optional(),
    skills: z.array(orderedItem).optional(),
    projects: z.array(orderedItem).optional(),
    achievements: z.array(orderedItem).optional(),
    certifications: z.array(orderedItem).optional(),
    languages: z.array(orderedItem).optional(),
    awards: z.array(orderedItem).optional(),
    volunteer: z.array(orderedItem).optional(),
    publications: z.array(orderedItem).optional(),
    links: z.array(orderedItem).optional(),
    sectionOrder: z.array(z.string()).optional(),
    sectionVisibility: z.record(z.string(), z.boolean()).optional(),
    latexCode: z.string().max(50000).optional(),
    jobDescription: z.string().max(8000).optional(),
    atsScore: z.number().min(0).max(100).optional(),
    atsAnalysis: z.any().optional(),
    keywordAnalysis: z.any().optional(),
  })
  .strict();

export default { createResumeSchema, updateResumeSchema };
