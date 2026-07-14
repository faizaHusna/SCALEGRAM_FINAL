const CLOUD_NAME = "de9bhugsj";
const UPLOAD_PRESET = "e87zapml";

export async function uploadImage(
  imageUri: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<string> {
  try {
    const formData = new FormData();

    const filename =
      imageUri.split("/").pop() || (resourceType === 'video' ? "video.mp4" : "photo.jpg");

    const ext =
      filename.split(".").pop() || (resourceType === 'video' ? "mp4" : "jpg");

    formData.append("file", {
      uri: imageUri,
      name: filename,
      type: `${resourceType}/${ext}`,
    } as any);

    formData.append(
      "upload_preset",
      UPLOAD_PRESET
    );

    console.log(`Uploading ${resourceType}...`);
    console.log(imageUri);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    console.log("Cloudinary:", result);

    if (!response.ok) {
      throw new Error(
        JSON.stringify(result)
      );
    }

    return result.secure_url;

  } catch (error) {

    console.log(
      "UPLOAD ERROR",
      error
    );

    throw error;
  }
}