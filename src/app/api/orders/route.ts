import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrderSchema } from '@/lib/validations/order';
import { createAdminClient } from '@/lib/supabase/admin';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { checkRateLimit, ratelimits } from '@/lib/rate-limit';
import { checkBodySize } from '@/lib/api-security';
import { captureEvent } from '@/lib/analytics/server';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
});

export async function POST(req: Request) {
  const sizeCheck = checkBodySize(req);
  if (sizeCheck) return sizeCheck;

  const rateLimitResponse = await checkRateLimit(req, ratelimits.orders);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const parsed = createOrderSchema.parse(body);
    const { customerInfo, cartItems, paymentMethod } = parsed;

    const supabase = createAdminClient();

    // ── Resolve variants from DB ──────────────────────────────────────
    const variantIds = cartItems.map(i => i.variant_id);
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, product_id, price, variant_name, sku, stock, products!inner(name)')
      .in('id', variantIds)
      .eq('is_active', true);

    if (variantsError) throw variantsError;

    if (!variants || variants.length !== variantIds.length) {
      return NextResponse.json(
        { error: 'Algunos productos de tu carrito ya no están disponibles. Eliminalos e intentá de nuevo.' },
        { status: 400 }
      );
    }

    // Build resolved items from DB data
    const cartQuantity = new Map(cartItems.map(i => [i.variant_id, i.quantity]));
    const resolvedItems = variants.map(v => {
      const p = (v.products as unknown as { name: string }[])[0];
      return {
        variant_id: v.id,
        product_id: v.product_id,
        product_name: p?.name || '',
        variant_name: v.variant_name,
        sku: v.sku,
        unit_price: Number(v.price),
        quantity: cartQuantity.get(v.id)!,
        stock: v.stock,
      };
    });

    // Stock validation
    const outOfStock = resolvedItems.filter(i => i.quantity > i.stock);
    if (outOfStock.length > 0) {
      return NextResponse.json(
        { error: 'Algunos productos no tienen stock suficiente. Revisá tu carrito.' },
        { status: 400 }
      );
    }

    const subtotal = resolvedItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const total = subtotal;

    // ── Lead ──────────────────────────────────────────────────────────
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

    // ── Address ───────────────────────────────────────────────────────
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

    // ── Status ────────────────────────────────────────────────────────
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

    // ── Order ─────────────────────────────────────────────────────────
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data: order, error: orderError } = await supabase.from('orders')
      .insert({
        order_number: orderNumber,
        lead_id: leadId,
        status_id: statusId,
        shipping_address_id: address.id,
        billing_address_id: null,
        subtotal,
        discount_amount: 0,
        shipping_cost: 0,
        tax_amount: 0,
        total,
        currency: 'ARS',
        notes: customerInfo.notas || null,
        admin_notes: null,
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    // ── Order items (with real DB prices) ──────────────────────────────
    const orderItems = resolvedItems.map(i => ({
      order_id: order.id,
      variant_id: i.variant_id,
      product_id: i.product_id,
      snapshot_product_name: i.product_name,
      snapshot_variant_name: i.variant_name,
      snapshot_sku: i.sku,
      snapshot_price: i.unit_price,
      quantity: i.quantity,
      total: i.unit_price * i.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // ── Response ──────────────────────────────────────────────────────
    const items = resolvedItems.map(i => ({
      name: i.product_name,
      variantName: i.variant_name,
      quantity: i.quantity,
      unitPrice: i.unit_price,
      total: i.unit_price * i.quantity,
    }));

    const response: {
      orderId: string;
      orderNumber: string;
      items: typeof items;
      total: number;
      paymentUrl?: string;
      paymentExpiresAt?: string;
    } = {
      orderId: order.id,
      orderNumber,
      items,
      total,
    };

    if (paymentMethod === 'mercadopago') {
      const preference = new Preference(mpClient);
      const mpItems = resolvedItems.map(i => ({
        id: i.variant_id,
        title: `${i.product_name} - ${i.variant_name}`,
        unit_price: i.unit_price,
        quantity: i.quantity,
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

    // ── Analytics ────────────────────────────────────────────────────
    captureEvent('order_created', customerInfo.email, {
      order_id: order.id,
      order_number: orderNumber,
      total,
      items_count: orderItems.length,
      payment_method: paymentMethod,
      currency: 'ARS',
    });

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
