import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { handleSubmission } from '../submissionService';

const { mockGetWhatsAppUrl } = vi.hoisted(() => ({ mockGetWhatsAppUrl: vi.fn() }));
vi.mock('@/lib/whatsapp', () => ({ getWhatsAppUrl: mockGetWhatsAppUrl }));

const testSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

const validData = { name: 'Test', email: 'test@example.com' };
const mockSave = vi.fn();

describe('handleSubmission', () => {
  it('returns error on validation failure', async () => {
    const result = await handleSubmission({ name: '' }, testSchema, vi.fn(), 'projects');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/inválidos/i);
  });

  it('returns error when DB save fails', async () => {
    const saveToDb = vi.fn().mockRejectedValue(new Error('timeout'));
    const result = await handleSubmission(validData, testSchema, saveToDb, 'projects');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/guardar/i);
  });

  it('returns success + whatsappUrl on full success', async () => {
    mockGetWhatsAppUrl.mockReturnValue('https://wa.me/123?text=Hola');
    const saveToDb = vi.fn().mockResolvedValue({ id: 'abc-123', ...validData });

    const result = await handleSubmission(validData, testSchema, saveToDb, 'projects');

    expect(result.success).toBe(true);
    expect(result.recordId).toBe('abc-123');
    expect(result.whatsappUrl).toBe('https://wa.me/123?text=Hola');
    expect(saveToDb).toHaveBeenCalledWith(validData);
    expect(mockGetWhatsAppUrl).toHaveBeenCalledWith('projects', validData);
  });

  it('returns success without whatsappUrl when WA generation fails', async () => {
    mockGetWhatsAppUrl.mockImplementation(() => { throw new Error('WA down'); });
    const saveToDb = vi.fn().mockResolvedValue({ id: 'abc-123', ...validData });

    const result = await handleSubmission(validData, testSchema, saveToDb, 'projects');

    expect(result.success).toBe(true);
    expect(result.recordId).toBe('abc-123');
    expect(result.whatsappUrl).toBeUndefined();
  });
});
