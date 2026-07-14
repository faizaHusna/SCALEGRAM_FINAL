import { Post } from '@/domain/entities/Post';
import { IPostRepository } from '@/domain/repositories/IPostRepository';

export class GetPostByIdUseCase {
  private postRepository: IPostRepository;

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository;
  }

  // PENTING: Pastikan ditulis Promise<Post> bukan Promise saja
  async execute(postId: string): Promise<Post> {
    if (!postId) {
      throw new Error("Post ID wajib diisi.");
    }
    return await this.postRepository.getPostById(postId);
  }
}