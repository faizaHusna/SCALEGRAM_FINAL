import { Post } from "../entities/Post";

export interface IPostRepository {

  createPost(
    post: Omit<Post, "id">
  ): Promise<void>;

  getPosts(): Promise<Post[]>;

}