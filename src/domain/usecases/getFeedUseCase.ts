import { Post } from "../entities/Post";
import { IPostRepository } from "../repositories/IPostRepository";

export class GetFeedUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(): Promise<Post[]> {
    // 1. Ambil data mentah array dari repository
    const posts = await this.repository.getPosts();

    // 2. Tambahkan logika bisnis: Urutkan dari postingan terbaru (Descandic)
    // Pastikan entitas 'Post' Anda memiliki properti 'createdAt' (Date atau nomor timestamp)
    return posts.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA; // Nilai waktu lebih baru akan naik ke atas
    });
  }
}