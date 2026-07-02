// src/lib/api-security.ts
import { NextResponse } from 'next/server';

/**
 * Max body size for public API routes (100KB).
 * Plenty for JSON payloads (contact forms, orders).
 * Prevents memory exhaustion from giant payloads.
 */
export const MAX_BODY_SIZE = 100 * 1024; // 100KB

/**
 * Checks that the request body doesn't exceed the max size.
 * Returns null if within limit, or a 413 Response if too large.
 *
 * Uso:
 *   const sizeCheck = checkBodySize(request);
 *   if (sizeCheck) return sizeCheck;
 */
export function checkBodySize(
  request: Request,
  maxSize: number = MAX_BODY_SIZE
): NextResponse | null {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > maxSize) {
    return NextResponse.json(
      { error: 'Request body too large' },
      { status: 413 }
    );
  }
  return null;
}
