// src/domain/repositories/IStoryRepository.ts
import { Story } from "../entities/Story";

export interface IStoryRepository {
  getStories(): Promise<Story[]>;
  uploadStory(mediaUri: string, userId: string, username: string, avatarUrl?: string, textOverlay?: string): Promise<Story>;
}