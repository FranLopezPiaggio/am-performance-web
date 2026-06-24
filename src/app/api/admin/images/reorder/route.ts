import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

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

  try {
    const { productId, imageIds } = await request.json();

    if (!productId || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: 'productId y imageIds[] son requeridos' },
        { status: 400 }
      );
    }

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
