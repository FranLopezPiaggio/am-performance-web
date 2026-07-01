import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Server-side Sentry init (replaces sentry.server.config.ts)
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
  });

  // Edge-side Sentry init (replaces sentry.edge.config.ts)
  // Same config — Edge runtime uses the same DSN
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
  });
}

// Captures errors from React Server Components
export const onRequestError = Sentry.captureRequestError;
