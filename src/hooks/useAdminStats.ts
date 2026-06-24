'use client';

import { useState, useEffect } from 'react';

interface AdminStats {
  products: number;
  orders: number;
  projects: number;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para obtener estadísticas del dashboard admin desde /api/admin/stats.
 * La API route verifica la sesión admin vía cookie y usa service_role para los datos.
 */
export function useAdminStats(): AdminStats {
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [projects, setProjects] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const loading = products === 0 && orders === 0 && projects === 0 && error === null;

  useEffect(() => {
    let cancelled = false;

    fetch('/api/admin/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar estadísticas');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products);
        setOrders(data.orders);
        setProjects(data.projects);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, orders, projects, loading, error };
}
