import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/admin/images/:id
 *
 * Elimina una imagen del storage y de la base de datos.
 * Extrae el storage path desde la public URL guardada en product_images.image_url.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // ── Get the image record ────────────────────────────────────────
    const { data: image, error: fetchError } = await supabase
      .from('product_images')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !image) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    // ── Extract storage path from public URL ────────────────────────
    // URL format: /storage/v1/object/public/product-images/{productId}/{filename}
    try {
      const url = new URL(image.image_url);
      const pathPrefix = '/object/public/product-images/';
      const pathIndex = url.pathname.indexOf(pathPrefix);

      if (pathIndex !== -1) {
        const storagePath = url.pathname.slice(pathIndex + pathPrefix.length);

        const { error: deleteError } = await supabase.storage
          .from('product-images')
          .remove([storagePath]);

        if (deleteError) {
          console.error('Storage delete error:', deleteError);
          // Continue anyway — remove the DB record
        }
      }
    } catch {
      // If URL parsing fails, still try to delete the DB record
      console.warn('Could not parse image URL for storage deletion:', image.image_url);
    }

    // ── Delete from product_images ──────────────────────────────────
    const { error: dbDeleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', id);

    if (dbDeleteError) {
      console.error('DB delete error:', dbDeleteError);
      return NextResponse.json(
        { error: 'Error al eliminar la imagen de la base de datos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la imagen' },
      { status: 500 }
    );
  }
}
