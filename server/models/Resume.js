import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderedBase = { order: { type: Number, default: 0 } };

const experienceSchema = new Schema(
  {
    company: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', ''],
      default: '',
    },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '', maxlength: 3000 },
    technologies: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    ...orderedBase,
  },
  { _id: true }
);

const educationSchema = new Schema(
  {
    degree: { type: String, trim: true, default: '' },
    field: { type: String, trim: true, default: '' },
    university: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    gpa: { type: String, default: '' },
    coursework: [{ type: String, trim: true }],
    ...orderedBase,
  },
  { _id: true }
);

const skillCategorySchema = new Schema(
  {
    category: { type: String, trim: true, default: 'General' },
    items: [{ type: String, trim: true }],
    ...orderedBase,
  },
  { _id: true }
);

const projectSchema = new Schema(
  {
    name: { type: String, trim: true, default: '' },
    type: { type: String, trim: true, default: '' },
    description: { type: String, default: '', maxlength: 2000 },
    technologies: [{ type: String, trim: true }],
    githubUrl: { type: String, trim: true, default: '' },
    liveUrl: { type: String, trim: true, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    bullets: [{ type: String, trim: true }],
    ...orderedBase,
  },
  { _id: true }
);

const achievementSchema = new Schema(
  {
    title: { type: String, trim: true, default: '' },
    organization: { type: String, trim: true, default: '' },
    date: { type: String, default: '' },
    description: { type: String, default: '', maxlength: 1000 },
    ...orderedBase,
  },
  { _id: true }
);

const certificationSchema = new Schema(
  {
    name: { type: String, trim: true, default: '' },
    issuer: { type: String, trim: true, default: '' },
    date: { type: String, default: '' },
    credentialUrl: { type: String, trim: true, default: '' },
    ...orderedBase,
  },
  { _id: true }
);

const languageSchema = new Schema(
  {
    name: { type: String, trim: true, default: '' },
    proficiency: {
      type: String,
      enum: ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'],
      default: 'Professional',
    },
    ...orderedBase,
  },
  { _id: true }
);

const awardSchema = new Schema(
  {
    title: { type: String, trim: true, default: '' },
    issuer: { type: String, trim: true, default: '' },
    date: { type: String, default: '' },
    description: { type: String, default: '', maxlength: 1000 },
    ...orderedBase,
  },
  { _id: true }
);

const volunteerSchema = new Schema(
  {
    organization: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    description: { type: String, default: '', maxlength: 1000 },
    ...orderedBase,
  },
  { _id: true }
);

const publicationSchema = new Schema(
  {
    title: { type: String, trim: true, default: '' },
    publisher: { type: String, trim: true, default: '' },
    date: { type: String, default: '' },
    url: { type: String, trim: true, default: '' },
    description: { type: String, default: '', maxlength: 1000 },
    ...orderedBase,
  },
  { _id: true }
);

const linkSchema = new Schema(
  {
    label: { type: String, trim: true, default: '' },
    url: { type: String, trim: true, default: '' },
    ...orderedBase,
  },
  { _id: true }
);

const resumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, default: 'Untitled Resume', maxlength: 150 },
    template: { type: String, default: 'modern-professional' },
    pageSize: { type: String, enum: ['A4', 'Letter'], default: 'A4' },

    personal: {
      fullName: { type: String, trim: true, default: '' },
      title: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      location: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
      portfolio: { type: String, trim: true, default: '' },
      profileImage: { type: String, default: '' },
      twitter: { type: String, trim: true, default: '' },
      leetcode: { type: String, trim: true, default: '' },
      stackoverflow: { type: String, trim: true, default: '' },
      medium: { type: String, trim: true, default: '' },
      behance: { type: String, trim: true, default: '' },
      dribbble: { type: String, trim: true, default: '' },
    },

    summary: {
      text: { type: String, default: '', maxlength: 1200 },
      yearsOfExperience: { type: String, default: '' },
      industry: { type: String, default: '' },
      primarySkills: [{ type: String, trim: true }],
      careerGoal: { type: String, default: '', maxlength: 500 },
    },

    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillCategorySchema],
    projects: [projectSchema],
    achievements: [achievementSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    awards: [awardSchema],
    volunteer: [volunteerSchema],
    publications: [publicationSchema],
    links: [linkSchema],

    sectionOrder: {
      type: [String],
      default: [
        'summary',
        'experience',
        'education',
        'skills',
        'projects',
        'achievements',
        'certifications',
        'languages',
        'awards',
        'volunteer',
        'publications',
        'links',
      ],
    },
    sectionVisibility: { type: Schema.Types.Mixed, default: {} },

    latexCode: { type: String, default: '' },

    atsScore: { type: Number, default: 0, min: 0, max: 100 },
    atsAnalysis: { type: Schema.Types.Mixed, default: null },

    jobDescription: { type: String, default: '', maxlength: 8000 },
    keywordAnalysis: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, updatedAt: -1 });

export const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
