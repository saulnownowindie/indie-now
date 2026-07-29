import api from "./api";

export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getStoredToken() {
  return localStorage.getItem("token");
}