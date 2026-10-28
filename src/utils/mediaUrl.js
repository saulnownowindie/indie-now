import { getApiOrigin } from "./apiUrl";

export function resolveMediaUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const origin = getApiOrigin();

  return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
}
