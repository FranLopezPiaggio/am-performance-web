import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { imageService } from '@/lib/services/image.service';
import { z } from 'zod';
import { checkBodySize } from '@/lib/api-security';

export const dynamic = 'force-dynamic';

// ── Validation ───────────────────────────────────────────────────────

const saveSchema = z.object({
  imageId: z.string().uuid('imageId debe ser un UUID válido'),
  publicId: z.string().min(1, 'publicId es requerido'),
  secureUrl: z.string().url('secureUrl debe ser una URL válida'),
  productId: z.string().uuid('productId debe ser un UUID válido'),
  altText: z.string().nullable().optional(),
  isPrimary: z.boolean().optional(),
  // Metadata de Cloudinary
  format: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  bytes: z.number().int().positive().optional(),
  originalFilename: z.string().optional(),
});

// ── Route ────────────────────────────────────────────────────────────

/**
 * POST /api/admin/images/save
 *
 * Persiste en la base de datos el resultado de un upload exitoso a Cloudinary.
 * Ahora guarda metadata completa (public_id, format, width, height, bytes, etc.).
 *
 * Este endpoint se llama DESPUÉS de que el cliente subió el archivo
 * directamente a Cloudinary (Direct Client-to-Cloud).
 *
 * Body esperado:
 *   { imageId, publicId, secureUrl, productId, altText?, isPrimary?, format?, width?, height?, bytes?, originalFilename? }
 *
 * Retorna:
 *   El registro de product_images creado
 */
export async function POST(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const sizeCheck = checkBodySize(request);
  if (sizeCheck) return sizeCheck;

  try {
    // ── Validate body ──────────────────────────────────────────────
    const body = await request.json();
    const parsed = saveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { imageId, publicId, secureUrl, productId, altText, isPrimary, format, width, height, bytes, originalFilename } = parsed.data;

    // ── Verify product exists ──────────────────────────────────────
    const supabase = createAdminClient();
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // ── Persist via ImageService ───────────────────────────────────
    const image = await imageService.saveUploadResult({
      imageId,
      publicId,
      secureUrl,
      productId,
      altText,
      isPrimary,
      format,
      width,
      height,
      bytes,
      originalFilename,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Image save error:', error);

    // ── Cleanup: si la DB falló, intentar eliminar el asset huérfano de Cloudinary ──
    try {
      const body = await request.clone().json();
      if (body.publicId) {
        const { cdnAdapter } = await import('@/lib/cloudinary/adapter');
        await cdnAdapter.delete(body.publicId);
        console.warn(`[CLEANUP] Asset huérfano eliminado: ${body.publicId}`);
      }
    } catch {
      // si falla el cleanup, al menos queda logueado arriba
    }

    return NextResponse.json(
      { error: 'Error al procesar el guardado de la imagen' },
      { status: 500 }
    );
  }
}
