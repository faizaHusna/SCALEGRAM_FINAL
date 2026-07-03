import { AuthRepository } from "@/data/repositories/AuthRepository";
import { RegisterUseCase } from "@/domain/usecases/RegisterUseCase";
import { User } from "firebase/auth";
import { useState } from "react";

export function useRegister() {

  const [loading, setLoading] = useState(false);

  const repository =
    new AuthRepository();

  const registerUseCase =
    new RegisterUseCase(repository);

  async function register(
    username: string,
    email: string,
    password: string

  ): Promise<User> {

    setLoading(true);

    try {
      return await registerUseCase.execute(
        username,
        email,
        password

      );

    } finally {
      setLoading(false);
    }

  }

  return {
    register,
    loading,
  };

}