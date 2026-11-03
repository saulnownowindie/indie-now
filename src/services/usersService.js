import api from "./api";
import { unwrapList } from "../utils/apiResponse";

export async function getUsers() {
  const { data } = await api.get("/users");
  return unwrapList(data);
}

export async function createUser(user) {
  const { data } = await api.post("/users", user);
  return data;
}

export async function updateUser(id, user) {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
}

export async function uploadUserAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/media", formData);

  return data.media;
}
