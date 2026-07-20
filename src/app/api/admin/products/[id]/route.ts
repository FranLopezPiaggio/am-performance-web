import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const patchProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  short_description: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  category_id: z.string().uuid().optional(),
  line_id: z.string().uuid().nullable().optional(),
  disciplines: z.array(z.string()).optional(),
});

/**
 * PATCH /api/admin/products/[id]
 *
 * Actualiza campos del producto (nombre, descripción, visibilidad, etc.).
 * Requiere sesión de administrador válida.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = patchProductSchema.parse(body);
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('products')
      .update(parsed as never)
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el producto' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      );
    }
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}
