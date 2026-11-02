import api from "./api";

export async function getUsers() {
  const { data } = await api.get("/users");
  return data;
}

export async function createUser(user) {
  const { data } = await api.post("/users", user);
  return data;
}

export async function uploadUserAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/media", formData);

  return data.media;
}