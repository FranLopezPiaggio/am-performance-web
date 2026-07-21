'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, User, Package, MapPin, Save, CreditCard
} from 'lucide-react';
import { useOrderDetail } from '@/hooks/useOrderDetail';
import { orderStatusColors as statusColors, orderStatusLabels as statusLabels, orderStatusOptions as statusOptions } from '@/lib/constants/status';

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-white/5 border border-white/10" />
      ))}
    </div>
  );
}

function OrderForm({ order, updateStatus }: {
  order: NonNullable<ReturnType<typeof useOrderDetail>['order']>;
  updateStatus: ReturnType<typeof useOrderDetail>['updateStatus'];
}) {
  const [selectedStatus, setSelectedStatus] = useState(order.status?.name || 'pending');
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const handleSave = async () => {
    setUpdating(true);
    setUpdateError('');
    try {
      await updateStatus(selectedStatus, adminNotes);
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
        href="/admin?view=orders"
        className="inline-flex items-center space-x-2 text-white/40 hover:text-white/80 transition-colors text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        <span>Volver a órdenes</span>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-display uppercase tracking-tighter">
            Orden #{order.order_number}
          </h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
            {new Date(order.created_at).toLocaleDateString('es-AR', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <span className={`text-sm font-bold uppercase tracking-widest ${statusColors[order.status?.name] || 'text-white/40'}`}>
          {statusLabels[order.status?.name] || order.status?.name}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User size={16} className="text-neon-green" />
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Cliente</h2>
          </div>
          {order.lead ? (
            <div className="space-y-2 text-sm">
              <p className="text-white font-bold uppercase tracking-wider">
                {order.lead.first_name} {order.lead.last_name}
              </p>
              <p className="text-white/50">{order.lead.email}</p>
              {order.lead.phone && <p className="text-white/50">{order.lead.phone}</p>}
            </div>
          ) : (
            <p className="text-white/30 text-sm">Sin datos de cliente</p>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin size={16} className="text-neon-green" />
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Dirección de Envío</h2>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-white">{order.shipping_address.address_line_1}</p>
            {order.shipping_address.address_line_2 && (
              <p className="text-white/50">{order.shipping_address.address_line_2}</p>
            )}
            <p className="text-white/50">
              {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.postal_code}
            </p>
            <p className="text-white/50">{order.shipping_address.country}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white/5 border border-white/10">
        <div className="flex items-center space-x-2 p-6 pb-0">
          <Package size={16} className="text-neon-green" />
          <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Items</h2>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                <th className="text-left px-4 py-3">Producto</th>
                <th className="text-left px-4 py-3">SKU</th>
                <th className="text-right px-4 py-3">Precio</th>
                <th className="text-right px-4 py-3">Cant.</th>
                <th className="text-right px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="px-4 py-4">
                    <p className="text-white font-bold">{item.snapshot_product_name}</p>
                    <p className="text-white/40 text-xs">{item.snapshot_variant_name}</p>
                  </td>
                  <td className="px-4 py-4 text-white/40 text-xs font-mono">{item.snapshot_sku}</td>
                  <td className="px-4 py-4 text-right text-white">${item.snapshot_price.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-white">{item.quantity}</td>
                  <td className="px-4 py-4 text-right text-white font-bold">${item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-white/10 p-6 space-y-2 text-sm">
          <div className="flex justify-between text-white/50">
            <span>Subtotal</span>
            <span>${order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-neon-green">
              <span>Descuento</span>
              <span>-${order.discount_amount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-white/50">
            <span>Envío</span>
            <span>{order.shipping_cost > 0 ? `$${order.shipping_cost.toLocaleString()}` : 'Gratis'}</span>
          </div>
          <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
            <span>Total</span>
            <span>${order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payments */}
      {order.payments.length > 0 && (
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard size={16} className="text-neon-green" />
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Pagos</h2>
          </div>
          {order.payments.map((payment) => (
            <div key={payment.id} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
              <span className="text-white/50 uppercase text-xs tracking-widest">
                {payment.payment_method} — {payment.status}
              </span>
              <span className="text-white font-bold">${payment.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Status Management */}
      <div className="bg-white/5 border border-white/10 p-6">
        <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">
          Gestión de Estado
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
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
            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">
              Notas internas
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors text-sm resize-none"
              placeholder="Notas para el equipo..."
            />
          </div>
        </div>
        {updateError && (
          <p className="text-red-500 text-xs mt-3">{updateError}</p>
        )}
        <button
          onClick={handleSave}
          disabled={updating}
          className="mt-4 brutal-btn flex items-center space-x-2 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{updating ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { order, loading, error, updateStatus } = useOrderDetail(params.id);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
          Error al cargar la orden
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">{error.message}</p>
        <Link href="/admin?view=orders" className="text-neon-green text-sm mt-4 inline-block hover:underline">
          ← Volver a órdenes
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return <OrderForm key={order.id} order={order} updateStatus={updateStatus} />;
}
