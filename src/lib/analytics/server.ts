import { PostHog } from 'posthog-node';

let _client: PostHog | null = null;

function getClient(): PostHog {
  if (!_client) {
    _client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    });
  }
  return _client;
}

/**
 * Capture a server-side event in PostHog.
 * Call this from API routes after successful operations.
 * Make sure to await `flush()` before the response is sent.
 */
export async function captureEvent(
  event: string,
  distinctId: string,
  properties?: Record<string, unknown>
) {
  try {
    const client = getClient();
    client.capture({
      distinctId,
      event,
      properties,
    });
  } catch {
    // Silently fail — analytics should never break the app
  }
}
