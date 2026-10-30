import api from "./api";

export async function getNews() {
  const { data } = await api.get("/news");
  return data;
}

export async function getPublicNews(section) {
  const { data } = await api.get("/news/public", {
    params: section ? { section } : undefined,
  });
  return data;
}

export async function getPublicNewsBySlug(slug) {
  const { data } = await api.get(`/news/${encodeURIComponent(slug)}`);
  return data;
}

export async function createNews(news) {
  const { data } = await api.post("/news", news);
  return data;
}

export async function updateNews(id, news) {
  const { data } = await api.put(`/news/${id}`, news);
  return data;
}

export async function deleteNews(id) {
  const { data } = await api.delete(`/news/${id}`);
  return data;
}

export async function uploadNewsCover(file) {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post("/media", formData, {
    params: { folder: "news" },
  });

  return data.media;
}