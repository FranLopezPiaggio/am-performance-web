'use client';

import React, { useEffect, useState } from 'react';
import { Order, CustomerDetails } from '@/types/database';
import { authenticatedFetch } from '@/hooks/authFetch';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    cart: 'bg-white/10 text-white/60',
    pending_whatsapp: 'bg-yellow/20 text-yellow',
    confirmed_by_admin: 'bg-blue-400/20 text-blue-400',
    shipped: 'bg-purple-400/20 text-purple-400',
    delivered: 'bg-neon-green/20 text-neon-green',
    cancelled: 'bg-red-500/20 text-red-500',
  };
  return colors[status] || 'bg-white/10 text-white/60';
}

function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    cart: 'Carrito',
    pending_whatsapp: 'Pendiente',
    confirmed_by_admin: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await authenticatedFetch('/api/admin/orders');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[OrdersTable] Error response:', errorText);
          throw new Error(`Error al cargar órdenes: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/40 uppercase tracking-widest text-sm animate-pulse">
          Cargando órdenes...
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

  if (orders.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 p-12 text-center">
        <p className="text-white/40 uppercase tracking-widest text-sm">
          No hay órdenes registradas
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
              Total
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
          {orders.map((order) => {
            const customer = order.customer_details as unknown as CustomerDetails;
            return (
              <tr
                key={order.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="text-xs font-mono text-white/60">
                    {order.id.slice(0, 8)}...
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium">
                    {customer?.name || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-white/60">
                    {customer?.email || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-white/60">
                    {customer?.phone || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-display">
                    {formatCurrency(order.total_amount)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-white/40">
                    {formatDate(order.created_at)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
