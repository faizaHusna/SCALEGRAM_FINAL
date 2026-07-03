import { useState } from "react";

import { PostRepository } from "@/data/repositories/PostRepository";
import { Post } from "@/domain/entities/Post";
import { CreatePostUseCase } from "@/domain/usecases/createPostUseCase";

export function useCreatePost() {
  const [loading, setLoading] = useState(false);

  const repository = new PostRepository();
  const useCase = new CreatePostUseCase(repository);

  async function createPost(post: Omit<Post, "id">) {
    setLoading(true);

    try {
      await useCase.execute(post);
    } finally {
      setLoading(false);
    }
  }

  return {
    createPost,
    loading,
  };
}