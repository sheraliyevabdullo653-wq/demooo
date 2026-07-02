import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginApi, signupApi, fetchMe } from '../api/client';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await loginApi({ email, password });
          if (data && data.token) {
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, isLoading: false });
            return true;
          }
          set({ error: 'Xatolik yuz berdi', isLoading: false });
          return false;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await signupApi({ name, email, password });
          if (data && data.token) {
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, isLoading: false });
            return true;
          }
          set({ error: 'Xatolik yuz berdi', isLoading: false });
          return false;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const user = await fetchMe();
          if (user) {
            set({ user });
          } else {
            get().logout();
          }
        } catch (err) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
