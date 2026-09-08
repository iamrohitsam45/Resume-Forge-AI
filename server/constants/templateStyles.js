// Single source of truth for template visual "skins". Structure (sections, ordering,
// ATS-safety rules) is shared across every template in htmlResumeService/latexService -
// only typography, color, and spacing vary here, so ATS compatibility never regresses.
export const TEMPLATE_STYLES = {
  'modern-professional': {
    name: 'Modern Professional', atsScore: 96, bestFor: 'All-purpose, corporate & tech roles',
    fontFamily: "'Helvetica Neue', Arial, sans-serif", baseFontSize: '11px', nameFontSize: '24px',
    accent: '#2563eb', textColor: '#1f2937', ruleColor: '#dbeafe', headerAlign: 'left', headerBorder: true,
  },
  executive: {
    name: 'Executive', atsScore: 95, bestFor: 'Senior leadership & management',
    fontFamily: "Georgia, 'Times New Roman', serif", baseFontSize: '11px', nameFontSize: '26px',
    accent: '#111827', textColor: '#111827', ruleColor: '#e5e7eb', headerAlign: 'center', headerBorder: true,
  },
  'minimal-ats': {
    name: 'Minimal ATS', atsScore: 99, bestFor: 'Maximum ATS parsing safety',
    fontFamily: "Arial, Helvetica, sans-serif", baseFontSize: '11px', nameFontSize: '22px',
    accent: '#000000', textColor: '#000000', ruleColor: '#000000', headerAlign: 'left', headerBorder: false,
  },
  'software-engineer': {
    name: 'Software Engineer', atsScore: 97, bestFor: 'Backend, full-stack & platform engineers',
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", baseFontSize: '11px', nameFontSize: '23px',
    accent: '#0d9488', textColor: '#1f2937', ruleColor: '#ccfbf1', headerAlign: 'left', headerBorder: true,
  },
  'fullstack-developer': {
    name: 'Full Stack Developer', atsScore: 96, bestFor: 'Full-stack & web application developers',
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", baseFontSize: '11px', nameFontSize: '23px',
    accent: '#7c3aed', textColor: '#1f2937', ruleColor: '#ede9fe', headerAlign: 'left', headerBorder: true,
  },
  'ios-developer': {
    name: 'iOS Developer', atsScore: 96, bestFor: 'iOS / Swift / mobile engineers',
    fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", baseFontSize: '11px', nameFontSize: '23px',
    accent: '#0369a1', textColor: '#1f2937', ruleColor: '#e0f2fe', headerAlign: 'left', headerBorder: true,
  },
  'java-developer': {
    name: 'Java Developer', atsScore: 96, bestFor: 'Java / Spring / enterprise backend roles',
    fontFamily: "Arial, Helvetica, sans-serif", baseFontSize: '11px', nameFontSize: '23px',
    accent: '#b45309', textColor: '#1f2937', ruleColor: '#fef3c7', headerAlign: 'left', headerBorder: true,
  },
  'data-scientist': {
    name: 'Data Scientist', atsScore: 95, bestFor: 'Data science, ML & analytics roles',
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", baseFontSize: '11px', nameFontSize: '23px',
    accent: '#be123c', textColor: '#1f2937', ruleColor: '#ffe4e6', headerAlign: 'left', headerBorder: true,
  },
  'product-manager': {
    name: 'Product Manager', atsScore: 95, bestFor: 'Product & program management roles',
    fontFamily: "'Helvetica Neue', Arial, sans-serif", baseFontSize: '11px', nameFontSize: '24px',
    accent: '#4338ca', textColor: '#1f2937', ruleColor: '#e0e7ff', headerAlign: 'center', headerBorder: true,
  },
  'fresh-graduate': {
    name: 'Fresh Graduate', atsScore: 97, bestFor: 'New graduates & early-career candidates',
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", baseFontSize: '11px', nameFontSize: '22px',
    accent: '#059669', textColor: '#1f2937', ruleColor: '#d1fae5', headerAlign: 'center', headerBorder: false,
  },
};

export const DEFAULT_TEMPLATE_KEY = 'modern-professional';

export default { TEMPLATE_STYLES, DEFAULT_TEMPLATE_KEY };
