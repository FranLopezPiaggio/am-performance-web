import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

// ── Mock helpers (hoisted before imports) ─────────────────────────
const { mockCheckBodySize, mockCheckRateLimit, mockCaptureEvent, mockSingle } = vi.hoisted(() => ({
  mockCheckBodySize: vi.fn(),
  mockCheckRateLimit: vi.fn(),
  mockCaptureEvent: vi.fn(),
  mockSingle: vi.fn(),
}));

// ── Module mocks ───────────────────────────────────────────────────
vi.mock('@/lib/api-security', () => ({ checkBodySize: mockCheckBodySize }));
vi.mock('@/lib/rate-limit', () => ({ checkRateLimit: mockCheckRateLimit, ratelimits: { projects: {} } }));
vi.mock('@/lib/analytics/server', () => ({ captureEvent: mockCaptureEvent }));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => {
    const select = vi.fn(() => ({ single: mockSingle }));
    const upsert = vi.fn(() => ({ select }));
    const insert = vi.fn(() => ({ select }));
    return {
      from: vi.fn((table: string) => {
        if (table === 'leads') return { upsert };
        if (table === 'project_consultations') return { insert };
        return {};
      }),
    };
  },
}));

// ── Helpers ─────────────────────────────────────────────────────────
const validBody = {
  customerInfo: {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '12345678',
    address: 'Av. Siempre Viva 123',
    city: 'Buenos Aires',
    gymStyle: 'crossfit',
    budget: 'medium',
  },
};

function post(body: unknown): Promise<Response> {
  return POST(new Request('http://localhost/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

// ── Tests ───────────────────────────────────────────────────────────
describe('POST /api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckBodySize.mockReturnValue(null);
    mockCheckRateLimit.mockResolvedValue(null);
  });

  it('rejects honeypot (body.website present) with fake success', async () => {
    const res = await post({ ...validBody, website: 'spam' });
    expect(res.status).toBe(200);
    const body = await res.json();
    // ponytail: fake UUID avoids leaking whether it was a bot
    expect(body).toEqual({ success: true, recordId: '00000000-0000-0000-0000-000000000000' });
    // DB should NOT be called (honeypot short-circuits before Supabase)
    expect(mockSingle).not.toHaveBeenCalled();
  });

  it('returns 400 on invalid input', async () => {
    const res = await post({ customerInfo: { name: '' } });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/nombre/i);
  });

  it('returns 500 when DB fails', async () => {
    mockSingle.mockRejectedValue(new Error('DB connection failed'));
    const res = await post(validBody);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ success: false, error: 'Error al procesar la solicitud' });
  });

  it('creates project lead successfully', async () => {
    const leadId = '11111111-1111-1111-1111-111111111111';
    const consultationId = '22222222-2222-2222-2222-222222222222';
    mockSingle
      .mockResolvedValueOnce({ data: { id: leadId }, error: null })   // lead upsert
      .mockResolvedValueOnce({ data: { id: consultationId }, error: null }); // consultation insert

    const res = await post(validBody);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ success: true, recordId: consultationId });
  });
});
