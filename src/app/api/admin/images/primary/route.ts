import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

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

  try {
    const { imageId, productId } = await request.json();

    if (!imageId || !productId) {
      return NextResponse.json(
        { error: 'imageId y productId son requeridos' },
        { status: 400 }
      );
    }

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
