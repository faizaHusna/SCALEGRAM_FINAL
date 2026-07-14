// src/hooks/post/useGetExplorePosts.ts
import { Post } from '@/domain/entities/Post';
import { GetExplorePostsUseCase } from '@/domain/usecases/GetExplorePostsUseCase';
import { useEffect, useState } from 'react';

export const useGetExplorePosts = (getExplorePostsUseCase: GetExplorePostsUseCase) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getExplorePostsUseCase.execute();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data postingan");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getExplorePostsUseCase]);

  return { posts, loading, error };
};