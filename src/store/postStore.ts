import { PostRepository } from '@/data/repositories/PostRepository';
import { Post } from '@/domain/entities/Post';
import { create } from 'zustand';



// 2. Definisikan tipe data untuk Store Zustand
interface PostState {
  posts: Post[];
  rawStories: any[];
  setPosts: (posts: Post[]) => void;
  updatePostLocal: (postId: string, newCaption: string) => void;
  fetchAllPosts: () => Promise<void>; // 👈 TAMBAHKAN INI DI INTERFACE
  toggleLikeStore: (postId: string, userId: string) => void;
}

// 3. Buat Store dengan parameter set yang ter-typing otomatis
const postRepository = new PostRepository();

// 2. Buat Store dengan parameter set yang ter-typing otomatis
export const usePostStore = create<PostState>((set) => ({

    toggleLikeStore: (postId, userId) => set((state) => ({
  posts: state.posts.map((post) => {
    if (post.id !== postId) return post;
    
    const isLiked = post.likes.includes(userId);
    return {
      ...post,
      likes: isLiked 
        ? post.likes.filter(id => id !== userId) // Hapus jika sudah ada
        : [...post.likes, userId]              // Tambah jika belum ada
    };
  })
})),
  posts: [],
  rawStories: [],
  setPosts: (posts) => set({ posts }),
  
  updatePostLocal: (postId: string, newCaption: string) => 
    set((state) => ({
      posts: state.posts.map((post) => 
        post.id === postId ? { ...post, caption: newCaption } : post
      ),
      rawStories: state.rawStories.map((story) =>
        story.id === postId ? { ...story, caption: newCaption } : story
      )
    })),

  // 👈 TAMBAHKAN IMPLEMENTASI INI
  fetchAllPosts: async () => {
    try {
      // Mengambil data posts terbaru dari Firebase Firestore melalui repositori
      const latestPosts = await postRepository.getPosts();
      
      // Simpan data yang didapat ke dalam state posts di lokal
      set({ posts: latestPosts });
    } catch (error) {
      console.error("Gagal sinkronisasi fetchAllPosts ke store:", error);
    }
  }
}));