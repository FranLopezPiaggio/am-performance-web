// src/context/SupabaseProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  client: SupabaseClient | null;
}

const SupabaseContext = createContext<SupabaseContextType>({ client: null });

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    let cancelled = false;
    import('@/lib/supabase/client').then(({ createClient }) => {
      if (cancelled) return;
      setClient((prev) => prev ?? createClient());
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
