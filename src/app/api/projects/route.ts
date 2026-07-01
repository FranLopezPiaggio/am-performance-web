import { NextResponse } from 'next/server';
import { z } from 'zod';
import { projectFormSchema } from '@/lib/validations/projects';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, ratelimits } from '@/lib/rate-limit';
import { captureEvent } from '@/lib/analytics/server';

/**
 * Schema para la request entrante del formulario de proyectos.
 * El frontend envía { customerInfo: projectFormValues }
 */
const createProjectLeadSchema = z.object({
  customerInfo: projectFormSchema,
});

/**
 * POST /api/projects
 *
 * Crea un nuevo project lead desde el formulario público de proyectos.
 * No requiere autenticación (es un formulario público).
 * Usa service_role key para insertar (bypass de RLS).
 *
 * Request body: { customerInfo: { name, email, phone, address, city, squareMeters?, gymStyle, budget, requirements? } }
 * Success: { success: true, recordId: string }
 * Error:   { success: false, error: string }
 */
export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req, ratelimits.projects);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const parsed = createProjectLeadSchema.parse(body);
    const { customerInfo } = parsed;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('project_leads')
      .insert({
        client_name: customerInfo.name,
        client_email: customerInfo.email,
        client_phone: customerInfo.phone,
        client_address: `${customerInfo.address}, ${customerInfo.city}`,
        square_meters: customerInfo.squareMeters
          ? parseInt(customerInfo.squareMeters, 10)
          : 0,
        gym_type: customerInfo.gymStyle,
        budget_range: customerInfo.budget,
        additional_notes: customerInfo.requirements || null,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) throw error;

    // ── Analytics ────────────────────────────────────────────────────
    captureEvent('project_lead_submitted', customerInfo.email, {
      lead_id: data.id,
      budget_range: customerInfo.budget,
      gym_type: customerInfo.gymStyle,
      square_meters: customerInfo.squareMeters
        ? parseInt(customerInfo.squareMeters, 10)
        : 0,
    });

    return NextResponse.json({ success: true, recordId: data.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      );
    }

    console.error('Project lead creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
