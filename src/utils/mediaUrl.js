export function resolveMediaUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const origin = apiUrl.replace(/\/api\/?$/, "");

  return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
}
