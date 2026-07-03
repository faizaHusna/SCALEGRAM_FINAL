import { Post } from "../entities/Post";
import { IPostRepository } from "../repositories/IPostRepository";

export class CreatePostUseCase {

  constructor(
    private repository: IPostRepository
  ) {}

  execute(
    post: Omit<Post, "id">
  ) {

    return this.repository.createPost(post);

  }

}