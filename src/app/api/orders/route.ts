import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrderSchema } from '@/lib/validations/order';
import { createAdminClient } from '@/lib/supabase/admin';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { checkRateLimit, ratelimits } from '@/lib/rate-limit';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
});

const orderRequestSchema = createOrderSchema.extend({
  paymentMethod: z.enum(['whatsapp', 'mercadopago', 'transfer']).default('whatsapp'),
});

export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req, ratelimits.orders);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const parsed = orderRequestSchema.parse(body);
    const { customerInfo, cartItems, total, paymentMethod } = parsed;

    const supabase = createAdminClient();

    const { data: existingLead } = await supabase.from('leads')
      .select('id')
      .eq('email', customerInfo.email)
      .maybeSingle();

    let leadId: string;
    if (existingLead) {
      leadId = existingLead.id;
    } else {
      const { data: newLead, error: leadError } = await supabase.from('leads')
        .insert({
          email: customerInfo.email,
          first_name: customerInfo.nombre,
          last_name: '',
          phone: customerInfo.telefono,
          source: 'web',
          notes: customerInfo.notas || null,
        })
        .select('id')
        .single();

      if (leadError) throw leadError;
      leadId = newLead!.id;
    }

    const { data: address, error: addressError } = await supabase.from('addresses')
      .insert({
        lead_id: leadId,
        address_type: 'shipping',
        first_name: customerInfo.nombre,
        last_name: '',
        company: null,
        address_line_1: customerInfo.direccion,
        address_line_2: null,
        city: '',
        state: '',
        postal_code: '',
        country: 'AR',
        phone: customerInfo.telefono,
      })
      .select('id')
      .single();

    if (addressError) throw addressError;

    const { data: pendingStatus } = await supabase.from('order_statuses')
      .select('id')
      .eq('name', 'pending')
      .maybeSingle();

    let statusId: string;
    if (pendingStatus) {
      statusId = pendingStatus.id;
    } else {
      const { data: newStatus, error: statusError } = await supabase.from('order_statuses')
        .insert({
          name: 'pending',
          description: 'Pending payment',
          color: '#f59e0b',
          display_order: 1,
        })
        .select('id')
        .single();

      if (statusError) throw statusError;
      statusId = newStatus!.id;
    }

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data: order, error: orderError } = await supabase.from('orders')
      .insert({
        order_number: orderNumber,
        lead_id: leadId,
        status_id: statusId,
        shipping_address_id: address.id,
        billing_address_id: null,
        subtotal: total,
        discount_amount: 0,
        shipping_cost: 0,
        tax_amount: 0,
        total: total,
        currency: 'ARS',
        notes: customerInfo.notas || null,
        admin_notes: null,
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      variant_id: item.id,
      product_id: item.id,
      snapshot_product_name: item.name || '',
      snapshot_variant_name: 'Default',
      snapshot_sku: item.id,
      snapshot_price: item.price || 0,
      quantity: item.quantity,
      total: (item.price || 0) * item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    const response: { orderId: string; paymentUrl?: string; paymentExpiresAt?: string } = {
      orderId: order.id,
    };

    if (paymentMethod === 'mercadopago') {
      const preference = new Preference(mpClient);
      const mpItems = cartItems.map((item) => ({
        id: item.id,
        title: item.name || '',
        unit_price: Number(item.price || 0),
        quantity: Number(item.quantity),
        currency_id: 'ARS',
      }));

      const mpResponse = await preference.create({
        body: {
          items: mpItems,
          back_urls: {
            success: `${process.env.APP_URL}/pago-exitoso`,
            failure: `${process.env.APP_URL}/pago-fallido`,
            pending: `${process.env.APP_URL}/pago-fallido`,
          },
          auto_return: 'approved',
        },
      });

      response.paymentUrl = mpResponse.init_point;
    }

    if (paymentMethod === 'transfer') {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      response.paymentExpiresAt = expiresAt.toISOString();
    }

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      );
    }
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    );
  }
}
