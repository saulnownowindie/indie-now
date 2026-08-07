import api from "./client";

export async function getNews() {
  const { data } = await api.get("/news");
  return data;
}