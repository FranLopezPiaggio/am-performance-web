import { describe, it, expect } from 'vitest';
import { checkBodySize } from '../api-security';

function mockRequest(size: number | null): Request {
  const headers = new Headers();
  if (size !== null) headers.set('content-length', String(size));
  return { headers } as Request;
}

describe('checkBodySize', () => {
  it('returns null within limit', () => {
    expect(checkBodySize(mockRequest(50 * 1024))).toBeNull();
  });

  it('returns null at exact limit', () => {
    expect(checkBodySize(mockRequest(100 * 1024))).toBeNull();
  });

  it('returns null when content-length absent', () => {
    expect(checkBodySize(mockRequest(null))).toBeNull();
  });

  it('returns 413 when over limit', () => {
    const res = checkBodySize(mockRequest(100 * 1024 + 1));
    expect(res?.status).toBe(413);
  });

  it('returns 413 JSON with error', async () => {
    const res = checkBodySize(mockRequest(200 * 1024))!;
    const body = await res.json();
    expect(body).toEqual({ error: 'Request body too large' });
  });
});
