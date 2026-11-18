'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Ruler, Package, Users, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useShowroomImages } from './useShowroomImages';

const PAUSE_BETWEEN_LOOPS_MS = 5000;

export default function ShowroomHero() {
  const { video } = useShowroomImages();
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const pauseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReducedMotion) return;
    void v.play().catch(() => {});
    return () => v.pause();
  }, [prefersReducedMotion, video]);

  useEffect(
    () => () => {
      if (pauseTimeoutRef.current) window.clearTimeout(pauseTimeoutRef.current);
    },
    []
  );

  const handleEnded = () => {
    pauseTimeoutRef.current = window.setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = 0;
      void v.play().catch(() => {});
    }, PAUSE_BETWEEN_LOOPS_MS);
  };

  return (
    <section className="relative bg-brutal-black pt-32 pb-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start lg:max-w-[52%]"
          >
            <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
              AM <span className='text-white'>Performance</span>
            </p>
            <h1 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none mb-6">
              SHOWROOM
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10">
              Visitá nuestro showroom donde podés ver en persona las máquinas y el equipamiento para gimnasios que tenemos. Conocé de cerca la calidad, los materiales y cada parte de nuestro catálogo.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-white/60">
                <Ruler className="text-neon-green" size={20} />
                <span>Calidad certificada</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <Package className="text-neon-green" size={20} />
                <span>Asesoramiento técnico</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <Users className="text-neon-green" size={20} />
                <span>Verificación física</span>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/catalogo" className="brutal-btn-strong flex items-center space-x-2">
                <span>Ver Catálogo</span>
                <ArrowRight size={20} />
              </Link>
              <a
                href={getWhatsAppUrl('showroom')}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn-outline flex items-center space-x-2 mt-4"
              >
                <span>Agendar visita</span>
                <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
      </div>

      {/* Hero Video — alto completo del hero, ancho proporcional, fade al negro */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mx-auto mt-16 h-[55vh] aspect-[9/16] max-w-[85vw] overflow-hidden bg-white/5 lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:mt-0 lg:h-full lg:max-w-none"
      >
        <video
          ref={videoRef}
          src={video}
          muted
          playsInline
          preload="metadata"
          onEnded={handleEnded}
          className="h-full w-full object-cover grayscale"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brutal-black via-brutal-black/25 to-transparent" />
      </motion.div>
    </section>
  );
}
