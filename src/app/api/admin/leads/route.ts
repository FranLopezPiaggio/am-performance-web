import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getLeads } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/leads
 *
 * Devuelve todos los leads (clientes) + total count.
 * Requiere sesión de administrador válida.
 */
export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createAdminClient();
    const leads = await getLeads(supabase);

    return NextResponse.json({ leads, total: leads.length });
  } catch (error) {
    console.error('Error fetching admin leads:', error);
    return NextResponse.json(
      { error: 'Error al cargar los clientes' },
      { status: 500 }
    );
  }
}
