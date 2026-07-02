export async function uploadImage(imageUri: string) {
  console.log("Image URI:", imageUri);

  const data = new FormData();

  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "photo.jpg",
  } as any);

  data.append("upload_preset", "e87zapml");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/de9bhugsj/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const result = await response.json();

  console.log(result);

  return result.secure_url;
}