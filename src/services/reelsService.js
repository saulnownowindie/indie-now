import api from "./api";

export async function getReels() {
  const { data } = await api.get("/reels");
  return data;
}

export async function getPublicReels(section) {
  const { data } = await api.get("/reels/public", {
    params: section ? { section } : undefined,
  });
  return data;
}

export async function createReel(reel) {
  const { data } = await api.post("/reels", reel);
  return data;
}

export async function updateReel(id, reel) {
  const { data } = await api.put(`/reels/${id}`, reel);
  return data;
}

export async function deleteReel(id) {
  const { data } = await api.delete(`/reels/${id}`);
  return data;
}

export async function uploadReelCover(file) {
  return uploadReelAsset(file, {
    resourceType: "image",
    folder: "reels-covers",
  });
}

export async function getReelUploadSignature(resourceType, folder) {
  const { data } = await api.post("/media/signature", {
    resourceType,
    folder,
  });

  return data;
}

export async function uploadReelAsset(
  file,
  { resourceType = "image", folder = "reels-covers" } = {},
) {
  const signature = await getReelUploadSignature(resourceType, folder);
  const formData = new FormData();

  formData.append("file", file);
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

export async function getReelCoverFromUrl(url) {
  const { data } = await api.post("/reels/cover-from-url", { url });

  return data;
}

export async function requestReelPreview(id, previewStart, regenerate = false) {
  const { data } = await api.post(`/reels/${id}/request-preview`, {
    previewStart,
    regenerate,
  });

  return data;
}

export async function extractReelCover(url) {
  const { data } = await api.post("/utils/extract-cover", { url });

  return data;
}
