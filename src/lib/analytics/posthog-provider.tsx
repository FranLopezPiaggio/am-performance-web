'use client';

import { useEffect, useState } from 'react';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    import('posthog-js').then((posthog) => {
      posthog.default.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        person_profiles: 'identified_only',
      });
      setClient(posthog.default);
    });
  }, []);

  if (!client) return <>{children}</>;
  return <PHProvider client={client}>{children}</PHProvider>;
}
