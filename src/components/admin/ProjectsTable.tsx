'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderKanban } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

const statusColors: Record<string, string> = {
  new: 'text-neon-green',
  contacted: 'text-blue-400',
  quoted: 'text-yellow',
  won: 'text-green-400',
  lost: 'text-red-500',
};

const statusLabels: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  quoted: 'Cotizado',
  won: 'Ganado',
  lost: 'Perdido',
};

const gymTypeLabels: Record<string, string> = {
  commercial: 'Comercial',
  institutional: 'Institución',
  boutique: 'Boutique',
  hotel: 'Hotel',
  personal: 'Personal',
  box: 'Box CrossFit',
  studio: 'Estudio',
};

const budgetLabels: Record<string, string> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  premium: 'Premium',
};

export default function ProjectsTable() {
  const { projects, loading, error, total } = useProjects();
  const router = useRouter();

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <FolderKanban size={32} className="text-white/20 mx-auto mb-4" />
        <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
          Error al cargar proyectos
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">
          {error.message}
        </p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-16 text-center">
        <FolderKanban size={48} className="text-white/20 mx-auto mb-4" />
        <p className="text-white/60 uppercase tracking-widest text-sm mb-2">
          Sin proyectos
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">
          No hay consultas de proyectos todavía.
          Las consultas llegan desde el formulario de proyectos en el sitio.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="p-4 border-b border-white/10">
        <p className="text-xs uppercase tracking-widest text-white/40">
          {total} consulta{total !== 1 ? 's' : ''} de proyecto{total !== 1 ? 's' : ''}
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            <th className="text-left px-4 py-3">Cliente</th>
            <th className="text-left px-4 py-3">Contacto</th>
            <th className="text-left px-4 py-3">Tipo</th>
            <th className="text-right px-4 py-3">m²</th>
            <th className="text-center px-4 py-3">Estado</th>
            <th className="text-right px-4 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const statusColor = statusColors[project.status] || 'text-white/40';
            const statusLabel = statusLabels[project.status] || project.status;
            const gymType = gymTypeLabels[project.gym_type] || project.gym_type;

            return (
              <tr key={project.id} onClick={() => router.push(`/admin/proyectos/${project.id}`)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                <td className="px-4 py-4">
                  <span className="font-bold text-white uppercase tracking-wider">
                    {project.client_name}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-white/50 text-xs space-y-0.5">
                    <p>{project.client_email}</p>
                    <p className="text-white/30">{project.client_phone}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-white/50 text-xs uppercase tracking-widest">
                  {gymType}
                  {project.budget_range && (
                    <span className="block text-white/30">
                      {budgetLabels[project.budget_range] || project.budget_range}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-right font-bold text-white">
                  {project.square_meters}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
                    {statusLabel}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-white/40 text-[10px] uppercase tracking-widest">
                  {new Date(project.created_at).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
