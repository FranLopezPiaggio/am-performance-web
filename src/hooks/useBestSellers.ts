'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getBestSellers } from '@/lib/supabase/queries';
import type { ProductWithVariants } from '@/types/database';

interface UseBestSellersReturn {
  products: ProductWithVariants[];
  loading: boolean;
  error: Error | null;
}

export function useBestSellers(limit: number = 8): UseBestSellersReturn {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const data = await getBestSellers(supabase, limit);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch best sellers'));
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [limit]);

  return { products, loading, error };
}
