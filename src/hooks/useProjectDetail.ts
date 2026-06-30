'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProjectLead } from '@/types/database';

interface UseProjectDetailReturn {
  project: ProjectLead | null;
  loading: boolean;
  error: Error | null;
  updateStatus: (status: string) => Promise<void>;
}

export function useProjectDetail(id: string): UseProjectDetailReturn {
  const [project, setProject] = useState<ProjectLead | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const loading = project === null && error === null;

  const fetchProject = useCallback(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar el proyecto');
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch project'));
      });
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const updateStatus = useCallback(async (status: string) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar el proyecto');
    }

    const updated = await res.json();
    setProject(updated);
  }, [id]);

  return { project, loading, error, updateStatus };
}
