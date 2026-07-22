// src/lib/utils/images.ts

/**
 * Inserta f_auto,q_auto en una URL de Cloudinary para servir
 * el formato óptimo (WebP/AVIF) con calidad automática.
 * Si la URL no es de Cloudinary, la devuelve sin cambios.
 */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}

/**
 * Genera una URL de imagen robusta para productos.
 * Aplica optimización Cloudinary si corresponde.
 *
 * @param productName - El nombre del producto (usado para placeholders dinámicos en el futuro).
 * @param imageUrl - La URL de la imagen desde la base de datos. Puede ser nula o inválida.
 * @returns {string} - La URL de la imagen válida o la del placeholder.
 */
export const getProductImage = (
    productName: string,
    imageUrl: string | null | undefined
): string => {
    const hasValidImage = imageUrl && imageUrl.trim() !== '' && imageUrl.startsWith('http');

    if (hasValidImage) {
        return optimizeCloudinaryUrl(imageUrl);
    }

    return '/img/download.jpg';
};