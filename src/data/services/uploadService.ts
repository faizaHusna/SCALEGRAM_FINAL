import { uploadImage } from "./cloudinaryService";
import { addPost } from "../repositories/postRepository";

export async function uploadPost(
  image: string,
  caption: string
) {
  const imageUrl = await uploadImage(image);

  addPost({
    id: Date.now().toString(),
    username: "Syifa",
    image: imageUrl,
    caption,
    likes: 0,
  });

  return imageUrl;
}