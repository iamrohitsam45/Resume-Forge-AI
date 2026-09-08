import api from './api.js';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  me: () => api.get('/auth/me').then((r) => r.data.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  updateProfile: (payload) => api.put('/users/profile', payload).then((r) => r.data.data),
  changePassword: (payload) => api.put('/users/password', payload).then((r) => r.data),
  uploadProfileImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/users/profile-image', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
  },
  deleteAccount: () => api.delete('/users/account').then((r) => r.data),
};

export default authService;
