import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkBodySize } from '@/lib/api-security';

export const dynamic = 'force-dynamic';

// ── Validation ───────────────────────────────────────────────────────

const primarySchema = z.object({
  imageId: z.string().uuid('imageId debe ser un UUID válido'),
  productId: z.string().uuid('productId debe ser un UUID válido'),
});

/**
 * POST /api/admin/images/primary
 *
 * Establece una imagen como la principal (is_primary = true) para un producto.
 * Desmarca automáticamente cualquier otra imagen que fuera primary del mismo producto.
 * Body: { imageId: string, productId: string }
 */
export async function POST(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const sizeCheck = checkBodySize(request);
  if (sizeCheck) return sizeCheck;

  try {
    const body = await request.json();
    const parsed = primarySchema.parse(body);
    const { imageId, productId } = parsed;

    const supabase = createAdminClient();

    // Unmark all images for this product
    const { error: unmarkError } = await supabase
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', productId)
      .eq('is_primary', true);

    if (unmarkError) {
      console.error('DB unmark error:', unmarkError);
      return NextResponse.json(
        { error: 'Error al actualizar las imágenes' },
        { status: 500 }
      );
    }

    // Mark the selected image as primary
    const { error: markError } = await supabase
      .from('product_images')
      .update({ is_primary: true })
      .eq('id', imageId)
      .eq('product_id', productId);

    if (markError) {
      console.error('DB primary update error:', markError);
      return NextResponse.json(
        { error: 'Error al establecer la imagen principal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Image primary error:', error);
    return NextResponse.json(
      { error: 'Error al establecer la imagen principal' },
      { status: 500 }
    );
  }
}
