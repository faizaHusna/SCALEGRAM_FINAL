import { useInjection } from "@/core/di/InjectionContext";
import { CreatePostUseCase } from "@/domain/usecases/createPostUseCase";
import { useState } from "react";
// 1. TAMBAHKAN IMPOR INI: Agar hook mengenali struktur Omit<Post, 'id'>
import { Post } from "@/domain/entities/Post";

export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  
  // Ambil implementasi repository secara otomatis dari DI Container
  const { postRepository } = useInjection(); 

  // Masukkan repository hasil inject ke dalam UseCase
  const useCase = new CreatePostUseCase(postRepository);

  // 2. PERBAIKAN UTAMA: Ubah parameter agar menerima seluruh struktur Post (kecuali ID)
  async function createPost(postData: Omit<Post, "id">) {
    setLoading(true);
    try {
      // 3. PERBAIKAN FINAL: Langsung teruskan 'postData' mentah-mentah ke UseCase.
      // Jangan melakukan hardcode "Guest" atau "temp-user" di sini lagi!
      await useCase.execute(postData);
      
    } catch (error) {
      console.error("Gagal membuat postingan di useCase:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  }

  return {
    createPost,
    loading,
  };
}