import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, ratelimits } from '@/lib/rate-limit';
import { checkBodySize } from '@/lib/api-security';

export const dynamic = 'force-dynamic';

const patchVariantSchema = z.object({
  stock: z.number().int().min(0).optional(),
  price: z.number().min(0).optional(),
  compare_at_price: z.number().min(0).nullable().optional(),
  cost_price: z.number().min(0).nullable().optional(),
  variant_name: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

/**
 * PATCH /api/admin/products/[id]/variants/[variantId]
 *
 * Actualiza campos de una variante de producto (stock, precio, visibilidad, etc.).
 * Requiere sesión de administrador válida.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const sizeCheck = checkBodySize(req);
  if (sizeCheck) return sizeCheck;

  const rateLimitResponse = await checkRateLimit(req, ratelimits.admin);
  if (rateLimitResponse) return rateLimitResponse;

  const { variantId } = await params;

  try {
    const body = await req.json();
    const parsed = patchVariantSchema.parse(body);
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('product_variants')
      .update(parsed as never)
      .eq('id', variantId);

    if (error) {
      console.error('Error updating variant:', error);
      return NextResponse.json(
        { error: 'Error al actualizar la variante' },
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
    console.error('Error updating variant:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la variante' },
      { status: 500 }
    );
  }
}
