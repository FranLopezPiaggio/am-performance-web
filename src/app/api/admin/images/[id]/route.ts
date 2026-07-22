import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { imageService } from '@/lib/services/image.service';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/admin/images/:id
 *
 * Elimina una imagen de Cloudinary y de la base de datos.
 * Usa ImageService.deleteImage que maneja:
 *   - public_id metadata (IMS)
 *   - URL legacy (pre-IMS)
 *   - Eliminación de DB
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const { success } = await imageService.deleteImage(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
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
