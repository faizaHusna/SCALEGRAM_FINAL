import { useInjection } from "@/core/di/InjectionContext";
import { User as DomainUser } from "@/domain/entities/User";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export function useRegister() {
  const [loading, setLoading] = useState(false);

  // 💡 PERUBAHAN 1: Ambil langsung registerUseCase dari DI Container pusat
  // Kita tidak perlu lagi membuat manual `new RegisterUseCase(authRepository)`
  const { registerUseCase } = useInjection();
  const { setUser } = useAuthStore();

  async function register(
    nickname: string,
    username: string,
    email: string,
    password: string
  ): Promise<DomainUser> {
    setLoading(true);

    try {
      // 💡 PERUBAHAN 2: Eksekusi usecase ter-inject dari container
      const domainUser = await registerUseCase.execute(nickname, username, email, password);

      // Simpan session pengguna agar langsung masuk setelah daftar
      setUser(domainUser);

      return domainUser;
    } catch (error) {
      console.error("Gagal melakukan registrasi di level useRegister hook:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  }

  return {
    register,
    // 💡 PERUBAHAN 3: Sediakan alias 'registerUser' untuk mematikan pop-up eror 
    // 'registerUser is not a function' pada tampilan RegisterScreen rekan Anda
    registerUser: register, 
    loading,
  };
}