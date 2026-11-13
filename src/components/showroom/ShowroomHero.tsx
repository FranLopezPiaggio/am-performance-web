'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ruler, Package, Users, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { showroomImages } from './images';

export default function ShowroomHero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center grayscale opacity-70"
        style={{ backgroundImage: `url(${showroomImages[0]})` }}
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

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-white/5 brutal-shadow"
          >
            <Image
              src={showroomImages[0]}
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
  );
}