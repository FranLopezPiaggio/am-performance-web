import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getLead, getLeadOrders } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/leads/[id]
 *
 * Devuelve un lead individual con sus órdenes asociadas.
 * Requiere sesión de administrador válida.
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
    const [lead, orders] = await Promise.all([
      getLead(supabase, id),
      getLeadOrders(supabase, id),
    ]);

    if (!lead) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead, orders });
  } catch (error) {
    console.error('Error fetching admin lead:', error);
    return NextResponse.json(
      { error: 'Error al cargar el cliente' },
      { status: 500 }
    );
  }
}
