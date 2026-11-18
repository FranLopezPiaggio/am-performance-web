'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { CONTACT } from '@/lib/config/contact';
import { SHOWROOM } from '@/lib/config/showroom';
import { useShowroomImages } from './useShowroomImages';
import ShowroomMap from './ShowroomMap';

export default function ShowroomInfo() {
  const { info } = useShowroomImages();
  return (
    <>
      {/* Información del Local */}
      <section className="py-24 bg-brutal-black relative overflow-hidden">
        <div
          style={{ backgroundImage: `url(${info})` }}
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
              <h2 className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-display uppercase tracking-tighter mb-4">
                <MapPin className="text-neon-green shrink-0" size={28} />
                {CONTACT.address}
              </h2>
              <p className="text-white/60 text-lg mb-6">
                Horario: {SHOWROOM.hours}
              </p>
              <a
                href={getWhatsAppUrl('showroom')}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn-strong w-full flex items-center justify-center space-x-2 py-4 px-8 uppercase tracking-widest text-sm"
              >
                <span>Agendar visita</span>
                <ArrowRight size={20} />
              </a>
            </div>

            <div className="mt-8">
              <ShowroomMap />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final
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
                <span>Agendar visita</span>
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
      </section> */}
    </>
  );
}