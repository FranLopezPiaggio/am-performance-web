'use client';

import { useState, useEffect } from 'react';
import type { OrderWithDetails } from '@/types/database';

interface UseOrdersReturn {
  orders: OrderWithDetails[];
  loading: boolean;
  error: Error | null;
  total: number;
}

/**
 * Hook para obtener órdenes desde /api/admin/orders.
 * La API route verifica la sesión admin vía cookie y usa service_role para los datos.
 */
export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const loading = orders.length === 0 && error === null;

  useEffect(() => {
    let cancelled = false;

    fetch('/api/admin/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar órdenes');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setOrders(data.orders);
        setTotal(data.total);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
        setOrders([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, loading, error, total };
}
