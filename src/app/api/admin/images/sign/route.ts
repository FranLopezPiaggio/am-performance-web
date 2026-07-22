import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { imageService } from '@/lib/services/image.service';
import { z } from 'zod';
import { checkBodySize } from '@/lib/api-security';

export const dynamic = 'force-dynamic';

// ── Validation ───────────────────────────────────────────────────────

const signSchema = z.object({
  productId: z.string().uuid('productId debe ser un UUID válido'),
  originalName: z.string().min(1, 'originalName es requerido').max(255),
});

// ── Route ────────────────────────────────────────────────────────────

/**
 * POST /api/admin/images/sign
 *
 * Genera una firma de upload para Cloudinary (Direct Client-to-Cloud).
 * Construye el public_id con estructura IMS:
 *   AMPerformance/products/{productId}/{imageId}/{slug}
 *
 * El cliente debe:
 *   1. Llamar a este endpoint para obtener { signature, timestamp, apiKey, cloudName, folder, publicId, imageId }
 *   2. Subir el archivo DIRECTAMENTE a Cloudinary:
 *        POST https://api.cloudinary.com/v1_1/{cloudName}/image/upload
 *        Body: FormData con { file, api_key, timestamp, signature, folder, public_id }
 *   3. Llamar a POST /api/admin/images/save para persistir en DB
 *      Enviando imageId, publicId (el que devuelve Cloudinary), y los metadatos
 *
 * Body esperado:
 *   { productId: "uuid-del-producto", originalName: "nombre-del-archivo.jpg" }
 *
 * Retorna:
 *   { signature, timestamp, apiKey, cloudName, folder, publicId, imageId, allowedFormats, maxFileSize }
 */
export async function POST(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const sizeCheck = checkBodySize(request);
  if (sizeCheck) return sizeCheck;

  try {
    // ── Validate body ──────────────────────────────────────────────
    const body = await request.json();
    const parsed = signSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { productId, originalName } = parsed.data;

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

    // ── Generate signature ─────────────────────────────────────────
    const signature = imageService.generateUploadSignature(productId, originalName);

    return NextResponse.json(signature, { status: 200 });
  } catch (error) {
    console.error('Sign error:', error);
    return NextResponse.json(
      { error: 'Error al generar la firma de upload' },
      { status: 500 }
    );
  }
}
