import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkBodySize } from '@/lib/api-security';

export const dynamic = 'force-dynamic';

// ── Validation ───────────────────────────────────────────────────────

const reorderSchema = z.object({
  productId: z.string().uuid('productId debe ser un UUID válido'),
  imageIds: z.array(z.string().uuid()).min(1, 'imageIds debe tener al menos un UUID'),
});

/**
 * POST /api/admin/images/reorder
 *
 * Actualiza el display_order de múltiples imágenes de un producto.
 * Body: { productId: string, imageIds: string[] }
 * El orden en el array determina el nuevo display_order (0-based).
 */
export async function POST(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const sizeCheck = checkBodySize(request);
  if (sizeCheck) return sizeCheck;

  try {
    const body = await request.json();
    const parsed = reorderSchema.parse(body);
    const { productId, imageIds } = parsed;

    const supabase = createAdminClient();

    // Update display_order for each image based on its position in the array
    const updates = imageIds.map((id: string, index: number) =>
      supabase
        .from('product_images')
        .update({ display_order: index })
        .eq('id', id)
        .eq('product_id', productId)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Image reorder error:', error);
    return NextResponse.json(
      { error: 'Error al reordenar las imágenes' },
      { status: 500 }
    );
  }
}
