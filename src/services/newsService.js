import api from "./api";

export async function getNews() {
  const { data } = await api.get("/news");

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