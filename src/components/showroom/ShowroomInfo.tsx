'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { showroomImages } from './images';

export default function ShowroomInfo() {
  return (
    <>
      {/* Información del Local */}
      <section className="py-24 bg-brutal-black relative overflow-hidden">
        <div
          style={{ backgroundImage: `url(${showroomImages[1]})` }}
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
                href={getWhatsAppUrl('showroom')}
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

      {/* CTA Final */}
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
                href={getWhatsAppUrl('showroom')}
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
    </>
  );
}