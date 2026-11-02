/**
 * Lee la primera imagen del portapapeles y la devuelve como File.
 *
 * Lanza un Error con un mensaje listo para mostrar al usuario cuando el
 * navegador no soporta la API o cuando no hay ninguna imagen copiada.
 */
export async function readImageFromClipboard() {
  if (!navigator.clipboard || !navigator.clipboard.read) {
    throw new Error("Tu navegador no soporta pegar imágenes directamente.");
  }

  const items = await navigator.clipboard.read();

  for (const item of items) {
    const imageType = item.types.find((type) => type.startsWith("image/"));

    if (!imageType) continue;

    const blob = await item.getType(imageType);
    const extension = imageType.split("/")[1] || "png";

    return new File([blob], `pasted-image.${extension}`, { type: imageType });
  }

  throw new Error("No se encontró ninguna imagen en el portapapeles. Copia una imagen primero.");
}
