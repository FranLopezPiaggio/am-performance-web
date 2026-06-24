import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminProductCount, getOrderCount, getProjectLeadCount } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/stats
 *
 * Devuelve los conteos del dashboard admin (productos activos, órdenes, proyectos).
 * Requiere sesión de administrador válida.
 */
export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createAdminClient();
    const [products, orders, projects] = await Promise.all([
      getAdminProductCount(supabase),
      getOrderCount(supabase),
      getProjectLeadCount(supabase),
    ]);

    return NextResponse.json({ products, orders, projects });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Error al cargar las estadísticas' },
      { status: 500 }
    );
  }
}
