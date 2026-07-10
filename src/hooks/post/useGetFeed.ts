import { useInjection } from "@/core/di/InjectionContext";
import { GetFeedUseCase } from "@/domain/usecases/getFeedUseCase";
import { useFeedStore } from "@/store/feedStore";
import { useCallback, useState } from "react";
// 💡 1. GANTI IMPOR useEffect DENGAN useFocusEffect DARI EXPO
import { useFocusEffect } from "expo-router";

export function useGetFeed() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  
  const { posts, setPosts } = useFeedStore();
  const { postRepository } = useInjection();
  
  const useCase = new GetFeedUseCase(postRepository);

  const loadFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await useCase.execute();
      
      setPosts(data);
    } catch (err) {
      console.error("Gagal memuat data feed di level useGetFeed:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [setPosts]);

  // 💡 2. GANTI useEffect MENJADI useFocusEffect
  // Ini akan dipanggil setiap kali layar mendapatkan fokus (misal: kembali dari halaman upload)
  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [loadFeed])
  );

  return {
    posts,        
    isLoading,    
    error,        
    refreshFeed: loadFeed, 
  };
}