import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getLeads, getLeadCount } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/leads
 *
 * Devuelve todos los leads (clientes) + total count.
 * Requiere sesión de administrador válida.
 */
export async function GET(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '', 10) || undefined;
    const offset = parseInt(url.searchParams.get('offset') || '', 10) || undefined;
    const supabase = createAdminClient();
    const [leads, total] = await Promise.all([
      getLeads(supabase, { limit, offset }),
      getLeadCount(supabase),
    ]);

    return NextResponse.json({ leads, total });
  } catch (error) {
    console.error('Error fetching admin leads:', error);
    return NextResponse.json(
      { error: 'Error al cargar los clientes' },
      { status: 500 }
    );
  }
}
