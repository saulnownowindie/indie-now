const VIDEO_EXTENSIONS = /\.(mp4|m4v|webm|ogv|ogg|mov)(\?.*)?$/i;

const TRANSFORM_TOKENS =
  /(^|,)(f_|q_|w_|h_|c_|g_|e_|b_|ar_|dpr_|fl_|so_|x_|y_|r_|bo_|co_)/;

/**
 * Detecta si una URL apunta a un archivo de video reproducible
 * directamente con la etiqueta <video>.
 */
export function isDirectVideoUrl(value) {
  if (!value || typeof value !== "string") return false;

  try {
    const url = new URL(value, "https://indie-now.local");

    return VIDEO_EXTENSIONS.test(url.pathname);
  } catch {
    return false;
  }
}

function insertCloudinaryTransform(url, resourceType, transform) {
  if (!url || typeof url !== "string") return url;

  const marker = `/${resourceType}/upload/`;
  const index = url.indexOf(marker);

  if (index === -1) return url;

  const start = index + marker.length;
  const rest = url.slice(start);
  const firstSegment = rest.split("/")[0] || "";

  if (TRANSFORM_TOKENS.test(firstSegment)) {
    return url;
  }

  return `${url.slice(0, start)}${transform}/${rest}`;
}

/** Inserta optimizaciones de Cloudinary en el clip de preview. */
export function getPreviewVideoUrl(url) {
  return insertCloudinaryTransform(url, "video", "f_auto,q_auto");
}

/** Inserta optimizaciones de Cloudinary en el poster del preview. */
export function getPreviewPosterUrl(url) {
  return insertCloudinaryTransform(url, "image", "f_auto,q_auto,w_360");
}

/** Obtiene el ID de un video de YouTube desde cualquiera de sus formatos. */
export function getYouTubeVideoId(value) {
  if (!value || typeof value !== "string") return null;

  try {
    const url = new URL(value, "https://indie-now.local");
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (!host.endsWith("youtube.com")) {
      return null;
    }

    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/")[2] || null;
    }

    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2] || null;
    }

    return url.searchParams.get("v");
  } catch {
    return null;
  }
}

export function isYouTubeUrl(value) {
  if (!value || typeof value !== "string") return false;

  try {
    const host = new URL(value, "https://indie-now.local").hostname
      .replace(/^www\./, "")
      .toLowerCase();

    return host === "youtu.be" || host.endsWith("youtube.com");
  } catch {
    return false;
  }
}
