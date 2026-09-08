import { create } from 'zustand';
import authService from '../services/authService.js';

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('resumeforge_user') || 'null');
  } catch {
    return null;
  }
})();

export const useAuthStore = create((set, get) => ({
  user: storedUser,
  token: localStorage.getItem('resumeforge_token') || null,
  isAuthenticated: Boolean(localStorage.getItem('resumeforge_token')),
  loading: false,

  persist(user, token) {
    localStorage.setItem('resumeforge_token', token);
    localStorage.setItem('resumeforge_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  async register(payload) {
    set({ loading: true });
    try {
      const { user, token } = await authService.register(payload);
      get().persist(user, token);
      return user;
    } finally {
      set({ loading: false });
    }
  },

  async login(payload) {
    set({ loading: true });
    try {
      const { user, token } = await authService.login(payload);
      get().persist(user, token);
      return user;
    } finally {
      set({ loading: false });
    }
  },

  async refreshMe() {
    if (!get().token) return null;
    try {
      const { user } = await authService.me();
      localStorage.setItem('resumeforge_user', JSON.stringify(user));
      set({ user });
      return user;
    } catch {
      get().logout();
      return null;
    }
  },

  updateUser(user) {
    localStorage.setItem('resumeforge_user', JSON.stringify(user));
    set({ user });
  },

  logout() {
    localStorage.removeItem('resumeforge_token');
    localStorage.removeItem('resumeforge_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
