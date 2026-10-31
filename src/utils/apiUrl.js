const DEV_API_URL =
  typeof window !== "undefined"
    ? `http://${window.location.hostname}:3000/api`
    : "http://localhost:3000/api";

function normalizeApiUrl(url) {
  const base = (url || "").trim() || (import.meta.env.DEV ? DEV_API_URL : "");

  if (!base) {
    console.error("Falta VITE_API_URL en el entorno de producción.");
    return "/api";
  }

  const normalized = base.replace(/\/+$/, "");

  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

export function getApiBaseUrl() {
  return normalizeApiUrl(import.meta.env.VITE_API_URL);
}

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api$/, "");
}