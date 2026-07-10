import { Post } from "../entities/Post";
import { IPostRepository } from "../repositories/IPostRepository";

export class CreatePostUseCase {
  constructor(
    private repository: IPostRepository
  ) {}

  // 💡 PERBAHAN: Tambahkan async dan Promise<void> atau Promise<Post> sesuai kontrak repository Anda
  async execute(
    post: Omit<Post, "id">
  ): Promise<void> { // atau Promise<Post> jika repo Anda mengembalikan data post utuh
    return await this.repository.createPost(post);
  }
}