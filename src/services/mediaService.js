import api from "./api";
import { unwrapList } from "../utils/apiResponse";

// El listado de archivos vive en /api/media (protegido con JWT) y devuelve
// { data, pagination }.
export async function getMedia({ page = 1, limit = 50 } = {}) {
  const { data } = await api.get("/media", {
    params: { page, limit },
  });

  return unwrapList(data);
}

export async function getMediaById(id) {
  const { data } = await api.get(`/media/${encodeURIComponent(id)}`);
  return data;
}
