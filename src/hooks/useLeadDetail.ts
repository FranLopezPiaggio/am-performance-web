'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Lead, OrderWithDetails } from '@/types/database';

interface UseLeadDetailReturn {
  lead: Lead | null;
  orders: OrderWithDetails[];
  loading: boolean;
  error: Error | null;
}

export function useLeadDetail(id: string): UseLeadDetailReturn {
  const [lead, setLead] = useState<Lead | null>(null);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const loading = lead === null && error === null;

  const fetchLead = useCallback(() => {
    fetch(`/api/admin/leads/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar el cliente');
        return res.json();
      })
      .then((data) => {
        setLead(data.lead);
        setOrders(data.orders);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch lead'));
      });
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  return { lead, orders, loading, error };
}
