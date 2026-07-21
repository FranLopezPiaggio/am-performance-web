import { describe, it, expect } from 'vitest';
import { customerFormSchema, cartItemSchema, createOrderSchema } from '../order';

const validCustomer = {
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  telefono: '+541112345678',
  direccion: 'Av. Siempre Viva 123',
};

describe('customerFormSchema', () => {
  it('accepts valid customer', () => {
    expect(customerFormSchema.safeParse(validCustomer).success).toBe(true);
  });

  it('rejects invalid phone format', () => {
    const result = customerFormSchema.safeParse({ ...validCustomer, telefono: '12345' });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = customerFormSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts optional notas', () => {
    const result = customerFormSchema.safeParse({ ...validCustomer, notas: 'Dejar en recepción' });
    expect(result.success).toBe(true);
  });
});

describe('cartItemSchema', () => {
  it('accepts valid item', () => {
    expect(cartItemSchema.safeParse({ variant_id: 'abc-123', quantity: 1 }).success).toBe(true);
  });

  it('rejects zero quantity', () => {
    expect(cartItemSchema.safeParse({ variant_id: 'abc-123', quantity: 0 }).success).toBe(false);
  });

  it('rejects empty variant_id', () => {
    expect(cartItemSchema.safeParse({ variant_id: '', quantity: 1 }).success).toBe(false);
  });
});

const validOrder = {
  customerInfo: validCustomer,
  cartItems: [{ variant_id: 'abc-123', quantity: 2 }],
};

describe('createOrderSchema', () => {
  it('accepts valid order', () => {
    expect(createOrderSchema.safeParse(validOrder).success).toBe(true);
  });

  it('rejects empty cart', () => {
    const result = createOrderSchema.safeParse({ ...validOrder, cartItems: [] });
    expect(result.success).toBe(false);
  });

  it('defaults paymentMethod to whatsapp', () => {
    const parsed = createOrderSchema.parse(validOrder);
    expect(parsed.paymentMethod).toBe('whatsapp');
  });
});
