'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Save, Ruler, DollarSign, Clock, FileText } from 'lucide-react';
import { useProjectDetail } from '@/hooks/useProjectDetail';
import { projectStatusColors as statusColors, projectStatusLabels as statusLabels } from '@/lib/constants/status';

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

const statusOptions = ['new', 'contacted', 'quoted', 'won', 'lost'] as const;

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-white/5 border border-white/10" />
      ))}
    </div>
  );
}

function ProjectForm({ project, updateStatus }: {
  project: NonNullable<ReturnType<typeof useProjectDetail>['project']>;
  updateStatus: ReturnType<typeof useProjectDetail>['updateStatus'];
}) {
  const [selectedStatus, setSelectedStatus] = useState(project.status);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const handleSave = async () => {
    setUpdating(true);
    setUpdateError('');
    try {
      await updateStatus(selectedStatus);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin?view=projects"
        className="inline-flex items-center space-x-2 text-white/40 hover:text-white/80 transition-colors text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        <span>Volver a proyectos</span>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-display uppercase tracking-tighter">
            {project.client_name}
          </h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
            Recibido {new Date(project.created_at).toLocaleDateString('es-AR', {
              day: '2-digit', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <span className={`text-sm font-bold uppercase tracking-widest ${statusColors[project.status] || 'text-white/40'}`}>
          {statusLabels[project.status] || project.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User size={16} className="text-neon-green" />
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Datos del Cliente</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Email</p>
              <p className="text-white">{project.client_email}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Teléfono</p>
              <p className="text-white">{project.client_phone}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Dirección</p>
              <p className="text-white">{project.client_address}</p>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Ruler size={16} className="text-neon-green" />
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Detalles del Proyecto</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40 text-[10px] uppercase tracking-widest">Metros²</span>
              <span className="text-white font-bold">{project.square_meters} m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-[10px] uppercase tracking-widest">Tipo</span>
              <span className="text-white">{gymTypeLabels[project.gym_type] || project.gym_type}</span>
            </div>
            {project.budget_range && (
              <div className="flex justify-between">
                <span className="text-white/40 text-[10px] uppercase tracking-widest flex items-center gap-1">
                  <DollarSign size={12} /> Presupuesto
                </span>
                <span className="text-white">{budgetLabels[project.budget_range] || project.budget_range}</span>
              </div>
            )}
            {project.timeline && (
              <div className="flex justify-between">
                <span className="text-white/40 text-[10px] uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> Timeline
                </span>
                <span className="text-white">{project.timeline}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      {project.additional_notes && (
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText size={16} className="text-neon-green" />
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Notas del Cliente</h2>
          </div>
          <p className="text-white/70 text-sm whitespace-pre-wrap">{project.additional_notes}</p>
        </div>
      )}

      {/* Status Management */}
      <div className="bg-white/5 border border-white/10 p-6">
        <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">
          Estado del Proyecto
        </h2>
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">
              Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors text-sm"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{statusLabels[opt]}</option>
              ))}
            </select>
          </div>
          <div>
            {updateError && (
              <p className="text-red-500 text-xs mb-2">{updateError}</p>
            )}
            <button
              onClick={handleSave}
              disabled={updating}
              className="w-full brutal-btn flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{updating ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { project, loading, error, updateStatus } = useProjectDetail(params.id);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
          Error al cargar el proyecto
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">{error.message}</p>
        <Link href="/admin?view=projects" className="text-neon-green text-sm mt-4 inline-block hover:underline">
          ← Volver a proyectos
        </Link>
      </div>
    );
  }

  if (!project) return null;

  return <ProjectForm key={project.id} project={project} updateStatus={updateStatus} />;
}
