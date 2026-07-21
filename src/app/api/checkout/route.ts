import { NextResponse } from 'next/server';

// ── NOTA: Integración de Mercado Pago en standby ────────────────────
// El código comentado fue eliminado en security audit Wave 1
// porque contenía un price tampering vector (FIXME: resolver desde DB).
// Cuando se reactive Mercado Pago, reescribir desde cero con:
//   - precio resuelto desde DB, no del cliente
//   - rate limiting + body size check (ver src/app/api/projects/route.ts)

/**
 * POST /api/checkout
 *
 * Deshabilitado temporalmente — integración MP en standby.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Mercado Pago no disponible temporalmente' },
    { status: 503 }
  );
}


