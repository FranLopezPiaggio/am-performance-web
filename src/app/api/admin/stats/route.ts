import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminKPIs } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/stats
 *
 * Devuelve las KPIs del dashboard admin (productos activos, órdenes, consultas, ingresos, etc.).
 * Requiere sesión de administrador válida.
 */
export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createAdminClient();
    const kpis = await getAdminKPIs(supabase);

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Error al cargar las estadísticas' },
      { status: 500 }
    );
  }
}
