import * as Sentry from '@sentry/nextjs';
import { getWhatsAppUrl, WhatsAppMsgContext } from '@/lib/whatsapp';
import { z } from 'zod';

type SaveFunction<T> = (data: T) => Promise<{ id: string } & T>;

/**
 * Procesa un envío genérico (Orden o Proyecto).
 * @param rawData - Los datos sin validar del formulario.
 * @param schema - El esquema de Zod para validar los datos.
 * @param saveToDb - La función específica para guardar en la base de datos.
 * @param whatsappTopic - El tema de WhatsApp a usar.
 * @returns Un objeto con el resultado de la operación.
 */
export async function handleSubmission<T>(
    rawData: unknown,
    schema: z.ZodSchema<T>,
    saveToDb: SaveFunction<T>,
    whatsappTopic: WhatsAppMsgContext
): Promise<{ success: boolean; recordId?: string; error?: string; whatsappUrl?: string }> {
    const validationResult = schema.safeParse(rawData);

    if (!validationResult.success) {
        const errorMessage = validationResult.error.issues.map((e: { message: string }) => e.message).join('. ');
        return { success: false, error: `Datos inválidos: ${errorMessage}` };
    }
    const validatedData = validationResult.data;

    try {
        const savedRecord = await saveToDb(validatedData);

        try {
            const whatsappUrl = getWhatsAppUrl(whatsappTopic, validatedData as Record<string, string>);
            console.log('WhatsApp URL generada:', whatsappUrl);
            return { success: true, recordId: savedRecord.id, whatsappUrl };
        } catch (whatsappError) {
            console.error('Fallo al generar URL de WhatsApp:', whatsappError);
            Sentry.captureException(whatsappError, {
                tags: {
                    feature: 'whatsapp_notification',
                    topic: whatsappTopic,
                },
                extra: {
                    recordId: savedRecord.id,
                },
            });
            // Devolvemos éxito porque la orden ya está guardada.
            return { success: true, recordId: savedRecord.id };
        }

    } catch (dbError) {
        // 5. Si el guardado en la DB falla, SÍ fallamos la operación.
        console.error('Fallo al guardar en la base de datos:', dbError);
        Sentry.captureException(dbError, {
            tags: {
                feature: 'database_save',
            },
        });
        return { success: false, error: 'No se pudo guardar la solicitud. Por favor, inténtalo de nuevo.' };
    }
}