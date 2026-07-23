'use client';

import React from 'react';
import { CheckCircle, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  /** Opcional: texto destacado (número de orden, ID de consulta, etc.) */
  highlight?: string;
  /** Label para el highlight */
  highlightLabel?: string;
  /** URL de WhatsApp a abrir en nueva pestaña */
  whatsappUrl: string;
  /** Label del botón secundario (navegación) */
  secondaryLabel: string;
  /** href del botón secundario */
  secondaryHref: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  highlight,
  highlightLabel,
  whatsappUrl,
  secondaryLabel,
  secondaryHref,
}: SuccessModalProps) {
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
          {title}
        </h2>

        {/* Message */}
        <p className="text-white/70 text-sm text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* Highlight (order number, consultation ID, etc.) */}
        {highlight && highlightLabel && (
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
              {highlightLabel}
            </p>
            <p className="font-mono text-neon-green text-xl">{highlight}</p>
          </div>
        )}

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
            href={secondaryHref}
            className="w-full brutal-btn-outline flex items-center justify-center"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
