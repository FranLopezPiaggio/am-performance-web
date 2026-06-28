import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteAsset, extractPublicIdFromUrl } from '@/lib/services/image.service';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/admin/images/:id
 *
 * Elimina una imagen de Cloudinary y de la base de datos.
 * Extrae el public_id desde la URL guardada en product_images.image_url.
 * Soporta URLs de Cloudinary y URLs legacy de Supabase Storage (sin eliminar del storage).
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

    // ── Extract public_id from URL and delete from Cloudinary ──────
    // Cloudinary URL format: /image/upload/v{digits}/{public_id}
    // Si la URL no es de Cloudinary (ej: imagen legacy de Supabase), se salta
    // la destrucción del asset remoto pero igual elimina el registro de DB.
    const publicId = extractPublicIdFromUrl(image.image_url);

    if (publicId) {
      const { result } = await deleteAsset(publicId);

      if (result === 'error') {
        console.error('Cloudinary destroy error for public_id:', publicId);
        // Continuamos igual — eliminamos el registro de DB
      } else if (result === 'not found') {
        console.warn('Asset no encontrado en Cloudinary, puede que ya se haya eliminado:', publicId);
      }
    } else {
      console.warn(
        'URL de imagen no reconocida como Cloudinary, se omite destrucción remota:',
        image.image_url
      );
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
