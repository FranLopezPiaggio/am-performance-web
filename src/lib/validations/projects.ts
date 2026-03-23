import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().min(2, "El nombre es requerido y debe tener al menos 2 caracteres."),
  email: z.string().email("Ingresa un email válido."),
  phone: z.string().min(8, "El teléfono es requerido y debe tener al menos 8 caracteres."),
  city: z.string().min(2, "La ciudad/provincia es requerida."),
  squareMeters: z.string().optional(),
  gymStyle: z.string().min(1, "Selecciona un estilo de gimnasio."),
  budget: z.string().min(1, "Selecciona un presupuesto."),
  requirements: z.string().optional()
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const createProjectSchema = z.object({
  customerInfo: projectFormSchema,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;