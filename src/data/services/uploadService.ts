import { uploadImage } from "./cloudinaryService";

export async function uploadPost(
  image: string,
  caption: string
) {
  const imageUrl = await uploadImage(image);

  console.log("Image URL:", imageUrl);
  console.log("Caption:", caption);

  return imageUrl;
}