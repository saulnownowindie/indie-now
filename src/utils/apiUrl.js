const DEFAULT_API_URL = "http://localhost:3000/api";

function normalizeApiUrl(url) {
  const normalized = (url || DEFAULT_API_URL)
    .trim()
    .replace(/\/+$/, "");

  return normalized.endsWith("/api")
    ? normalized
    : `${normalized}/api`;
}

export function getApiBaseUrl() {
  return normalizeApiUrl(import.meta.env.VITE_API_URL);
}

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api$/, "");
}
