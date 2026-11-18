'use client';

import Image from 'next/image';
import { Ruler, Package, Users, ArrowRight } from 'lucide-react';
import SplitSection from '@/components/SplitSection';
import { useShowroomImages } from './useShowroomImages';

const features = [
  { icon: Ruler, title: 'Calidad certificada', desc: 'Materiales premium y resistencia verificada' },
  { icon: Package, title: 'Asesoramiento experto', desc: 'Ingenieros especializados en cada equipamiento' },
  { icon: Users, title: 'Verificación física', desc: 'Probar las máquinas antes de decidir' },
  { icon: ArrowRight, title: 'Planos a medida', desc: 'Diseño técnico para tu proyecto' }
];

export default function ShowroomSpace() {
  const { space } = useShowroomImages();
  return (
    <>
      <SplitSection
        media={
          <Image
            src={space}
            alt="Equipamiento del showroom de AM Performance"
            fill
            className="object-cover grayscale"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        }
        title="Un espacio diseñado para el alto rendimiento"
      >
        <p className="text-white/60 leading-relaxed mb-8">
          En nuestro showroom de CABA podés probar las máquinas, ver los materiales de cerca y llevarte un proyecto a medida.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white/5 border border-white/10 p-5 brutal-shadow hover:border-white/30 transition-all"
            >
              <div className="w-10 h-10 bg-neon-green/10 flex items-center justify-center mb-3 group-hover:bg-neon-green/20 transition-colors">
                <feature.icon className="text-neon-green" size={20} />
              </div>
              <h3 className="text-sm font-display uppercase tracking-widest mb-2">{feature.title}</h3>
              <p className="text-white/60 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </SplitSection>

      {/* Marquee */}
      <section className="py-8 bg-brutal-black overflow-hidden">
        <div className="bg-gradient-to-r from-brutal-black via-brutal-black/80 to-brutal-black/70">
          <div className="relative overflow-hidden">
            <div
              className="flex w-max items-center animate-marquee"
              style={{ userSelect: 'none' }}
            >
              <span className="px-4 text-white/60 uppercase tracking-widest first:px-0">
                CALIDAD · MATERIALES · ASESORÍA TÉCNICA · MONTAJE · POST-VENTA · CALIDAD · MATERIALES · ASESORÍA TÉCNICA · MONTAJE · POST-VENTA ·
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
