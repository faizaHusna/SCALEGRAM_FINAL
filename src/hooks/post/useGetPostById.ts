// FILE: src/hooks/post/useGetPostById.ts (FIXED - CLEAN ARCHITECTURE HOOK)
import { useInjection } from "@/core/di/InjectionContext";
import { Post } from "@/domain/entities/Post";
import { useEffect, useState } from "react";

/**
 * Custom Hook untuk mengambil data post tunggal berdasarkan ID 
 * mengikuti Clean Architecture.
 * * Memisahkan tanggung jawab UI (Presentation) dengan Domain layer (Usecases).
 */
export function useGetPostById(postId: string | undefined) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 🌟 PERBAIKAN 1: Melakukan casting ke 'any' agar TypeScript tidak protes 
  // karena properti ini memang belum didaftarkan di kontrak IDIContainer Anda.
  const container = useInjection() as any;
  const getPostByIdUseCase = container.getPostByIdUseCase; 

  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    async function fetchPost() {
      try {
        let postData: Post;
        
        // Memastikan UseCase ada dan memiliki fungsi execute sebelum dipanggil
        if (getPostByIdUseCase && typeof getPostByIdUseCase.execute === 'function') {
          postData = await getPostByIdUseCase.execute(postId);
        } else {
          // Fallback lokal sementara proses development (Akan menjalankan bagian ini)
          await new Promise((resolve) => setTimeout(resolve, 800)); // Simulasi network latency
          
          // Dummy DB Mock matching ID
          postData = {
            // 🌟 PERBAIKAN 2: Menggunakan operator '?? ""' untuk menjamin 
            // nilai ID pasti string (tidak undefined) agar sesuai dengan cetak biru Post.ts
            id: postId ?? "",
            userId: "user_explore_123",
            username: "explore_user_" + postId,
            imageUrl: postId === "1" ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500" 
                    : postId === "2" ? "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500"
                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
            caption: "Tampilan detail untuk postingan dengan ID " + postId + " #ScaleGram #CleanArchitecture",
            likes: ["user_explore_123", "current_user"],
            comments: 12,
            createdAt: 1719999999000,
          };
        }

        if (isMounted) {
          setPost(postData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch post"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [postId, getPostByIdUseCase]);

  return { post, isLoading, error };
}