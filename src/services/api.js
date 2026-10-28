import axios from "axios";
import { getStoredToken } from "./authService";

const configuredBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const baseURL = configuredBaseUrl.endsWith("/api")
  ? configuredBaseUrl
  : `${configuredBaseUrl}/api`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;