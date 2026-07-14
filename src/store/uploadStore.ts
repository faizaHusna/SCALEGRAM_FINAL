import { create } from "zustand";

interface UploadState {
  image: string | null; // Urutan URI media
  mediaType: 'image' | 'video' | null;
  caption: string;
  setImage: (image: string | null, mediaType?: 'image' | 'video' | null) => void;
  setCaption: (caption: string) => void;
  clear: () => void;
  hasChanges: () => boolean;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  image: null,
  mediaType: null,
  caption: "",
  setImage: (image, mediaType = 'image') => set({ image, mediaType }),
  setCaption: (caption) => set({ caption }),
  clear: () => set({ image: null, mediaType: null, caption: "" }),
  hasChanges: () => {
    const { image, caption } = get();
    return image !== null || caption.trim() !== "";
  },
}));
