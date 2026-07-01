'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, ShoppingCart, Mail, Phone, Globe } from 'lucide-react';
import { useLeadDetail } from '@/hooks/useLeadDetail';

const statusColors: Record<string, string> = {
  pending: 'text-yellow',
  paid: 'text-blue-400',
  processing: 'text-neon-green',
  shipped: 'text-neon-green',
  delivered: 'text-green-400',
  cancelled: 'text-red-500',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-white/5 border border-white/10" />
      ))}
    </div>
  );
}

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const { lead, orders, loading, error } = useLeadDetail(params.id);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
          Error al cargar el cliente
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">{error.message}</p>
        <Link href="/admin/leads" className="text-neon-green text-sm mt-4 inline-block hover:underline">
          ← Volver a clientes
        </Link>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center space-x-2 text-white/40 hover:text-white/80 transition-colors text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        <span>Volver a clientes</span>
      </Link>

      {/* Header */}
      <h1 className="text-4xl font-display uppercase tracking-tighter">
        {lead.first_name} {lead.last_name}
      </h1>

      {/* Contact Info */}
      <div className="bg-white/5 border border-white/10 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <User size={16} className="text-neon-green" />
          <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Información de Contacto</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <Mail size={14} className="text-white/30" />
            <span className="text-white">{lead.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={14} className="text-white/30" />
            <span className="text-white">{lead.phone || <span className="text-white/30">—</span>}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Globe size={14} className="text-white/30" />
            <span className="text-white/50 text-xs uppercase tracking-widest">
              {lead.source || <span className="text-white/20">Fuente desconocida</span>}
            </span>
          </div>
        </div>
        {lead.notes && (
          <p className="mt-4 text-white/50 text-sm border-t border-white/10 pt-4">{lead.notes}</p>
        )}
      </div>

      {/* Orders */}
      <div className="bg-white/5 border border-white/10">
        <div className="flex items-center space-x-2 p-6 pb-4">
          <ShoppingCart size={16} className="text-neon-green" />
          <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">
            Órdenes ({orders.length})
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 pb-6">
            <p className="text-white/30 text-sm">Este cliente no tiene órdenes registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  <th className="text-left px-4 py-3">N° Orden</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-center px-4 py-3">Estado</th>
                  <th className="text-right px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => window.location.href = `/admin/orders/${order.id}`}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-white font-bold">#{order.order_number}</span>
                    </td>
                    <td className="px-4 py-4 text-right text-white font-bold">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColors[order.status?.name] || 'text-white/40'}`}>
                        {statusLabels[order.status?.name] || order.status?.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-white/40 text-[10px] uppercase tracking-widest">
                      {new Date(order.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
