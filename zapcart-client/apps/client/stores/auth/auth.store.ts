import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthStore } from './auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,

      // Actions
      login: () => {
        set({ isAuthenticated: true });
      },

      logout: () => {
        set({ isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist isAuthenticated, not isLoading
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
