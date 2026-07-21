'use client';

import { useState, useEffect } from 'react';
import type { Lead } from '@/types/database';

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: Error | null;
  total: number;
}

interface UseLeadsOptions {
  limit?: number;
  offset?: number;
}

export function useLeads(options?: UseLeadsOptions): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const loading = leads.length === 0 && error === null;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.offset) params.set('offset', String(options.offset));
    const qs = params.toString();

    fetch(`/api/admin/leads${qs ? `?${qs}` : ''}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar clientes');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setLeads(data.leads);
        setTotal(data.total);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch leads'));
        setLeads([]);
      });

    return () => { cancelled = true; };
  }, [options?.limit, options?.offset]);

  return { leads, loading, error, total };
}
