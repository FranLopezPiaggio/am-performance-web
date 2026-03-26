'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle, MessageCircle, ArrowLeft, Package } from 'lucide-react';

interface OrderData {
  orderId: string;
  customer: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export default function GraciasPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('orderConfirmation');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderData(JSON.parse(stored));
    }
  }, []);

  const handleWhatsAppFollowUp = () => {
    if (!orderData?.customer?.telefono) return;

    const message = `¡Hola! ${orderData.customer.nombre}, tu pedido #${orderData.orderId} está siendo procesado. ¿Hay algo en lo que pueda ayudarte?`;
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = orderData.customer.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neon-green/10 border border-neon-green mb-8">
            <CheckCircle size={40} className="text-neon-green" />
          </div>
          <h1 className="text-6xl font-display uppercase tracking-tighter mb-4">
            ¡Pedido Enviado!
          </h1>
          <p className="text-white/50 uppercase tracking-widest text-sm">
            Tu mensaje fue enviado por WhatsApp
          </p>
        </div>

        {orderData ? (
          <div className="bg-white/5 border border-white/10 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Package size={20} className="text-neon-green" />
              <h2 className="text-xl font-display uppercase tracking-tight">
                Resumen del Pedido
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/50 uppercase tracking-widest">Pedido</span>
                <span className="font-mono">#{orderData.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50 uppercase tracking-widest">Cliente</span>
                <span>{orderData.customer?.nombre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50 uppercase tracking-widest">Email</span>
                <span>{orderData.customer?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50 uppercase tracking-widest">Teléfono</span>
                <span>{orderData.customer?.telefono}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mb-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
                Productos
              </h3>
              <div className="space-y-3">
                {orderData.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="text-neon-green">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-display uppercase tracking-tight">
              <span>Total</span>
              <span className="text-neon-green">${orderData.total?.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-8 mb-8 text-center">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Resumen del pedido no disponible
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleWhatsAppFollowUp}
            className="w-full brutal-btn flex items-center justify-center space-x-2"
          >
            <MessageCircle size={20} />
            <span>Contactar por WhatsApp</span>
          </button>

          <Link
            href="/catalogo"
            className="w-full brutal-btn-outline flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Seguir Comprando</span>
          </Link>
        </div>

        <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-12">
          Te contactaremos pronto para confirmar tu pedido
        </p>
      </div>
    </main>
  );
}
