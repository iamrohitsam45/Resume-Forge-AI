// Mirrors server/constants/templateStyles.js so the live preview matches the
// exported PDF exactly. Structure (sections/order) lives in ResumeDocument.jsx;
// only typography/color/spacing vary per template, keeping every template ATS-safe.
export const TEMPLATE_STYLES = {
  'modern-professional': {
    name: 'Modern Professional',
    atsScore: 96,
    bestFor: 'All-purpose - corporate & tech roles',
    description: 'Clean single-column layout with a confident accent color. The safest, most versatile choice.',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    accent: '#2563eb', textColor: '#1f2937', ruleColor: '#dbeafe', headerAlign: 'left', headerBorder: true,
  },
  executive: {
    name: 'Executive',
    atsScore: 95,
    bestFor: 'Senior leadership & management',
    description: 'A refined serif treatment that reads as authoritative for director+ roles.',
    fontFamily: "Georgia, 'Times New Roman', serif",
    accent: '#111827', textColor: '#111827', ruleColor: '#e5e7eb', headerAlign: 'center', headerBorder: true,
  },
  'minimal-ats': {
    name: 'Minimal ATS',
    atsScore: 99,
    bestFor: 'Maximum ATS parsing safety',
    description: 'Pure black-and-white, zero styling risk - built for parsers with strict formatting rules.',
    fontFamily: 'Arial, Helvetica, sans-serif',
    accent: '#000000', textColor: '#000000', ruleColor: '#000000', headerAlign: 'left', headerBorder: false,
  },
  'software-engineer': {
    name: 'Software Engineer',
    atsScore: 97,
    bestFor: 'Backend, full-stack & platform engineers',
    description: 'A crisp teal accent tuned for technical resumes heavy on skills and project bullets.',
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
    accent: '#0d9488', textColor: '#1f2937', ruleColor: '#ccfbf1', headerAlign: 'left', headerBorder: true,
  },
  'fullstack-developer': {
    name: 'Full Stack Developer',
    atsScore: 96,
    bestFor: 'Full-stack & web application developers',
    description: 'Balanced layout for candidates spanning frontend and backend technologies.',
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
    accent: '#7c3aed', textColor: '#1f2937', ruleColor: '#ede9fe', headerAlign: 'left', headerBorder: true,
  },
  'ios-developer': {
    name: 'iOS Developer',
    atsScore: 96,
    bestFor: 'iOS / Swift / mobile engineers',
    description: 'A polished, Apple-adjacent look emphasizing project and technical skill sections.',
    fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
    accent: '#0369a1', textColor: '#1f2937', ruleColor: '#e0f2fe', headerAlign: 'left', headerBorder: true,
  },
  'java-developer': {
    name: 'Java Developer',
    atsScore: 96,
    bestFor: 'Java / Spring / enterprise backend roles',
    description: 'Enterprise-friendly styling that reads well at large, traditional organizations.',
    fontFamily: 'Arial, Helvetica, sans-serif',
    accent: '#b45309', textColor: '#1f2937', ruleColor: '#fef3c7', headerAlign: 'left', headerBorder: true,
  },
  'data-scientist': {
    name: 'Data Scientist',
    atsScore: 95,
    bestFor: 'Data science, ML & analytics roles',
    description: 'Structured to foreground quantifiable impact and technical publications/certifications.',
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
    accent: '#be123c', textColor: '#1f2937', ruleColor: '#ffe4e6', headerAlign: 'left', headerBorder: true,
  },
  'product-manager': {
    name: 'Product Manager',
    atsScore: 95,
    bestFor: 'Product & program management roles',
    description: 'Centered header with an emphasis on outcomes, stakeholders, and cross-functional impact.',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    accent: '#4338ca', textColor: '#1f2937', ruleColor: '#e0e7ff', headerAlign: 'center', headerBorder: true,
  },
  'fresh-graduate': {
    name: 'Fresh Graduate',
    atsScore: 97,
    bestFor: 'New graduates & early-career candidates',
    description: 'Friendly, education-forward layout for candidates with limited work experience.',
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
    accent: '#059669', textColor: '#1f2937', ruleColor: '#d1fae5', headerAlign: 'center', headerBorder: false,
  },
};

export const DEFAULT_TEMPLATE_KEY = 'modern-professional';
export const TEMPLATE_LIST = Object.entries(TEMPLATE_STYLES).map(([key, t]) => ({ key, ...t }));

export default TEMPLATE_STYLES;
