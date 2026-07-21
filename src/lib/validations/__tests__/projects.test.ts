import { describe, it, expect } from 'vitest';
import { projectFormSchema } from '../projects';

const validData = {
  name: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '12345678',
  address: 'Av. Siempre Viva 123',
  city: 'Buenos Aires',
  gymStyle: 'crossfit',
  budget: 'medium',
};

describe('projectFormSchema', () => {
  it('accepts valid data', () => {
    expect(projectFormSchema.safeParse(validData).success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = projectFormSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = projectFormSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects short phone', () => {
    const result = projectFormSchema.safeParse({ ...validData, phone: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects empty gymStyle', () => {
    const result = projectFormSchema.safeParse({ ...validData, gymStyle: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty budget', () => {
    const result = projectFormSchema.safeParse({ ...validData, budget: '' });
    expect(result.success).toBe(false);
  });

  it('accepts optional fields (squareMeters, requirements)', () => {
    const withOptional = { ...validData, squareMeters: '50', requirements: 'Equipo completo' };
    expect(projectFormSchema.safeParse(withOptional).success).toBe(true);
  });
});
