'use client';

import { useState, useEffect, useCallback } from 'react';
import type { OrderWithDetails } from '@/types/database';

interface UseOrderDetailReturn {
  order: OrderWithDetails | null;
  loading: boolean;
  error: Error | null;
  updateStatus: (status: string, adminNotes?: string) => Promise<void>;
}

export function useOrderDetail(id: string): UseOrderDetailReturn {
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const loading = order === null && error === null;

  const fetchOrder = useCallback(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar la orden');
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch order'));
      });
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateStatus = useCallback(async (status: string, adminNotes?: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar la orden');
    }

    const updated = await res.json();
    setOrder(updated);
  }, [id]);

  return { order, loading, error, updateStatus };
}
