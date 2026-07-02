import * as FileSystem from "expo-file-system";

export async function uploadImage(imageUri: string) {
  console.log("Image URI:", imageUri);

  const cloudName = "de9bhugsj";
  const uploadPreset = "e87zapml";

  const response = await FileSystem.uploadAsync(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    imageUri,
    {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
      parameters: {
        upload_preset: uploadPreset,
      },
    }
  );

  const result = JSON.parse(response.body);

  console.log("Cloudinary Result:", result);

  if (!result.secure_url) {
    throw new Error(result.error?.message || "Upload failed");
  }

  return result.secure_url;
}