import { AuthRepository } from '@/data/repositories/AuthRepository';
import { PostRepository } from '@/data/repositories/PostRepository';

// Import UseCases yang dibutuhkan oleh presentasi (Screens/Hooks)
import { LoginUseCase } from '@/domain/usecases/LoginUseCase';
import { RegisterUseCase } from '@/domain/usecases/RegisterUseCase';

import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IPostRepository } from '@/domain/repositories/IPostRepository';

// 1. Definisikan tipe kontrak container secara lengkap
export interface IDIContainer {
  authRepository: IAuthRepository;
  postRepository: IPostRepository;
  
  // Daftarkan UseCases ke dalam kontrak interface agar dikenali Hooks
  loginUseCase: LoginUseCase;
  registerUseCase: RegisterUseCase;
}

// 2. Inisialisasi secara instan (Sesuai dengan constructor bawaan proyek Anda)
const authRepository = new AuthRepository(); // 💡 SEKARANG AMAN: Dipanggil tanpa parameter
const postRepository = new PostRepository();

const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);

// 3. Terapkan pada objek kontainer global Anda
export const DIContainer: IDIContainer = {
  authRepository,
  postRepository,
  loginUseCase,
  registerUseCase,
};