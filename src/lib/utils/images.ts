// src/lib/utils/images.ts

/**
 * Genera una URL de imagen robusta para productos.
 *
 * @param productName - El nombre del producto (usado para placeholders dinámicos en el futuro).
 * @param imageUrl - La URL de la imagen desde la base de datos. Puede ser nula o inválida.
 * @returns {string} - La URL de la imagen válida o la del placeholder.
 */
export const getProductImage = (
    productName: string,
    imageUrl: string | null | undefined
): string => {
    // 1. Validar que la URL exista, no esté vacía y sea un enlace HTTP/HTTPS.
    //    Añadimos una comprobación para que no sea un string vacío " ".
    const hasValidImage = imageUrl && imageUrl.trim() !== '' && imageUrl.startsWith('http');

    if (hasValidImage) {
        // Si la imagen de la BD es válida, la usamos.
        return imageUrl;
    }

    // 2. Si no hay imagen válida, usamos nuestro placeholder local.
    //    Esta es la ruta absoluta desde la raíz del sitio, porque está en /public.
    const PLACEHOLDER_PATH = '/img/download.jpg';

    return PLACEHOLDER_PATH;
};

/**
 * NOTA: Renombré la función de `getImage` a `getProductImage`.
 * Es una buena práctica para evitar conflictos y hacer el código más explícito.
 * Si prefieres mantener `getImage`, simplemente cambia el nombre en la exportación.
 */