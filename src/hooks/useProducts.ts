'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSupabase } from '@/context/SupabaseProvider';
import { getProducts, getProductCount } from '@/lib/supabase/queries';
import type { ProductFilters } from '@/lib/supabase/queries';
import type { ProductWithVariants } from '@/types/database';

interface UseProductsReturn {
  products: ProductWithVariants[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  total: number;
}

const DEFAULT_PAGE_SIZE = 12;

export function useProducts(
  filters: ProductFilters = {},
  pageSize: number = DEFAULT_PAGE_SIZE
): UseProductsReturn {
  const supabase = useSupabase();
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const offsetRef = useRef(0);
  const filtersKey = JSON.stringify(filters);

  // Derived: loading when no data yet or when loading more
  const loading = !hasInitialFetch || isLoadingMore;

  // Reset and fetch when filters change
  useEffect(() => {
    if (!supabase) return;
    offsetRef.current = 0;
    let cancelled = false;

    Promise.all([
      getProducts(supabase, { ...filters, limit: pageSize, offset: 0 }),
      getProductCount(supabase, filters),
    ])
      .then(([data, count]) => {
        if (cancelled) return;
        setProducts(data);
        setTotal(count);
        setHasMore(pageSize < count);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useProducts] fetch error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) {
          setHasInitialFetch(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, pageSize, supabase]);

  const loadMore = useCallback(() => {
    if (!supabase) return;
    setIsLoadingMore(true);
    const newOffset = offsetRef.current + pageSize;
    offsetRef.current = newOffset;
    let cancelled = false;

    Promise.all([
      getProducts(supabase, { ...filters, limit: pageSize, offset: newOffset }),
      getProductCount(supabase, filters),
    ])
      .then(([data, count]) => {
        if (cancelled) return;
        setProducts(prev => [...prev, ...data]);
        setTotal(count);
        setHasMore(newOffset + pageSize < count);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useProducts] loadMore error:', err);
        setError(err instanceof Error ? err : new Error('Failed to load more products'));
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingMore(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters, pageSize, supabase]);

  return { products, loading, error, hasMore, loadMore, total };
}
