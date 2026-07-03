import { User } from "firebase/auth";
import { IAuthRepository } from "../repositories/IAuthRepository";

export class RegisterUseCase {

  constructor(
    private authRepository: IAuthRepository
  ) {}

  async execute(
    username: string,
    email: string,
    password: string
  ): Promise<User> {

    return this.authRepository.register(
      username,
      email,
      password
    );
  }

}