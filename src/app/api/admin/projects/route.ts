import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getProjectLeads, getProjectLeadCount } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/projects
 *
 * Devuelve todos los project leads + total count.
 * Requiere sesión de administrador válida.
 */
export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createAdminClient();
    const [projects, total] = await Promise.all([
      getProjectLeads(supabase),
      getProjectLeadCount(supabase),
    ]);

    return NextResponse.json({ projects, total });
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    return NextResponse.json(
      { error: 'Error al cargar los proyectos' },
      { status: 500 }
    );
  }
}
