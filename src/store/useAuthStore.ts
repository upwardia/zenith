import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types';
import { MockAPI } from '../api/mock';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email) => {
        set({ isLoading: true });
        try {
          await MockAPI.initialize(); // Ensure data is seeded
          const user = await MockAPI.getUser();
          // Simulate auth check (mock just returns the seeded user)
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error(error);
        }
      },
      signup: async (email) => {
        set({ isLoading: true });
        try {
          await MockAPI.initialize();
          const user = await MockAPI.getUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error(error);
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
