'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProductWithVariants } from '@/types/database';

interface UseAdminProductDetailReturn {
  product: ProductWithVariants | null;
  loading: boolean;
  error: Error | null;
  updateProduct: (fields: Record<string, unknown>) => Promise<void>;
  updateVariant: (variantId: string, fields: Record<string, unknown>) => Promise<void>;
  refresh: () => void;
}

export function useAdminProductDetail(slug: string): UseAdminProductDetailReturn {
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const loading = product === null && error === null;

  const fetchProduct = useCallback(() => {
    fetch(`/api/admin/products/by-slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar el producto');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      });
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const updateProduct = useCallback(async (fields: Record<string, unknown>) => {
    if (!product) throw new Error('No product loaded');

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar el producto');
    }

    setProduct((prev) => prev ? { ...prev, ...fields } as ProductWithVariants : null);
  }, [product]);

  const updateVariant = useCallback(async (variantId: string, fields: Record<string, unknown>) => {
    if (!product) throw new Error('No product loaded');

    const res = await fetch(`/api/admin/products/${product.id}/variants/${variantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar la variante');
    }

    setProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        variants: prev.variants.map((v) =>
          v.id === variantId ? { ...v, ...fields } : v
        ),
      } as ProductWithVariants;
    });
  }, [product]);

  return { product, loading, error, updateProduct, updateVariant, refresh: fetchProduct };
}
