import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getOrders, getOrderCount } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/orders
 *
 * Devuelve todas las órdenes + total count.
 * Requiere sesión de administrador válida (vía cookie de Supabase Auth).
 * Usa service_role key para bypass de RLS (que no existe).
 */
export async function GET(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '', 10) || undefined;
    const offset = parseInt(url.searchParams.get('offset') || '', 10) || undefined;
    const supabase = createAdminClient();
    const [orders, total] = await Promise.all([
      getOrders(supabase, { limit, offset }),
      getOrderCount(supabase),
    ]);

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { error: 'Error al cargar las órdenes' },
      { status: 500 }
    );
  }
}
