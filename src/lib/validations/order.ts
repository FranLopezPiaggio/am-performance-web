import { z } from 'zod';

export const customerFormSchema = z.object({
    nombre: z.string().min(2, "El nombre es requerido y debe tener al menos 2 caracteres.").max(255),
    email: z.string().email("Ingresa un email válido.").max(255),
    telefono: z.string().regex(/^\+[1-9]\d{6,14}$/, "El teléfono debe estar en formato internacional: +541112345678."),
    direccion: z.string().min(5, "La dirección es requerida.").max(500),
    notas: z.string().max(2000).optional(),
});

export const cartItemSchema = z.object({
    product_id: z.string().min(1, "El ID del producto es requerido."),
    quantity: z.number().min(1, "La cantidad debe ser mayor a 0."),
});

export const createOrderSchema = z.object({
    customerInfo: customerFormSchema,
    cartItems: z.array(cartItemSchema).min(1, "El carrito no puede estar vacío."),
    paymentMethod: z.enum(['whatsapp', 'mercadopago', 'transfer']).default('whatsapp'),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
