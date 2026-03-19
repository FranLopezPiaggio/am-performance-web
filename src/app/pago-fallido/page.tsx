'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FailurePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-8 bg-red-500 brutal-shadow mb-8"
        >
          <XCircle size={64} className="text-white" />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-display uppercase tracking-tighter mb-4">Pago Fallido</h1>
        <p className="text-white/50 uppercase tracking-widest text-sm mb-12 max-w-md mx-auto">
          Hubo un problema al procesar tu pago. No te preocupes, no se ha realizado ningún cargo. Por favor, intenta nuevamente.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/carrito" className="brutal-btn flex items-center space-x-2">
            <RefreshCw size={20} />
            <span>Reintentar Pago</span>
          </Link>
          <Link href="/catalogo" className="px-8 py-4 border border-white/20 uppercase font-bold tracking-widest text-sm hover:bg-white/10 transition-colors flex items-center space-x-2">
            <ArrowLeft size={20} />
            <span>Volver al Catálogo</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
