import { IPostRepository } from "../repositories/IPostRepository";

export class GetFeedUseCase {

  constructor(
    private repository: IPostRepository
  ) {}

  execute() {

    return this.repository.getPosts();

  }

}