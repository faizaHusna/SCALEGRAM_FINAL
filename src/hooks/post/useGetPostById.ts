// FILE: src/hooks/post/useGetPostById.ts
import { Post } from '@/domain/entities/Post'; // 💡 Pastikan entitas Post sudah diimpor
import { GetPostByIdUseCase } from '@/domain/usecases/getPostByIdUseCase';
import { useEffect, useState } from 'react';

export const useGetPostById = (getPostByIdUseCase: GetPostByIdUseCase, postId: string) => {
  // 💡 PERBAIKAN: Tambahkan <Post | null> setelah useState
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostByIdUseCase.execute(postId);
        
        // Baris 32 yang tadinya eror, sekarang aman karena setPost sudah tahu bisa menerima tipe 'Post'
        setPost(data); 
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, getPostByIdUseCase]);

  return { post, loading, error };
};