import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, ratelimits } from '@/lib/rate-limit';
import { checkBodySize } from '@/lib/api-security';
import { getProjectLead, updateProjectLead } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

const patchProjectLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'quoted', 'won', 'lost']),
  assigned_to: z.string().uuid().optional(),
});

/**
 * GET /api/admin/projects/[id]
 * PATCH /api/admin/projects/[id] — actualiza status + assigned_to
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
    const project = await getProjectLead(supabase, id);

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching admin project:', error);
    return NextResponse.json(
      { error: 'Error al cargar el proyecto' },
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

  const sizeCheck = checkBodySize(req);
  if (sizeCheck) return sizeCheck;

  const rateLimitResponse = await checkRateLimit(req, ratelimits.admin);
  if (rateLimitResponse) return rateLimitResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = patchProjectLeadSchema.parse(body);
    const supabase = createAdminClient();

    await updateProjectLead(supabase, id, {
      status: parsed.status,
      assigned_to: parsed.assigned_to ?? null,
    });

    const updated = await getProjectLead(supabase, id);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      );
    }
    console.error('Error updating admin project:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el proyecto' },
      { status: 500 }
    );
  }
}
