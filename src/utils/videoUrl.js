const VIDEO_EXTENSIONS = /\.(mp4|m4v|webm|ogv|ogg|mov)(\?.*)?$/i;

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
