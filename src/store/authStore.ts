import { User as DomainUser } from "@/domain/entities/User";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

// 1. Definisikan interface AuthState
export interface AuthState {
  user: DomainUser | null;
  loading: boolean;
  setUser: (user: DomainUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

// 2. Gunakan interface tersebut di dalam create
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null, loading: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);