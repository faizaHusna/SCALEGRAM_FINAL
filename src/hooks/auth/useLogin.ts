import { AuthRepository } from "@/data/repositories/AuthRepository";
import { LoginUseCase } from "@/domain/usecases/LoginUseCase";
import { User } from "firebase/auth";
import { useState } from "react";

export function useLogin() {

  const [loading, setLoading] = useState(false);
  const repository = new AuthRepository();

  const loginUseCase =
    new LoginUseCase(repository);

  async function login(
    email: string,
    password: string
  ): Promise<User> {

    setLoading(true);

    try {

      return await loginUseCase.execute(
        email,
        password
      );

    } finally {

      setLoading(false);

    }

  }

  return {
    login,
    loading,
  };

}