import axios from "axios";
import { getStoredToken } from "./authService";
import { getApiBaseUrl } from "../utils/apiUrl";

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
