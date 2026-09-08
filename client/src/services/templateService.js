import api from './api.js';

export const templateService = {
  list: () => api.get('/templates').then((r) => r.data.data),
};

export default templateService;
