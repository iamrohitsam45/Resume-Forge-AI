import api from './api.js';

export const resumeService = {
  list: () => api.get('/resumes').then((r) => r.data.data),
  get: (id) => api.get(`/resumes/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/resumes', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/resumes/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/resumes/${id}`).then((r) => r.data),
  duplicate: (id) => api.post(`/resumes/${id}/duplicate`).then((r) => r.data.data),
  runAts: (id, jobDescription) => api.post(`/resumes/${id}/ats`, { jobDescription }).then((r) => r.data.data),
  downloadExport: (id, format) =>
    api.get(`/resumes/${id}/export`, { params: { format }, responseType: 'blob' }).then((r) => r.data),
  saveVersion: (id, label) => api.post(`/resumes/${id}/versions`, { label }).then((r) => r.data.data),
  listVersions: (id) => api.get(`/resumes/${id}/versions`).then((r) => r.data.data),
  restoreVersion: (id, versionId) => api.post(`/resumes/${id}/versions/${versionId}/restore`).then((r) => r.data.data),
};

export default resumeService;
