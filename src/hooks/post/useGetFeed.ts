import { PostRepository } from "@/data/repositories/PostRepository";
import { Post } from "@/domain/entities/Post";
import { GetFeedUseCase } from "@/domain/usecases/getFeedUseCase";
import { useEffect, useState } from "react";

export function useGetFeed() {

  const [posts, setPosts] = useState<Post[]>([]);

  const repository =
    new PostRepository();

  const useCase =
    new GetFeedUseCase(repository);

  useEffect(() => {
    async function load() {

      const data =
        await useCase.execute();

      setPosts(data);
    }
    load();
  }, []);

  return {
    posts,

  };

}