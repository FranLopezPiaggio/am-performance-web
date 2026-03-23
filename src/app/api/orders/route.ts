import { NextResponse } from 'next/server';
import { handleSubmission } from '@/lib/services/submissionService';
import { createOrderSchema } from '@/lib/validations/order';
import { saveOrderToDatabase } from '@/lib/supabase/orders';
import { WhatsAppMsgContext } from '@/lib/whatsapp/types';

export async function POST(req: Request) {
  try {
    const rawData = await req.json();

    const result = await handleSubmission(
      rawData,
      createOrderSchema,
      saveOrderToDatabase,
      'order' as WhatsAppMsgContext
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        orderId: result.recordId,
        whatsappUrl: result.whatsappUrl
      });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
