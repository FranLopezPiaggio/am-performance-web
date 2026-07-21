// src/lib/rate-limit.ts
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { NextResponse } from 'next/server';

// ── Lazy initialization ─────────────────────────────────────────────
// El Redis client se crea en el primer uso (no al importar el módulo).
// Esto evita warnings de env vars faltantes durante el build de Next.js.

let _redis: Redis;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
  }
  return _redis;
}

interface Ratelimits {
  orders: Ratelimit;
  checkout: Ratelimit;
  projects: Ratelimit;
  admin: Ratelimit;
}

let _ratelimits: Ratelimits;

function getRatelimits(): Ratelimits {
  if (!_ratelimits) {
    const redis = getRedis();
    _ratelimits = {
      // 5 requests cada 10s — creación de órdenes
      orders: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '10 s'),
        analytics: true,
        prefix: 'rl:orders',
      }),
      // 10 requests cada 10s — creación de preferencias MP
      checkout: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
        prefix: 'rl:checkout',
      }),
      // 3 requests cada 60s — formulario de proyectos
      projects: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '60 s'),
        analytics: true,
        prefix: 'rl:projects',
      }),
      // 60 requests cada 10s — admin PATCH endpoints (autenticados, generous)
      admin: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, '10 s'),
        analytics: true,
        prefix: 'rl:admin',
      }),
    };
  }
  return _ratelimits;
}

/**
 * Rate limiters por endpoint.
 * Se accede como `ratelimits.orders`, `ratelimits.checkout`, etc.
 * La inicialización lazy evita errores durante el build.
 */
export const ratelimits = new Proxy({} as Ratelimits, {
  get(_, key: keyof Ratelimits) {
    return getRatelimits()[key];
  },
});

/**
 * Extrae la IP del cliente desde los headers de la request.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}

/**
 * Verifica el rate limit para una request.
 *
 * Uso:
 *   const rateLimitResponse = await checkRateLimit(request, ratelimits.orders);
 *   if (rateLimitResponse) return rateLimitResponse;
 *
 * Retorna un NextResponse 429 si excede el límite, o null si puede continuar.
 */
export async function checkRateLimit(
  request: Request,
  limiter: Ratelimit
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta de nuevo en unos segundos.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}
