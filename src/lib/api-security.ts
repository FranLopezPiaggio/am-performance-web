// src/lib/api-security.ts
import { NextResponse } from 'next/server';

// ponytail: CSRF está cubierto por SameSite=Lax cookies de Supabase Auth.
// Las cookies no se envían en cross-origin POST, y los endpoints que mutan
// datos (POST/PATCH/DELETE) requieren sesión vía verifyAdminRequest().
// Para defense-in-depth adicional en mutations, verificar Content-Type:
//
//   if (checkCSRF(request)) return checkCSRF(request);
//

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
/**
 * Verifica que mutations tengan Content-Type: application/json.
 * Previene CSRF basado en form submissions (no pueden setear este header).
 */
export function checkCSRF(
  request: Request,
  methods: string[] = ['POST', 'PUT', 'PATCH', 'DELETE']
): NextResponse | null {
  if (methods.includes(request.method) && !request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json(
      { error: 'Unsupported Media Type' },
      { status: 415 }
    );
  }
  return null;
}

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
