import { User } from "firebase/auth";

export interface IAuthRepository {
  login(
    email: string,
    password: string
  ): Promise<User>;

  register(
    username: string,
    email: string,
    password: string
): Promise<User>;

  logout(): Promise<void>;

  resetPassword(
    email: string
  ): Promise<void>;

  getCurrentUser(): User | null;
}