'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { showroomImages } from './images';

export default function ShowroomGallery() {
  return (
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
          {showroomImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-[3/4] overflow-hidden group bg-white/5 border border-white/10 brutal-shadow"
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
                  className="px-2 py-1 text-xs font-display uppercase tracking-widest text-white/90 bg-brutal-black/80"
                >
                  Zona {i + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}