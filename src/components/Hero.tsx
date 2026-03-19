'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
const video = '/vid/gym-1-video-amp.webm'
// import bgHero from '@/assets/gym-black.jpg'
const bgHero = 'img/gym-black.jpg'

const slides = [
  {
    id: 1,
    title: 'Elite Performance',
    subtitle: 'Equipamiento profesional para atletas de alto rendimiento.',
    image: bgHero,
    cta: 'Ver Catálogo',
    link: '/catalogo'
  },
  {
    id: 2,
    title: 'Nuevos Ingresos',
    subtitle: 'Descubrí la línea AM Combat. Resistencia extrema.',
    image: bgHero,
    cta: 'Ver Novedades',
    link: '/catalogo?categoria=cardio'
  },
  {
    id: 3,
    title: 'Ofertas de Temporada',
    subtitle: 'Hasta 30% OFF en racks y multiestaciones.',
    image: bgHero,
    cta: 'Aprovechar',
    link: '/catalogo?ofertas=true'
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-brutal-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${slides[current].image})` }}
          />

          <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4"
            >
              AM Performance
            </motion.p>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-[0.9] mb-6 max-w-3xl"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/70 max-w-xl mb-10"
            >
              {slides[current].subtitle}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href={slides[current].link} className="brutal-btn flex items-center space-x-2">
                <span>{slides[current].cta}</span>
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-10 right-10 flex space-x-4">
        <button onClick={prev} className="p-4 border border-white/20 hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="p-4 border border-white/20 hover:bg-white/10 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-10 flex space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 transition-all duration-300 ${i === current ? 'w-12 bg-neon-green' : 'w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
}
