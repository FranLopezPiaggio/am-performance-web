import * as Sentry from '@sentry/nextjs';

// Client-side Sentry init (replaces sentry.client.config.ts)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});

// Instruments client-side navigation changes for Sentry
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
