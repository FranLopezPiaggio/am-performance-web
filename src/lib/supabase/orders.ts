import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Order, OrderItem } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface ValidatedOrderData {
  customerInfo: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    notas?: string;
  };
  cartItems: Array<{
    id: string;
    name?: string;
    price?: number;
    quantity: number;
    image?: string;
    category?: string;
  }>;
  total: number;
}

export async function saveOrderToDatabase(validatedData: ValidatedOrderData): Promise<{ id: string } & ValidatedOrderData> {
  const { customerInfo, cartItems, total } = validatedData;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: null,
      customer_details: customerInfo,
      status: 'pending_whatsapp',
      total_amount: total,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Error creating order:', orderError);
    throw new Error('Failed to create order');
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name || 'Unknown Product',
    product_sku: null,
    unit_price: item.price || 0,
    quantity: item.quantity,
    variant_info: null,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    await supabase.from('orders').delete().eq('id', order.id);
    throw new Error('Failed to create order items');
  }

  return { id: order.id, ...validatedData };
}