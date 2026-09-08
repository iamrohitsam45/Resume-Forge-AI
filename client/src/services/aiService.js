import api from './api.js';

export const aiService = {
  summary: (payload) => api.post('/ai/summary', payload).then((r) => r.data.data),
  experienceDescription: (payload) => api.post('/ai/experience-description', payload).then((r) => r.data.data),
  projectDescription: (payload) => api.post('/ai/project-description', payload).then((r) => r.data.data),
  achievementDescription: (payload) => api.post('/ai/achievement-description', payload).then((r) => r.data.data),
  improveBullet: (payload) => api.post('/ai/improve-bullet', payload).then((r) => r.data.data),
  atsAnalysis: (payload) => api.post('/ai/ats-analysis', payload).then((r) => r.data.data),
  jobDescriptionAnalysis: (payload) => api.post('/ai/job-description-analysis', payload).then((r) => r.data.data),
  keywordOptimization: (payload) => api.post('/ai/keyword-optimization', payload).then((r) => r.data.data),
  tailorResume: (payload) => api.post('/ai/tailor-resume', payload).then((r) => r.data.data),
  askAssistant: (payload) => api.post('/ai/assistant', payload).then((r) => r.data.data),
};

export default aiService;
