import api from "./api";

export async function getMerch() {
  const { data } = await api.get("/merch");
  return data;
}

export async function getPublicMerch() {
  const { data } = await api.get("/merch");
  return data;
}

export async function createMerch(merch) {
  const { data } = await api.post("/merch", merch);
  return data;
}

export async function updateMerch(id, merch) {
  const { data } = await api.put(`/merch/${id}`, merch);
  return data;
}

export async function deleteMerch(id) {
  const { data } = await api.delete(`/merch/${id}`);
  return data;
}

export async function uploadMerchCover(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/media", formData, {
    params: { folder: "merch" },
  });
  return data.media;
}