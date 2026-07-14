import { useInjection } from '@/core/di/InjectionContext';
import { User as DomainUser } from "@/domain/entities/User";
import { useAuthStore } from '@/store/authStore';
import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  
  // 💡 PERUBAHAN 1: Ambil langsung loginUseCase dari DI Container
  // Kita tidak perlu lagi menulis `new LoginUseCase(authRepository)` di sini
  const { loginUseCase } = useInjection(); 
  const { setUser } = useAuthStore();

  async function login(email: string, password: string): Promise<DomainUser> {
    setLoading(true);

    try {
      // 💡 PERUBAHAN 2: Eksekusi langsung usecase ter-inject dari container
      const domainUser = await loginUseCase.execute(email, password);

      // Simpan data ke state global zustand / context
      setUser(domainUser);

      return domainUser;
    } catch (error) {
      console.error("Gagal melakukan autentikasi di level useLogin hook:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    // 💡 PERUBAHAN 3: Sediakan alias 'loginUser' untuk mencocokkan fungsi 
    // yang dipanggil di dalam file LoginScreen.tsx milik rekan Anda.
    loginUser: login, 
    loading,
  };
}