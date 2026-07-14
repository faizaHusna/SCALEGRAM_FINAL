// src/data/repositories/StoryRepositoryImpl.ts
import { Story } from "@/domain/entities/Story";
import { IStoryRepository } from "@/domain/repositories/IStoryRepository";
import { useStoryStore } from "@/store/useStoryStore"; // Store Zustand Anda


export class StoryRepositoryImpl implements IStoryRepository {
  async getStories(): Promise<Story[]> {
    // Nanti diisi: fetch data dari API
    return [];
  }

  async uploadStory(mediaUri: string, userId: string, username: string, avatarUrl?: string): Promise<Story> {
    // 1. Buat objek entity Story yang matang
    const newStory: Story = {
      id: String(Date.now()),
      userId,
      username,
      avatarUrl,
      mediaUrl: mediaUri,
      createdAt: new Date(),
    };

    // 2. Masukkan ke Global Store agar UI Beranda langsung nge-render otomatis
    const addStory = useStoryStore.getState().addStory;
    addStory(newStory);

    return newStory;
  }
}