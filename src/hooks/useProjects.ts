'use client';

import { useState, useEffect } from 'react';
import type { ProjectLead } from '@/types/database';

interface UseProjectsReturn {
  projects: ProjectLead[];
  loading: boolean;
  error: Error | null;
  total: number;
}

/**
 * Hook para obtener project leads desde /api/admin/projects.
 * La API route verifica la sesión admin vía cookie y usa service_role para los datos.
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectLead[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const loading = projects.length === 0 && error === null;

  useEffect(() => {
    let cancelled = false;

    fetch('/api/admin/projects')
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
  }, []);

  return { projects, loading, error, total };
}
