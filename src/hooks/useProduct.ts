'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getProduct } from '@/lib/supabase/queries';
import type { ProductWithVariants } from '@/types/database';

interface UseProductReturn {
  product: ProductWithVariants | null;
  loading: boolean;
  error: Error | null;
}

export function useProduct(slug: string | undefined): UseProductReturn {
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Derived: loading when slug exists but no data yet
  const loading = !!slug && product === null && error === null;

  useEffect(() => {
    // Don't fetch if no slug — state already starts as null
    if (!slug) return;

    let cancelled = false;
    const supabase = createClient();

    getProduct(supabase, slug)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch product'));
        setProduct(null);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading, error };
}
