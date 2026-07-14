import { PostRepository } from "../repositories/PostRepository";
import { uploadImage } from "./CloudinaryService";

const repository = new PostRepository();

export async function uploadPost(
  image: string,
  caption: string
) {
  const imageUrl = await uploadImage(image);

  await repository.createPost({
    userId: "temp-user",
    username: "Syifa",
    caption,
    imageUrl,
    likes: [],
    comments: 0,
    createdAt: Date.now(),
  });

  return imageUrl;
}