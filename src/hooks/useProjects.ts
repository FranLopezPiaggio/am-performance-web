'use client';

import { useState, useEffect } from 'react';
import type { ProjectLeadFlat } from '@/types/database';

interface UseProjectsReturn {
  projects: ProjectLeadFlat[];
  loading: boolean;
  error: Error | null;
  total: number;
}

interface UseProjectsOptions {
  limit?: number;
  offset?: number;
}

/**
 * Hook para obtener project leads desde /api/admin/projects.
 * La API route verifica la sesión admin vía cookie y usa service_role para los datos.
 */
export function useProjects(options?: UseProjectsOptions): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectLeadFlat[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const loading = projects.length === 0 && error === null;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.offset) params.set('offset', String(options.offset));
    const qs = params.toString();

    fetch(`/api/admin/projects${qs ? `?${qs}` : ''}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar proyectos');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProjects(data.projects);
        setTotal(data.total);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
        setProjects([]);
      });

    return () => {
      cancelled = true;
    };
  }, [options?.limit, options?.offset]);

  return { projects, loading, error, total };
}
