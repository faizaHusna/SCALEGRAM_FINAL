import { User } from "firebase/auth";
import { IAuthRepository } from "../repositories/IAuthRepository";

export class GetCurrentUserUseCase {

  constructor(
    private authRepository: IAuthRepository
  ) {}

  execute(): User | null {

    return this.authRepository.getCurrentUser();

  }

}