// 💡 PERUBAHAN 1: Hapus import firebase/auth, ganti dengan Entitas Domain murni kelompok Anda
import { User as DomainUser } from "@/domain/entities/User";
import { IAuthRepository } from "../repositories/IAuthRepository";

export class GetCurrentUserUseCase {
  constructor(
    private authRepository: IAuthRepository
  ) {}

  // 💡 PERUBAHAN 2: Tambahkan kata kunci 'async' dan bungkus tipe kembalian dengan 'Promise'
  async execute(): Promise<DomainUser | null> {
    
    // 💡 PERUBAHAN 3: Tambahkan kata kunci 'await' untuk mengambil data asinkronus dari repository
    return await this.authRepository.getCurrentUser();
  }
}