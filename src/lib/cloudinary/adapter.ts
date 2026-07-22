// src/lib/cloudinary/adapter.ts
// CdnAdapter — abstrae el SDK de Cloudinary del resto del sistema
//
// Responsabilidad únicamente: firmar, subir (firma), borrar, existe, buildUrl.
// No conoce la base de datos, ni productos, ni negocio.
// El resto del sistema NUNCA importa cloudinary directo.

import 'server-only';
import crypto from 'crypto';
import cloudinary from '@/lib/cloudinary';
import { slugify } from '@/lib/utils/slugify';

// ─── Types ────────────────────────────────────────────────────────────

export interface UploadSignatureParams {
  productId: string;
  imageId: string;
  originalName: string;
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;      // solo el filename (slug)
  imageId: string;        // UUID pre-generado para la fila en DB
  allowedFormats: string;
  maxFileSize: number;
}

export interface DeleteResult {
  result: 'ok' | 'not found' | 'error';
}

// ─── Presets de transformación ────────────────────────────────────────

export interface PresetConfig {
  width?: number;
  height?: number;
  crop?: string;
  q?: number;
  f?: string;
}

const PRESETS: Record<string, PresetConfig> = {
  thumbnail: { width: 120, height: 120, crop: 'fill', q: 75, f: 'webp' },
  card:      { width: 400, height: 400, crop: 'fill', q: 80, f: 'webp' },
  gallery:   { width: 800, height: 800, crop: 'contain', q: 82, f: 'webp' },
  full:      { width: 1600, height: 1600, crop: 'contain', q: 85, f: 'webp' },
  original:  {},
} as const;

export type Preset = keyof typeof PRESETS;

// ─── Adapter ──────────────────────────────────────────────────────────

export const cdnAdapter = {
  /**
   * Genera una firma para upload directo del browser a Cloudinary.
   *
   * Construye el public_id con la estructura IMS:
   *   AMPerformance/products/{productId}/{imageId}/{slug}
   *
   * El imageId se genera acá (UUID), se devuelve en la respuesta,
   * y se usa como PK al insertar en product_images.
   */
  generateSignature(params: UploadSignatureParams): UploadSignature {
    const timestamp = Math.round(Date.now() / 1000);
    const imageId = crypto.randomUUID();
    const slug = slugify(params.originalName);
    const folder = `AMPerformance/products/${params.productId}/${imageId}`;
    const publicId = slug; // Cloudinary combina folder/public_id
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
      imageId,
      allowedFormats,
      maxFileSize,
    };
  },

  /**
   * Genera URL optimizada desde un public_id + preset.
   * El frontend NUNCA construye URLs manualmente.
   */
  buildUrl(publicId: string, preset: Preset = 'original'): string {
    const cfg = PRESETS[preset];
    return cloudinary.url(publicId, {
      secure: true,
      ...(cfg.width ? { width: cfg.width, crop: cfg.crop || 'fill' } : {}),
      ...(cfg.height ? { height: cfg.height } : {}),
      ...(cfg.q ? { quality: cfg.q } : {}),
      ...(cfg.f ? { fetch_format: cfg.f } : {}),
    });
  },

  /**
   * Construye URL con parámetros custom (para casos no cubiertos por presets).
   */
  buildCustomUrl(publicId: string, options: PresetConfig = {}): string {
    return cloudinary.url(publicId, {
      secure: true,
      ...(options.width ? { width: options.width, crop: options.crop || 'fill' } : {}),
      ...(options.height ? { height: options.height } : {}),
      ...(options.q ? { quality: options.q } : {}),
      ...(options.f ? { fetch_format: options.f } : {}),
    });
  },

  /**
   * Elimina un asset de Cloudinary por su public_id completo.
   */
  async delete(publicId: string): Promise<DeleteResult> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return { result: result.result as DeleteResult['result'] };
    } catch (error) {
      console.error('[CdnAdapter] delete error:', error);
      return { result: 'error' };
    }
  },

  /**
   * Verifica si un public_id existe en Cloudinary.
   */
  async exists(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'image',
      });
      return !!result;
    } catch {
      return false;
    }
  },
};

// ponytail: adapter singleton, no DI ni factory.
// Si en el futuro hay un segundo CDN, se abstrae con interface.
