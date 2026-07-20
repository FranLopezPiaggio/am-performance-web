import { NextResponse } from 'next/server';
import { z } from 'zod';
import { projectFormSchema } from '@/lib/validations/projects';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, ratelimits } from '@/lib/rate-limit';
import { checkBodySize } from '@/lib/api-security';
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
  const sizeCheck = checkBodySize(req);
  if (sizeCheck) return sizeCheck;

  const rateLimitResponse = await checkRateLimit(req, ratelimits.projects);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    // Honeypot: si el campo oculto tiene contenido, es un bot
    if (body.website) {
      return NextResponse.json({ success: true, recordId: '00000000-0000-0000-0000-000000000000' });
    }
    const parsed = createProjectLeadSchema.parse(body);
    const { customerInfo } = parsed;

    const supabase = createAdminClient();

    // 1. Split name into first/last (ponytail: split on first space)
    const [first_name, ...lastParts] = customerInfo.name.trim().split(' ');
    const last_name = lastParts.join(' ') || '';

    // 2. Upsert lead by email (table shared with checkout orders)
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .upsert({
        email: customerInfo.email,
        first_name,
        last_name,
        phone: customerInfo.phone,
        source: 'web',
      }, { onConflict: 'email' })
      .select('id')
      .single();

    if (leadError) throw leadError;

    // 3. Insert consultation
    const { data: consultation, error: consultError } = await supabase
      .from('project_consultations')
      .insert({
        lead_id: lead.id,
        address: `${customerInfo.address}, ${customerInfo.city}`,
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

    if (consultError) throw consultError;

    // ── Analytics ────────────────────────────────────────────────────
    captureEvent('project_lead_submitted', customerInfo.email, {
      lead_id: consultation.id,
      budget_range: customerInfo.budget,
      gym_type: customerInfo.gymStyle,
      square_meters: customerInfo.squareMeters
        ? parseInt(customerInfo.squareMeters, 10)
        : 0,
    });

    return NextResponse.json({ success: true, recordId: consultation.id });
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
