import { z } from 'zod';

export const customerFormSchema = z.object({
    nombre: z.string().min(2, "El nombre es requerido y debe tener al menos 2 caracteres."),
    email: z.string().email("Ingresa un email válido."),
    telefono: z.string().min(8, "El teléfono es requerido y debe tener al menos 8 caracteres."),
    direccion: z.string().min(5, "La dirección es requerida."),
    notas: z.string().optional(),
});

export const cartItemSchema = z.object({
    variant_id: z.string().min(1, "El ID de la variante es requerido."),
    quantity: z.number().min(1, "La cantidad debe ser mayor a 0."),
});

export const createOrderSchema = z.object({
    customerInfo: customerFormSchema,
    cartItems: z.array(cartItemSchema).min(1, "El carrito no puede estar vacío."),
    paymentMethod: z.enum(['whatsapp', 'mercadopago', 'transfer']).default('whatsapp'),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
