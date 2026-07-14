// src/domain/usecases/UploadStoryUseCase.ts
import { Story } from "../entities/Story";
import { IStoryRepository } from "../repositories/IStoryRepository";

export class UploadStoryUseCase {
  private storyRepository: IStoryRepository;

  constructor(storyRepository: IStoryRepository) {
    this.storyRepository = storyRepository;
  }

  async execute(mediaUri: string, userId: string, username: string, avatarUrl?: string,  textOverlay?: string): Promise<Story> {
    // Validasi bisnis sederhana jika diperlukan
    if (!mediaUri) {
      throw new Error("Media URI tidak boleh kosong.");
    }

    // Eksekusi fungsi repositori sesungguhnya
    return await this.storyRepository.uploadStory(mediaUri, userId, username, avatarUrl, textOverlay);
  }
}