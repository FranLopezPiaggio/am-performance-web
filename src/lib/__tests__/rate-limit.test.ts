import { describe, it, expect, vi } from 'vitest';
import { getClientIp, checkRateLimit } from '../rate-limit';

function mockRequest(headers: Record<string, string>): Request {
  return { headers: new Headers(headers) } as Request;
}

interface MockLimiter {
  limit: (ip: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }>;
}

describe('getClientIp', () => {
  it('extracts first IP from x-forwarded-for', () => {
    const req = mockRequest({ 'x-forwarded-for': '192.168.1.1, 10.0.0.1' });
    expect(getClientIp(req)).toBe('192.168.1.1');
  });

  it('falls back to x-real-ip', () => {
    const req = mockRequest({ 'x-real-ip': '10.0.0.1' });
    expect(getClientIp(req)).toBe('10.0.0.1');
  });

  it('defaults to 127.0.0.1 without headers', () => {
    expect(getClientIp(mockRequest({}))).toBe('127.0.0.1');
  });

  it('prefers x-forwarded-for over x-real-ip', () => {
    const req = mockRequest({ 'x-forwarded-for': '10.0.0.2', 'x-real-ip': '10.0.0.1' });
    expect(getClientIp(req)).toBe('10.0.0.2');
  });
});

describe('checkRateLimit', () => {
  const req = mockRequest({ 'x-forwarded-for': '1.2.3.4' });

  it('returns null when under limit', async () => {
    const limiter: MockLimiter = { limit: vi.fn().mockResolvedValue({ success: true, limit: 5, remaining: 4, reset: Date.now() + 10000 }) };
    const result = await checkRateLimit(req, limiter);
    expect(result).toBeNull();
  });

  it('returns 429 when over limit', async () => {
    const limiter: MockLimiter = { limit: vi.fn().mockResolvedValue({ success: false, limit: 5, remaining: 0, reset: Date.now() + 10000 }) };
    const result = await checkRateLimit(req, limiter);
    expect(result?.status).toBe(429);
  });

  it('includes rate limit headers on 429', async () => {
    const reset = Date.now() + 10000;
    const limiter: MockLimiter = { limit: vi.fn().mockResolvedValue({ success: false, limit: 5, remaining: 0, reset }) };
    const result = await checkRateLimit(req, limiter) as Response;
    expect(result.headers.get('X-RateLimit-Limit')).toBe('5');
    expect(result.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(result.headers.get('Retry-After')).toBeTruthy();
  });
});
