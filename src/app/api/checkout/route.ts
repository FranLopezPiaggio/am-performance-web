import { NextResponse } from 'next/server';
import { z } from 'zod';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { checkRateLimit, ratelimits } from '@/lib/rate-limit';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
});

// ── Zod Schemas ─────────────────────────────────────────────────────

const checkoutItemSchema = z.object({
  id: z.string().min(1, 'El ID del producto es requerido'),
  name: z.string().min(1, 'El nombre del producto es requerido'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
});

const checkoutBodySchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'El carrito no puede estar vacío'),
  userId: z.string().optional(),
  orderId: z.string().optional(),
});

// ── Types ───────────────────────────────────────────────────────────

interface MercadoPagoItem {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  currency_id: string;
}

// ── Route Handler ───────────────────────────────────────────────────

/**
 * POST /api/checkout
 *
 * Crea una preferencia de pago en Mercado Pago.
 * Rate limit: 10 requests cada 10 segundos por IP.
 */
export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req, ratelimits.checkout);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const parsed = checkoutBodySchema.parse(body);
    const { items } = parsed;

    const preference = new Preference(client);

    const mercadoPagoItems: MercadoPagoItem[] = items.map((item) => ({
      id: item.id,
      title: item.name,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: 'ARS',
    }));

    const response = await preference.create({
      body: {
        items: mercadoPagoItems,
        back_urls: {
          success: `${process.env.APP_URL}/pago-exitoso`,
          failure: `${process.env.APP_URL}/pago-fallido`,
          pending: `${process.env.APP_URL}/pago-fallido`,
        },
        auto_return: 'approved',
      },
    });

    return NextResponse.json({ url: response.init_point });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      );
    }
    console.error('Mercado Pago Error:', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
}
