import { getApiOrigin } from "./apiUrl";

const CLOUDINARY_IMAGE_MARKER = "/image/upload/";

const TRANSFORM_TOKENS =
  /(^|,)(f_|q_|w_|h_|c_|g_|e_|b_|ar_|dpr_|fl_|so_|x_|y_|r_|bo_|co_)/;

/**
 * Inserta una transformación de Cloudinary en imágenes.
 * Si la URL ya trae transformaciones, se respeta tal cual.
 */
function addCloudinaryImageTransform(url, width) {
  const markerIndex = url.indexOf(CLOUDINARY_IMAGE_MARKER);

  if (markerIndex === -1) {
    return url;
  }

  const start = markerIndex + CLOUDINARY_IMAGE_MARKER.length;
  const rest = url.slice(start);
  const firstSegment = rest.split("/")[0] || "";

  if (TRANSFORM_TOKENS.test(firstSegment)) {
    return url;
  }

  const transform = width
    ? `f_auto,q_auto,w_${width},c_limit`
    : "f_auto,q_auto";

  return `${url.slice(0, start)}${transform}/${rest}`;
}

/**
 * Resuelve una URL de media y, si es de Cloudinary, la sirve
 * en formato y calidad automáticos. `width` limita el ancho
 * entregado para no bajar imágenes más grandes de lo necesario.
 */
export function resolveMediaUrl(url, width = null) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return addCloudinaryImageTransform(url, width);
  }

  const origin = getApiOrigin();
  const absoluteUrl = `${origin}${url.startsWith("/") ? url : `/${url}`}`;

  return addCloudinaryImageTransform(absoluteUrl, width);
}
