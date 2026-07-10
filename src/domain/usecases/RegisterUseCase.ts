import { User as DomainUser } from "../entities/User"; // Ganti import Firebase dengan Entitas Domain kelompok Anda
import { IAuthRepository } from "../repositories/IAuthRepository";

export class RegisterUseCase {
  constructor(
    private authRepository: IAuthRepository
  ) {}

  async execute(
    nickname: string,
    username: string,
    email: string,
    password: string
  ): Promise<DomainUser> { // Kembalian diubah menjadi entitas murni aplikasi Anda

    return this.authRepository.register(
      nickname,
      username,
      email,
      password
    );
  }
}