import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getOrder, updateOrder, getOrderStatuses } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

const patchOrderSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  admin_notes: z.string().optional(),
});

/**
 * GET /api/admin/orders/[id]
 * PATCH /api/admin/orders/[id] — actualiza status + admin_notes
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const { id } = await params;

  try {
    const supabase = createAdminClient();
    const order = await getOrder(supabase, id);

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching admin order:', error);
    return NextResponse.json(
      { error: 'Error al cargar la orden' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = patchOrderSchema.parse(body);
    const supabase = createAdminClient();

    // Look up status_id from name
    const statuses = await getOrderStatuses(supabase);
    const status = statuses.find((s) => s.name === parsed.status);

    if (!status) {
      return NextResponse.json(
        { error: `Estado '${parsed.status}' no válido` },
        { status: 400 }
      );
    }

    await updateOrder(supabase, id, {
      status_id: status.id,
      admin_notes: parsed.admin_notes ?? null,
    });

    // Return updated order
    const updated = await getOrder(supabase, id);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      );
    }
    console.error('Error updating admin order:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la orden' },
      { status: 500 }
    );
  }
}
