'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SplitSectionProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  reverse?: boolean;
  children: ReactNode;
}

export default function ShowroomSplitSection({
  image,
  imageAlt,
  eyebrow,
  title,
  reverse = false,
  children,
}: SplitSectionProps) {
  return (
    <section className="min-h-[70vh] md:min-h-[80vh] grid grid-cols-1 md:grid-cols-2 bg-brutal-black">
      <div className={`relative h-[40vh] md:h-auto overflow-hidden ${reverse ? 'md:order-2' : ''}`}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover grayscale"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          className={`absolute inset-0 ${
            reverse
              ? 'bg-gradient-to-l from-transparent via-transparent to-brutal-black'
              : 'bg-gradient-to-r from-transparent via-transparent to-brutal-black'
          }`}
        />
      </div>

      <div className={`flex items-center ${reverse ? 'md:order-1' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-xl px-8 md:px-16 py-16"
        >
          <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
            {eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter mb-8">
            {title}
          </h2>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
