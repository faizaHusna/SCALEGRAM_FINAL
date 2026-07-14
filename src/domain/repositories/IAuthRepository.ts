// 1. HAPUS import dari firebase/auth di sini!
import { User as DomainUser } from '@/domain/entities/User';

export interface IAuthRepository {
  // Semua fungsi mengembalikan tipe data dari Domain kita sendiri
  login(email: string, password: string): Promise<DomainUser>;

register(nickname: string, username: string, email: string, password: string): Promise<DomainUser>;

  logout(): Promise<void>;

  resetPassword(email: string): Promise<void>;

  // Catatan: Karena mengambil status user dari Firebase bersifat asynchronous, 
  // sebaiknya kembalikan Promise<DomainUser | null>
  getCurrentUser(): Promise<DomainUser | null>; 
}