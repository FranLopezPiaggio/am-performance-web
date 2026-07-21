import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().min(2, "El nombre es requerido y debe tener al menos 2 caracteres.").max(255),
  email: z.string().email("Ingresa un email válido.").max(255),
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, "El teléfono debe estar en formato internacional: +541112345678."),
  address: z.string().min(5, "La dirección es requerida.").max(500),
  city: z.string().min(2, "La ciudad/provincia es requerida.").max(255),
  squareMeters: z.string().optional(),
  gymStyle: z.string().min(1, "Selecciona un estilo de gimnasio."),
  budget: z.string().min(1, "Selecciona un presupuesto."),
  requirements: z.string().max(2000).optional()
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const createProjectSchema = z.object({
  customerInfo: projectFormSchema,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;