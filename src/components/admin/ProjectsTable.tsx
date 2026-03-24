'use client';

import React, { useEffect, useState } from 'react';
import { Project } from '@/types/database';
import { authenticatedFetch } from '@/hooks/authFetch';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-neon-green/20 text-neon-green',
    contacted: 'bg-blue-400/20 text-blue-400',
    quote_sent: 'bg-yellow/20 text-yellow',
    closed: 'bg-white/10 text-white/60',
    lost: 'bg-red-500/20 text-red-500',
  };
  return colors[status] || 'bg-white/10 text-white/60';
}

function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    quote_sent: 'Cotización Enviada',
    closed: 'Cerrado',
    lost: 'Perdido',
  };
  return labels[status] || status;
}

export default function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await authenticatedFetch('/api/admin/projects');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[ProjectsTable] Error response:', errorText);
          throw new Error(`Error al cargar proyectos: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/40 uppercase tracking-widest text-sm animate-pulse">
          Cargando proyectos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 text-red-500">
        <p className="font-bold uppercase tracking-widest mb-1">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 p-12 text-center">
        <p className="text-white/40 uppercase tracking-widest text-sm">
          No hay proyectos registrados
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              ID
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Cliente
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Email
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Teléfono
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              M²
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Estilo
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Presupuesto
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Estado
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="text-xs font-mono text-white/60">
                  {project.id.slice(0, 8)}...
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-medium">
                  {project.client_name}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-white/60">
                  {project.client_email}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-white/60">
                  {project.client_phone}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-white/60">
                  {project.square_meters
                    ? `${project.square_meters} m²`
                    : 'N/A'}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-white/60">
                  {project.gym_style || 'N/A'}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-white/60">
                  {project.budget_range || 'N/A'}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest font-bold ${getStatusColor(
                    project.status
                  )}`}
                >
                  {formatStatus(project.status)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-white/40">
                  {formatDate(project.created_at)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
