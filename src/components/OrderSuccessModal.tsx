'use client';

import React from 'react';
import { CheckCircle, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderNumber: string;
  customerName: string;
  whatsappUrl: string;
  onClose: () => void;
}

export default function OrderSuccessModal({
  isOpen,
  orderNumber,
  customerName,
  whatsappUrl,
  onClose,
}: OrderSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="bg-brutal-black border border-white/10 p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neon-green/10 border border-neon-green">
            <CheckCircle size={32} className="text-neon-green" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-display uppercase tracking-tighter text-center mb-4">
          ¡Pedido Recibido!
        </h2>

        {/* Message */}
        <p className="text-white/70 text-sm text-center mb-6 leading-relaxed">
          Gracias por tu compra,{' '}
          <span className="text-white font-bold">{customerName}</span>.
          En breve nos comunicamos con vos para coordinar el costo de envío.
        </p>

        {/* Order number */}
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
            Número de Orden
          </p>
          <p className="font-mono text-neon-green text-xl">{orderNumber}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.open(whatsappUrl, '_blank')}
            className="w-full brutal-btn flex items-center justify-center space-x-2"
          >
            <MessageCircle size={18} />
            <span>Enviar por WhatsApp</span>
          </button>

          <Link
            href="/catalogo"
            className="w-full brutal-btn-outline flex items-center justify-center"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
