'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ruler, Package, Users, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

const images = [
  '/img/gym-black.jpg',
  '/img/crossfit-equip.jpg',
  '/img/racks.jpg',
  '/img/rack-dumbells.jpg',
  '/img/dumbells.jpg',
  '/img/dumbell-cajon.jpg',
  '/img/racks-outside.jpg',
  '/img/machine-inside.jpg',
];

export default function ShowroomContent() {
  return (
    <section className="min-h-screen bg-brutal-black">
      {/* A. Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale opacity-70"
          style={{ backgroundImage: `url(${images[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brutal-black via-brutal-black/90 to-brutal-black/70" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start"
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
                  href={typeof window !== 'undefined' ? getWhatsAppUrl('showroom') : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn-outline flex items-center space-x-2 mt-4"
                >
                  <span>Agendar visita</span>
                  <ArrowRight size={20} />
                </a>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative bg-white/5 brutal-shadow"
            >
              <Image
                src={images[0]}
                alt="Showroom equipamiento"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* B. Statement Section */}
      <section className="py-24 bg-brutal-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
              ¿Qué esperás encontrar?
            </p>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter">
              Un espacio diseñado para el alto rendimiento
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="prose prose-invert lg:prose-lg">
              <p className="text-white/60 leading-relaxed mb-6">
                En nuestro showroom de {images.length > 0 ? 'CABA' : 'Argentina'} podés:
              </p>
              <ul className="list-disc list-inside text-white/60 space-y-2">
                <li>
                  Probar las máquinas y equipamiento en persona
                </li>
                <li>
                  Conocer la calidad de los materiales y acabados
                </li>
                <li>
                  Ver cada detalle de nuestro catálogo de productos
                </li>
                <li>
                  Recibir asesoramiento experto para tu proyecto
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="group bg-white/5 border border-white/10 p-6 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10">
                <div className="w-12 h-12 bg-neon-green/10 flex items-center justify-center mb-4 group-hover:bg-neon-green/20 transition-colors">
                  <Ruler className="text-neon-green text-2xl" />
                </div>
                <h3 className="text-xl font-display uppercase tracking-widest mb-2">Calidad certificada</h3>
                <p className="text-white/60 text-sm">
                  Materiales premium y resistencia verificada
                </p>
              </div>

              <div className="group bg-white/5 border border-white/10 p-6 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10">
                <div className="w-12 h-12 bg-neon-green/10 flex items-center justify-center mb-4 group-hover:bg-neon-green/20 transition-colors">
                  <Package className="text-neon-green text-2xl" />
                </div>
                <h3 className="text-xl font-display uppercase tracking-widest mb-2">Asesoramiento</h3>
                <p className="text-white/60 text-sm">
                  Ingenieros especializados en cada equipamiento
                </p>
              </div>

              <div className="group bg-white/5 border border-white/10 p-6 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10">
                <div className="w-12 h-12 bg-neon-green/10 flex items-center justify-center mb-4 group-hover:bg-neon-green/20 transition-colors">
                  <Users className="text-neon-green text-2xl" />
                </div>
                <h3 className="text-xl font-display uppercase tracking-widest mb-2">Verificación física</h3>
                <p className="text-white/60 text-sm">
                  Probar antes de decidir
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* C. Marquee Section */}
      <section className="py-8 bg-brutal-black overflow-hidden">
        <div className="bg-gradient-to-r from-brutal-black via-brutal-black/80 to-brutal-black/70">
          <div className="relative">
            <div
              className="inline-flex items-center gap-2 overflow-x-auto animate-marquee"
              style={{ userSelect: 'none' }}
            >
              <span className="px-4 text-white/60 uppercase tracking-widest first:px-0">
                CALIDAD · MATERIALES · ASESORÍA TÉCNICA · MONTAJE · POST-VENTA · CALIDAD · MATERIALES · ASESORÍA TÉCNICA · MONTAJE · POST-VENTA ·
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* D. Galería Asimétrica */}
      <section className="py-24 bg-brutal-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
              Galería del showroom
            </p>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter">
              Equipamiento en persona
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden group bg-white/5 border border-white/10 brutal-shadow"
              >
                <Image
                  src={img}
                  alt={`Showroom ${i}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="100%"
                />
                <div className="absolute top-3 left-3 right-3 flex space-x-2">
                  <span
                    className="px-2 py-1 text-xs font-display uppercase tracking-widest text-white/90 bg-brutal-black/80 backdrop-blur-md rounded"
                  >
                    Zona {i + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E. Qué podés ver en persona */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
              Características
            </p>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter">
              Lo que podés experimentar
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group bg-white/5 border border-white/10 p-8 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10">
              <div className="w-16 h-16 bg-neon-green/10 flex items-center justify-center mb-6 group-hover:bg-neon-green/20 transition-colors">
                <Ruler className="text-neon-green text-2xl" />
              </div>
              <h3 className="text-xl font-display uppercase tracking-widest mb-4">Calidad certificada</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Materiales premium y resistencia verificada
              </p>
            </div>

            <div className="group bg-white/5 border border-white/10 p-8 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10">
              <div className="w-16 h-16 bg-neon-green/10 flex items-center justify-center mb-6 group-hover:bg-neon-green/20 transition-colors">
                <Package className="text-neon-green text-2xl" />
              </div>
              <h3 className="text-xl font-display uppercase tracking-widest mb-4">Asesoramiento experto</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Ingenieros especializados en cada equipamiento
              </p>
            </div>

            <div className="group bg-white/5 border border-white/10 p-8 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10">
              <div className="w-16 h-16 bg-neon-green/10 flex items-center justify-center mb-6 group-hover:bg-neon-green/20 transition-colors">
                <Users className="text-neon-green text-2xl" />
              </div>
              <h3 className="text-xl font-display uppercase tracking-widest mb-4">Verificación física</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Probar las máquinas antes de decidir
              </p>
            </div>

            <div className="group bg-white/5 border border-white/10 p-8 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10">
              <div className="w-16 h-16 bg-neon-green/10 flex items-center justify-center mb-6 group-hover:bg-neon-green/20 transition-colors">
                <ArrowRight className="text-neon-green text-2xl" />
              </div>
              <h3 className="text-xl font-display uppercase tracking-widest mb-4">Planos a medida</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Diseño técnico para tu proyecto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* F. Información del Local */}
      <section className="py-24 bg-brutal-black relative overflow-hidden">
        <div
          style={{ backgroundImage: `url(${images[1]})` }}
          className="absolute inset-0 bg-cover bg-center grayscale opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brutal-black via-brutal-black/80 to-brutal-black/60" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-20"
          >
            <div className="inline-block bg-neon-green/10 border border-neon-green p-8 brutal-shadow mb-8">
              <p className="text-neon-green font-bold uppercase tracking-widest text-sm mb-4">
                Visitanos
              </p>
              <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tighter mb-6">
                Av. Libertador 1234, CABA
              </h2>
              <p className="text-white/60 text-lg mb-4">
                Horario: Lunes a Viernes 9:00 - 19:00
              </p>
              <a
                href="https://maps.google.com/?q=Av.+Libertador+1234,+CABA"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn flex items-center space-x-2"
              >
                <span>Ver en Google Maps</span>
                <ArrowRight size={20} />
              </a>
            </div>

            <div>
              <a
                href={typeof window !== 'undefined' ? getWhatsAppUrl('showroom') : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn-strong w-full brutal-shadow mt-8 py-4 px-8 uppercase tracking-widest text-sm"
              >
                <span>Agendar visita por WhatsApp</span>
                <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* G. CTA Final */}
      <section className="py-24 bg-neon-green">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center"
          >
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-6">
              Listo para construir tu <span className="text-brutal-black">sueño</span>?
            </h2>
            <p className="text-brutal-black text-white/60 mb-10 max-w-2xl mx-auto">
              No importa si empezás en tu garage o si pensás en grande. Te acompañamos en cada paso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={typeof window !== 'undefined' ? getWhatsAppUrl('showroom') : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn flex items-center space-x-2"
              >
                <span>Agendar tu visita</span>
                <ArrowRight size={20} />
              </a>
              <Link
                href="/catalogo"
                className="brutal-btn-outline flex items-center space-x-2"
              >
                <span>Ver Catálogo</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </section>
  );
}