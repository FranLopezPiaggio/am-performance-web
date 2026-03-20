import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WHATSAPP_NUMBER = process.env.WHATSAPP_BUSINESS_NUMBER || '';
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || '';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CustomerData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  notas?: string;
}

interface OrderBody {
  items: OrderItem[];
  customer: CustomerData;
  total: number;
}

function generateWhatsAppMessage(customer: CustomerData, items: OrderItem[], total: number): string {
  const itemsList = items
    .map((item) => `• ${item.name} x${item.quantity} - $${item.price.toLocaleString()}`)
    .join('\n');

  const message = `*¡Nuevo Pedido!*
━━━━━━━━━━━━━━━
👤 Cliente: ${customer.nombre}
📧 Email: ${customer.email}
📱 Tel: ${customer.telefono}
📍 Dirección: ${customer.direccion}
${customer.notas ? `📝 Notas: ${customer.notas}` : ''}
━━━━━━━━━━━━━━━
*Productos:*
${itemsList}
━━━━━━━━━━━━━━━
*Total: $${total.toLocaleString()}*`;

  return message;
}

function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export async function POST(req: Request) {
  try {
    const { items, customer, total }: OrderBody = await req.json();

    if (!customer.nombre || !customer.email || !customer.telefono || !customer.direccion) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos del cliente' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer.nombre,
        customer_email: customer.email,
        customer_phone: customer.telefono,
        shipping_address: customer.direccion,
        notes: customer.notas || null,
        total: total,
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Error al crear el pedido' },
        { status: 500 }
      );
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Error al guardar los productos del pedido' },
        { status: 500 }
      );
    }

    const whatsappMessage = generateWhatsAppMessage(customer, items, total);
    const whatsappUrl = getWhatsAppUrl(WHATSAPP_NUMBER, whatsappMessage);

    return NextResponse.json({
      orderId: order.id,
      whatsappUrl,
      message: 'Pedido creado exitosamente',
    });

  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
