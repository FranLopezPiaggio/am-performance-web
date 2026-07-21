// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redis } from '@/lib/cache/redis';

interface CheckResult {
  status: 'ok' | 'error';
  latency_ms?: number;
  error?: string;
}

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  uptime: number;
  timestamp: string;
  version: string;
  checks: {
    supabase: CheckResult;
    redis: CheckResult;
    env: CheckResult;
  };
}

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'MERCADO_PAGO_ACCESS_TOKEN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_SECRET',
  'SENTRY_DSN',
] as const;

export async function GET() {
  // ── Checks ────────────────────────────────────────────────────────

  const supabaseCheck = await checkSupabase();
  const redisCheck = await checkRedis();
  const envCheck = checkEnv();

  // ── Overall status ────────────────────────────────────────────────

  const allOk = supabaseCheck.status === 'ok' && redisCheck.status === 'ok' && envCheck.status === 'ok';
  const anyError = supabaseCheck.status === 'error' || redisCheck.status === 'error' || envCheck.status === 'error';

  const response: HealthResponse = {
    status: allOk ? 'ok' : anyError ? 'error' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev',
    checks: {
      supabase: supabaseCheck,
      redis: redisCheck,
      env: envCheck,
    },
  };

  const httpStatus = anyError ? 503 : 200;

  return NextResponse.json(response, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

async function checkSupabase(): Promise<CheckResult> {
  const t0 = Date.now();
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').select('id', { count: 'exact', head: true }).limit(1);
    if (error) throw error;
    return { status: 'ok', latency_ms: Date.now() - t0 };
  } catch (err) {
    return { status: 'error', latency_ms: Date.now() - t0, error: String(err) };
  }
}

async function checkRedis(): Promise<CheckResult> {
  const t0 = Date.now();
  try {
    await redis.ping();
    return { status: 'ok', latency_ms: Date.now() - t0 };
  } catch (err) {
    return { status: 'error', latency_ms: Date.now() - t0, error: String(err) };
  }
}

function checkEnv(): CheckResult {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    return { status: 'error', error: `Missing: ${missing.join(', ')}` };
  }
  return { status: 'ok' };
}
