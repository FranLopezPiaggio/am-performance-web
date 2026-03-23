import { z } from 'zod';

export const customerFormSchema = z.object({
    nombre: z.string().min(2, "El nombre es requerido y debe tener al menos 2 caracteres."),
    email: z.string().email("Ingresa un email válido."),
    telefono: z.string().min(8, "El teléfono es requerido y debe tener al menos 8 caracteres."),
    direccion: z.string().min(5, "La dirección es requerida."),
    notas: z.string().optional(),
});

export const cartItemSchema = z.object({
    id: z.string().min(1, "El ID del producto es requerido."),
    name: z.string().optional(),
    price: z.number().min(0).optional(),
    quantity: z.number().min(1, "La cantidad debe ser mayor a 0."),
    image: z.string().optional(),
    category: z.string().optional()
});

export const createOrderSchema = z.object({
    customerInfo: customerFormSchema,
    cartItems: z.array(cartItemSchema).min(1, "El carrito no puede estar vacío."),
    total: z.number().min(0, "El total no puede ser negativo.")
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;