import { IPostRepository } from "@/domain/repositories/IPostRepository";

import { Post } from "@/domain/entities/Post";

import {
  createPost,
  getPosts,
} from "../services/postServices";

export class PostRepository
implements IPostRepository {

  async createPost(
    post: Omit<Post, "id">
  ) {

    return createPost(post);

  }

  async getPosts() {

    return getPosts();

  }

}