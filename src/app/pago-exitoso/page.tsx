'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-8 bg-neon-green brutal-shadow mb-8"
        >
          <CheckCircle size={64} className="text-brutal-black" />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-display uppercase tracking-tighter mb-4">¡Pago Exitoso!</h1>
        <p className="text-white/50 uppercase tracking-widest text-sm mb-12 max-w-md mx-auto">
          Gracias por confiar en AM Performance. Tu pedido está siendo procesado y recibirás un email con los detalles.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/catalogo" className="brutal-btn flex items-center space-x-2">
            <span>Seguir Comprando</span>
            <ArrowRight size={20} />
          </Link>
          <Link href="/" className="px-8 py-4 border border-white/20 uppercase font-bold tracking-widest text-sm hover:bg-white/10 transition-colors">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
