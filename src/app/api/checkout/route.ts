import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
});

// Types for Mercado Pago items
interface MercadoPagoItem {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  currency_id: string;
}

interface CheckoutBody {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  userId?: string;
  orderId?: string;
}

export async function POST(req: Request) {
  try {
    const { items }: CheckoutBody = await req.json();

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
    console.error('Mercado Pago Error:', error);
    return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
  }
}
