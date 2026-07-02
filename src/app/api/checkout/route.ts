import { NextResponse } from 'next/server';

// ── NOTA: Integración de Mercado Pago en standby ────────────────────
// El código completo del POST handler está comentado al final de este archivo.
// Cuando se reactive Mercado Pago:
//   1. Borrar este handler stub
//   2. Descomentar el bloque de abajo
//   3. Revisar el price tampering — el precio debe resolverse desde DB,
//      no aceptarse del cliente.

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

// ═════════════════════════════════════════════════════════════════════
// CÓDIGO MP DESHABILITADO (reemplazar el handler stub de arriba)
// ═════════════════════════════════════════════════════════════════════
//
// import { MercadoPagoConfig, Preference } from 'mercadopago';
// import { checkRateLimit, ratelimits } from '@/lib/rate-limit';
// import { checkBodySize } from '@/lib/api-security';
//
// const client = new MercadoPagoConfig({
//   accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
// });
//
// const checkoutBodySchema = z.object({
//   items: z.array(z.object({
//     id: z.string().min(1),
//     name: z.string().min(1),
//     price: z.number().min(0),       // FIXME: resolver desde DB, no del cliente
//     quantity: z.number().min(1),
//   })).min(1, 'El carrito no puede estar vacío'),
//   userId: z.string().optional(),
//   orderId: z.string().optional(),
// });
//
// export async function POST(req: Request) {
//   const rateLimitResponse = await checkRateLimit(req, ratelimits.checkout);
//   if (rateLimitResponse) return rateLimitResponse;
//
//   try {
//     const body = await req.json();
//     const parsed = checkoutBodySchema.parse(body);
//     const { items } = parsed;
//
//     const preference = new Preference(client);
//     const mpItems = items.map((item) => ({
//       id: item.id,
//       title: item.name,
//       unit_price: Number(item.price),
//       quantity: Number(item.quantity),
//       currency_id: 'ARS',
//     }));
//
//     const response = await preference.create({
//       body: {
//         items: mpItems,
//         back_urls: {
//           success: `${process.env.APP_URL}/pago-exitoso`,
//           failure: `${process.env.APP_URL}/pago-fallido`,
//           pending: `${process.env.APP_URL}/pago-fallido`,
//         },
//         auto_return: 'approved',
//       },
//     });
//
//     return NextResponse.json({ url: response.init_point });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: error.issues[0]?.message || 'Datos inválidos' },
//         { status: 400 }
//       );
//     }
//     console.error('Mercado Pago Error:', error);
//     return NextResponse.json(
//       { error: 'Error al crear la preferencia de pago' },
//       { status: 500 }
//     );
//   }
// }
