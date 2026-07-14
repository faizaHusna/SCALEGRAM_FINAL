import { Post } from "../entities/Post";

export interface IPostRepository {

  createPost(
    post: Omit<Post, "id">
  ): Promise<void>;

  getPosts(): Promise<Post[]>;

  getPostById(postId: string): Promise<Post>;

  updatePost(postId: string, caption: string): Promise<void>;

  toggleSavePost(postId: string, userId: string, isCurrentlySaved: boolean): Promise<void>;
}

