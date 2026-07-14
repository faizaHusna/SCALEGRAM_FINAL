import { create } from 'zustand';

interface StoryState {
  storiesData: any[];
  addStory: (newStory: any) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  // Data default tiruan Anda (ditambah index 0 untuk tombol "Create")
  storiesData: [
    { id: "create_placeholder", username: "You" }, 
    { id: "1", username: "Syifa", avatarUrl: "https://i.pravatar.cc/150?img=1" },
    { id: "2", username: "Hani", avatarUrl: "https://i.pravatar.cc/150?img=2" },
    { id: "3", username: "Faiza", avatarUrl: "https://i.pravatar.cc/150?img=3" },
  ],
  addStory: (newStory) => set((state) => {
    // Kita sisipkan story baru tepat setelah tombol CreateStoryButton (index 1)
    const updated = [...state.storiesData];
    updated.splice(1, 0, newStory); 
    return { storiesData: updated };
  }),
}));