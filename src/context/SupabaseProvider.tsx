// src/context/SupabaseProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  client: SupabaseClient | null;
}

const SupabaseContext = createContext<SupabaseContextType>({ client: null });

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    let cancelled = false;
    import('@/lib/supabase/client').then(({ createClient }) => {
      if (cancelled) return;
      setClient(createClient());
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <SupabaseContext.Provider value={{ client }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  // ponytail: returns null on first render before lazy import resolves
  return ctx.client;
}
