// src/lib/services/image.service.ts
// ImageService — único punto de entrada al dominio de imágenes
//
// Orquesta operaciones entre CdnAdapter (Cloudinary) e ImageRepository (DB).
// El resto del sistema JAMÁS importa cloudinary ni supabase directamente.
//
// Flujo de upload (Direct Client-to-Cloud con Backend Signing):
//   1. generateUploadSignature() → firma
//   2. Cliente sube DIRECTAMENTE a Cloudinary (los bytes no pasan por Vercel)
//   3. saveUploadResult() → persiste metadata en DB

import 'server-only';
import { cdnAdapter } from '@/lib/cloudinary/adapter';
import { imageRepository } from '@/lib/repositories/image.repository';
import crypto from 'crypto';
import { slugify } from '@/lib/utils/slugify';
import type { UploadSignature, Preset } from '@/lib/cloudinary/adapter';
import type { ProductImage } from '@/types/database';

// ─── Re-export para compatibilidad ────────────────────────────────────

export type { UploadSignature, Preset } from '@/lib/cloudinary/adapter';
export type { DeleteResult } from '@/lib/cloudinary/adapter';

// ─── Types ────────────────────────────────────────────────────────────

export interface SaveUploadInput {
  /** Pre-generated image UUID from the signature step */
  imageId: string;
  /** Cloudinary public_id (full path, ej: AMPerformance/products/{pid}/{iid}/{slug}) */
  publicId: string;
  /** Cloudinary secure_url */
  secureUrl: string;
  productId: string;
  /** Opcional para upload desde admin */
  altText?: string | null;
  isPrimary?: boolean;
  /** Metadata que Cloudinary devuelve post-upload */
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  originalFilename?: string;
}

// ─── Service ──────────────────────────────────────────────────────────

export const imageService = {
  // ─── Upload ───────────────────────────────────────────────────────

  /**
   * Genera firma para upload directo desde el browser.
   * Construye el public_id con estructura IMS:
   *   AMPerformance/products/{productId}/{imageId}/{slug}
   *
   * @param productId UUID del producto
   * @param originalName Nombre original del archivo (para slug)
   */
  generateUploadSignature(productId: string, originalName: string): UploadSignature {
    return cdnAdapter.generateSignature({ productId, imageId: crypto.randomUUID(), originalName });
  },

  /**
   * Persiste en DB el resultado de un upload exitoso a Cloudinary.
   * Se llama DESPUÉS de que el cliente subió el archivo directo a Cloudinary.
   */
  async saveUploadResult(input: SaveUploadInput): Promise<ProductImage> {
    const {
      imageId, publicId, secureUrl, productId,
      altText, isPrimary, format, width, height, bytes, originalFilename,
    } = input;

    const supabase = (await import('@/lib/supabase/admin')).createAdminClient();

    // Si es primary, desmarcar la anterior
    if (isPrimary) {
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId)
        .eq('is_primary', true);
    }

    // Próximo display_order
    const { data: maxOrder } = await supabase
      .from('product_images')
      .select('display_order')
      .eq('product_id', productId)
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrder?.display_order ?? -1) + 1;
    const slug = slugify(originalFilename || 'imagen');

    // Extraer folder del public_id (todo menos el último segmento)
    const folder = publicId.includes('/') ? publicId.split('/').slice(0, -1).join('/') : '';

    return imageRepository.insert({
      id: imageId,
      product_id: productId,
      image_url: secureUrl,
      alt_text: altText ?? null,
      display_order: nextOrder,
      is_primary: isPrimary ?? nextOrder === 0,
      public_id: publicId,
      folder,
      original_name: originalFilename ?? null,
      slugified_name: slug,
      format: format ?? null,
      width: width ?? null,
      height: height ?? null,
      bytes: bytes ?? null,
      mime_type: format ? `image/${format}` : null,
    });
  },

  // ─── URL generation ───────────────────────────────────────────────

  /**
   * Genera URL optimizada desde la metadata de la imagen + preset.
   *
   * Si la imagen no tiene public_id (legacy), devuelve image_url sin cambios.
   * Así el frontend puede usar getUrl() siempre, incluso con datos legacy.
   *
   * @param image Registro de product_images
   * @param preset Preset de transformación
   */
  getUrl(image: ProductImage, preset: Preset = 'card'): string {
    if (!image.public_id) return image.image_url; // legacy fallback
    return cdnAdapter.buildUrl(image.public_id, preset);
  },

  /**
   * Genera URL con transformación custom (para casos no cubiertos por presets).
   */
  getCustomUrl(image: ProductImage, options: { width?: number; height?: number; crop?: string; q?: number }): string {
    if (!image.public_id) return image.image_url; // legacy fallback
    return cdnAdapter.buildCustomUrl(image.public_id, options);
  },

  // ─── Delete ───────────────────────────────────────────────────────

  /**
   * Elimina una imagen: del CDN y de la DB.
   * Flujo síncrono (MVP). En el futuro: markPendingDelete + cron.
   */
  async deleteImage(imageId: string): Promise<{ success: boolean }> {
    const image = await imageRepository.findById(imageId);
    if (!image) return { success: false };

    // Si tiene public_id, eliminar del CDN
    if (image.public_id) {
      const { result } = await cdnAdapter.delete(image.public_id);
      if (result === 'error') {
        console.error('[ImageService] CDN delete error for:', image.public_id);
        // Continuamos igual — eliminamos el registro de DB
      }
    } else if (image.image_url?.includes('res.cloudinary.com')) {
      // Fallback: extraer public_id de la URL (datos legacy)
      const pid = extractPublicIdFromUrl(image.image_url);
      if (pid) await cdnAdapter.delete(pid);
    }

    await imageRepository.hardDelete(imageId);
    return { success: true };
  },

  // ─── Query ────────────────────────────────────────────────────────

  /** Obtiene todas las imágenes de un producto */
  async getByProduct(productId: string): Promise<ProductImage[]> {
    return imageRepository.findByProduct(productId);
  },

  // ─── Reconciliación (cron) ────────────────────────────────────────

  /**
   * Limpia imágenes marcadas como pending_delete.
   * Ejecutado por Vercel Cron cada 2-3 días.
   */
  async reconcileOrphans(limit = 50): Promise<{
    processed: number; purged: number; failed: number; skipped: number;
  }> {
    const pending = await imageRepository.findPendingDelete(limit);
    let purged = 0;
    let failed = 0;
    let skipped = 0;

    for (const image of pending) {
      if (!image.public_id) {
        // Metadata sin archivo físico: hardDelete directo
        await imageRepository.hardDelete(image.id);
        skipped++;
        continue;
      }

      const { result } = await cdnAdapter.delete(image.public_id);

      if (result === 'ok' || result === 'not found') {
        await imageRepository.hardDelete(image.id);
        purged++;
      } else {
        const attempts = (image.delete_attempts || 0) + 1;
        if (attempts > 3) {
          await imageRepository.markFailed(image.id);
          console.error(`[ImageService] Purge failed after 3 attempts: ${image.public_id}`);
        } else {
          // Incrementar intentos
          await imageRepository.update(image.id, { delete_attempts: attempts });
        }
        failed++;
      }
    }

    return { processed: pending.length, purged, failed, skipped };
  },
};

// ─── Legacy helpers (mantenidos para compatibilidad) ──────────────────

/**
 * Extrae el public_id desde una URL de Cloudinary.
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/\/image\/upload\/(?:[^/]+\/)?v\d+\/(.+)$/);
    if (!match) return null;
    return match[1].replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

/**
 * Genera URL optimizada (legacy — usar imageService.getUrl en nuevo código).
 */
export function getOptimizedUrl(publicId: string, width?: number, crop = 'fill'): string {
  return cdnAdapter.buildCustomUrl(publicId, { width, crop, f: 'webp', q: 80 });
}



// ponytail: service singleton. Sin clase ni DI.
// Si en el futuro hay mocking, se extrae interface.
