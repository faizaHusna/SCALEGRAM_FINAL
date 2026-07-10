import { User as DomainUser } from "../entities/User"; // Ganti import Firebase dengan Entitas Domain Anda
import { IAuthRepository } from "../repositories/IAuthRepository";

export class LoginUseCase {
  constructor(
    private authRepository: IAuthRepository
  ) {}

  // Kembaliannya diubah menjadi kontrak DomainUser murni
  async execute(
    email: string,
    password: string
  ): Promise<DomainUser> {
    // Sesuai dengan implementasi AuthRepository Anda yang mengembalikan DomainUser
    return await this.authRepository.login(
      email,
      password
    );
  }
}