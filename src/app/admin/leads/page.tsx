'use client';

import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-white/5" />
      ))}
    </div>
  );
}

export default function AdminLeadsPage() {
  const { leads, loading, error, total } = useLeads();

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="text-center py-20">
        <Users size={32} className="text-white/20 mx-auto mb-4" />
        <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
          Error al cargar clientes
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display uppercase tracking-tighter mb-2">Clientes</h1>
        <p className="text-white/60">Personas que realizaron consultas u órdenes.</p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-16 text-center">
          <Users size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/60 uppercase tracking-widest text-sm mb-2">Sin clientes</p>
          <p className="text-white/30 text-xs uppercase tracking-widest">
            No hay clientes registrados todavía.
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10">
          <div className="p-4 border-b border-white/10">
            <p className="text-xs uppercase tracking-widest text-white/40">
              {total} cliente{total !== 1 ? 's' : ''} en total
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Teléfono</th>
                  <th className="text-left px-4 py-3">Fuente</th>
                  <th className="text-right px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => window.location.href = `/admin/leads/${lead.id}`}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      <span className="font-bold text-white uppercase tracking-wider">
                        {lead.first_name} {lead.last_name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/50 text-xs">{lead.email}</td>
                    <td className="px-4 py-4 text-white/50 text-xs">{lead.phone || <span className="text-white/20">—</span>}</td>
                    <td className="px-4 py-4 text-white/50 text-xs uppercase tracking-widest">{lead.source || <span className="text-white/20">—</span>}</td>
                    <td className="px-4 py-4 text-right text-white/40 text-[10px] uppercase tracking-widest">
                      {new Date(lead.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
