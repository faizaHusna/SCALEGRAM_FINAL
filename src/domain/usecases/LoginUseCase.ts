import { User } from "firebase/auth";
import { IAuthRepository } from "../domain/repositories/IAuthRepository";

export class LoginUseCase {
  constructor(
    private authRepository: IAuthRepository
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<User> {
    return await this.authRepository.login(
      email,
      password
    );
  }
}