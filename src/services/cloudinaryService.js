import api from "./api";

const MIME_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export async function getUploadSignature(resourceType, folder) {
  const { data } = await api.post("/media/signature", {
    resourceType,
    folder,
  });

  return data;
}

export async function uploadToCloudinary(
  file,
  { resourceType = "image", folder = "reels-covers" } = {},
) {
  const signature = await getUploadSignature(resourceType, folder);
  const formData = new FormData();
  const extension =
    MIME_EXTENSIONS[file.type] ||
    (resourceType === "video" ? "mp4" : "jpg");

  formData.append(
    "file",
    file,
    file.name ||
      `${resourceType === "video" ? "preview" : "poster"}.${extension}`,
  );
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.secure_url) {
    throw new Error(
      data?.error?.message ||
        "No se pudo subir el archivo a Cloudinary.",
    );
  }

  return data.secure_url;
}
