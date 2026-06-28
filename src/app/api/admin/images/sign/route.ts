import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateUploadSignature } from '@/lib/services/image.service';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// ── Validation ───────────────────────────────────────────────────────

const signSchema = z.object({
  productId: z.string().uuid('productId debe ser un UUID válido'),
});

// ── Route ────────────────────────────────────────────────────────────

/**
 * POST /api/admin/images/sign
 *
 * Genera una firma de upload para Cloudinary (Direct Client-to-Cloud).
 *
 * El cliente debe:
 *   1. Llamar a este endpoint para obtener { signature, timestamp, apiKey, cloudName, folder, publicId }
 *   2. Subir el archivo DIRECTAMENTE a Cloudinary:
 *        POST https://api.cloudinary.com/v1_1/{cloudName}/image/upload
 *        Body: FormData con { file, api_key, timestamp, signature, folder, public_id }
 *   3. Llamar a POST /api/admin/images/save para persistir en DB
 *
 * Body esperado:
 *   { productId: "uuid-del-producto" }
 *
 * Retorna:
 *   { signature, timestamp, apiKey, cloudName, folder, publicId, allowedFormats, maxFileSize }
 */
export async function POST(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

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

    const { productId } = parsed.data;

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
    const signature = generateUploadSignature(productId);

    return NextResponse.json(signature, { status: 200 });
  } catch (error) {
    console.error('Sign error:', error);
    return NextResponse.json(
      { error: 'Error al generar la firma de upload' },
      { status: 500 }
    );
  }
}
