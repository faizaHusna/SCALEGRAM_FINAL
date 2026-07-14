// src/domain/usecases/GetExplorePostsUseCase.ts
import { Post } from '@/domain/entities/Post';
import { IPostRepository } from '@/domain/repositories/IPostRepository';

export class GetExplorePostsUseCase {
  private postRepository: IPostRepository;

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository;
  }

  async execute(): Promise<Post[]> {
    // 💡 Memanggil fungsi getPosts yang sudah kamu miliki
    const posts = await this.postRepository.getPosts();
    
    if (!posts || posts.length === 0) {
      throw new Error("Tidak ada postingan yang ditemukan.");
    }
    
    return posts;
  }
}