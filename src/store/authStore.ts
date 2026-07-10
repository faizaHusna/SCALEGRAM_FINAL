import { User as DomainUser } from "@/domain/entities/User";
import { create } from "zustand";

interface AuthState {
  user: DomainUser | null;   // Menyimpan data profil user aktif dari Domain Layer
  loading: boolean;          // Menandakan status pengecekan sesi login (Auth State Listener)
  setUser: (user: DomainUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // 1. Set default ke TRUE agar SplashScreen menahan layar sementara 
  // sampai Firebase Auth selesai memeriksa apakah user sudah login atau belum.
  loading: true, 
  
  setUser: (user) => set({ user, loading: false }), // Otomatis matikan loading saat user diset
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, loading: false }),
}));