'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';

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

export default function OrdersTable() {
  const { orders, loading, error, total } = useOrders();

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
        <ShoppingCart size={32} className="text-white/20 mx-auto mb-4" />
        <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
          Error al cargar órdenes
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">
          {error.message}
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-16 text-center">
        <ShoppingCart size={48} className="text-white/20 mx-auto mb-4" />
        <p className="text-white/60 uppercase tracking-widest text-sm mb-2">
          Sin órdenes
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">
          No hay órdenes registradas todavía.
          Las órdenes se crean cuando un cliente completa el checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="p-4 border-b border-white/10">
        <p className="text-xs uppercase tracking-widest text-white/40">
          {total} órden{total !== 1 ? 'es' : ''} en total
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            <th className="text-left px-4 py-3">N° Orden</th>
            <th className="text-left px-4 py-3">Cliente</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-right px-4 py-3">Total</th>
            <th className="text-center px-4 py-3">Estado</th>
            <th className="text-right px-4 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const statusName = order.status?.name ?? 'pending';
            const statusColor = statusColors[statusName] || 'text-white/40';
            const statusLabel = statusLabels[statusName] || statusName;

            return (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-4">
                  <span className="font-bold text-white font-mono text-xs">
                    #{order.order_number}
                  </span>
                </td>
                <td className="px-4 py-4 text-white uppercase tracking-wider text-sm">
                  {order.lead ? `${order.lead.first_name} ${order.lead.last_name}` : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-white/50 text-xs">
                  {order.lead?.email ?? (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right font-bold text-white">
                  ${order.total.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
                    {statusLabel}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-white/40 text-[10px] uppercase tracking-widest">
                  {new Date(order.created_at).toLocaleDateString('es-AR', {
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
