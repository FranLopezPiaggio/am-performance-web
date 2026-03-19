'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Strengh from '@/assets/dumbells.jpg'
import Machine from '@/assets/machine-inside.jpg'

const categories = [
  {
    name: 'Cardio',
    image: Strengh,
    slug: 'cardio',
    gridArea: 'md:col-span-2 md:row-span-2'
  },
  {
    name: 'Máquinas',
    image: Machine,
    slug: 'maquinas',
    gridArea: 'md:col-span-1 md:row-span-1'
  },
  {
    name: 'Strengh',
    image: Strengh,
    slug: 'pesas-libres',
    gridArea: 'md:col-span-1 md:row-span-1'
  },
  {
    name: 'Accesorios',
    image: Machine,
    slug: 'accesorios',
    gridArea: 'md:col-span-2 md:row-span-1'
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Explorar</p>
          <h2 className="text-5xl font-display uppercase tracking-tighter">Categorías</h2>
        </div>
        <Link href="/catalogo" className="text-sm font-bold uppercase tracking-widest border-b-2 border-neon-green pb-1 hover:text-neon-green transition-colors">
          Ver Todo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalogo?categoria=${cat.slug}`}
            className={`relative group overflow-hidden ${cat.gridArea}`}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-brutal-black/40 group-hover:bg-brutal-black/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-4xl font-display uppercase tracking-tighter text-white group-hover:scale-110 transition-transform">
                {cat.name}
              </h3>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-neon-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        ))}
      </div>
    </section>
  );
}
