'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Category } from '@/types/database';
import { useSupabase } from './SupabaseProvider';
import { getCategories } from '@/lib/supabase/queries';

const CategoriesContext = createContext<Category[]>([]);

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = useSupabase();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    getCategories(supabase).then((data) => {
      if (cancelled) return;
      setCategories(data);
    }).catch(() => {
      // ponytail: categorías fallan → Navbar sin dropdown
    });
    return () => { cancelled = true; };
  }, [supabase]);

  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategoriesContext(): Category[] {
  return useContext(CategoriesContext);
}
