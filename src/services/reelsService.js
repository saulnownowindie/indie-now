import api from "./api";
import { uploadToCloudinary } from "./cloudinaryService";

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
  return uploadToCloudinary(file, {
    resourceType: "image",
    folder: "reels-covers",
  });
}

export async function uploadReelAsset(
  file,
  options = {},
) {
  return uploadToCloudinary(file, options);
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
