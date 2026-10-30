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
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post("/media", formData);

  return data.media;
}
