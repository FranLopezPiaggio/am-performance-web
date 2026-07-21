// src/lib/services/image.service.ts
// Cloudinary image operations — SERVER SIDE ONLY
//
// Patrón: Direct Client-to-Cloud con Backend Signing
// 1. El servidor genera una firma (signature) para params específicos
// 2. El cliente sube el archivo DIRECTAMENTE a Cloudinary usando esa firma
// 3. El cliente notifica al servidor para persistir el resultado en DB
//
// Beneficio: los bytes de imagen NUNCA pasan por Vercel serverless

import crypto from 'crypto';
import cloudinary from '@/lib/cloudinary';

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

export interface UploadSignature {
  /** SHA1 hash de los params firmados + api_secret */
  signature: string;
  /** Unix timestamp (segundos) en que se generó la firma */
  timestamp: number;
  /** Cloudinary API Key (público, necesario para el upload) */
  apiKey: string;
  /** Cloudinary Cloud Name (público, necesario para la URL de upload) */
  cloudName: string;
  /** Carpeta destino dentro de Cloudinary */
  folder: string;
  /** Public ID único para identificar el asset */
  publicId: string;
  /** Formatos de archivo permitidos (comma-separated) */
  allowedFormats: string;
  /** Tamaño máximo en bytes */
  maxFileSize: number;
}

export interface UploadApiResponse {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  [key: string]: unknown;
}

export interface DestroyResult {
  result: 'ok' | 'not found' | 'error';
}

// ─────────────────────────────────────────────────────────────────────
// Upload Signature
// ─────────────────────────────────────────────────────────────────────

/**
 * Genera una firma para upload directo desde el cliente a Cloudinary.
 *
 * El cliente usará estos valores para hacer un POST a:
 *   https://api.cloudinary.com/v1_1/{cloudName}/image/upload
 *
 * @param productId - UUID del producto al que pertenece la imagen
 * @returns Payload que el cliente necesita para el upload directo
 */
export function generateUploadSignature(productId: string): UploadSignature {
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = crypto.randomUUID();
  const folder = `products/${productId}`;
  const allowedFormats = 'webp,jpeg,png,avif';
  const maxFileSize = 5 * 1024 * 1024; // 5 MB

  const paramsToSign: Record<string, string | number> = {
    folder,
    public_id: publicId,
    timestamp,
    allowed_formats: allowedFormats,
    max_file_size: maxFileSize,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    folder,
    publicId,
    allowedFormats,
    maxFileSize,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────────────────

/**
 * Elimina un asset de Cloudinary por su public_id.
 *
 * @param publicId - El public_id del asset (ej: "products/uuid/uuid")
 * @returns Resultado de la operación ({ result: 'ok' | 'not found' | 'error' })
 */
export async function deleteAsset(publicId: string): Promise<DestroyResult> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { result: result.result as DestroyResult['result'] };
  } catch (error) {
    console.error('Cloudinary destroy error:', error);
    return { result: 'error' };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Optimized URL
// ─────────────────────────────────────────────────────────────────────

/**
 * Genera una URL optimizada para un asset de Cloudinary.
 * Usa f_auto (formato automático) y q_auto (calidad automática)
 * para servir el mejor formato/tamaño según el browser del cliente.
 *
 * @param publicId - El public_id del asset
 * @param width - Opcional: ancho en px para redimensionar
 * @param crop - Opcional: modo de crop (default: 'fill')
 * @returns URL optimizada absoluta (https)
 */
export function getOptimizedUrl(publicId: string, width?: number, crop: string = 'fill'): string {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
    ...(width ? { width, crop } : {}),
  });
}

// ─────────────────────────────────────────────────────────────────────
// URL Parsing
// ─────────────────────────────────────────────────────────────────────

/**
 * Extrae el public_id desde una URL de Cloudinary.
 *
 * Maneja estos formatos de URL:
 *   /image/upload/v{digits}/{public_id}.{ext}
 *   /image/upload/{transforms}/v{digits}/{public_id}.{ext}
 *
 * @param url - URL de Cloudinary (secure_url)
 * @returns public_id o null si no es una URL de Cloudinary válida
 *
 * @example
 *   extractPublicIdFromUrl(
 *     'https://res.cloudinary.com/.../image/upload/v1234/products/abc/def.webp'
 *   )
 *   // → 'products/abc/def'
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Match: /image/upload/ (optional transforms) /v{digits}/ (rest)
    const match = pathname.match(/\/image\/upload\/(?:[^/]+\/)?v\d+\/(.+)$/);
    if (!match) return null;

    const fullPath = match[1];
    // Remove file extension if present
    return fullPath.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}
