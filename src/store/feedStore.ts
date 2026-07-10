import { Post } from "@/domain/entities/Post";
import { create } from "zustand";

interface FeedState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  clearFeed: () => void;
  // Opsional: Kamu bisa menambah fungsi updateLike/addComment di sini nanti
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],

  setPosts: (posts) => set({ posts }),

  clearFeed: () => set({ posts: [] }),
}));