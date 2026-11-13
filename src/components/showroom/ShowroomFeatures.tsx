'use client';

import { Ruler, Package, Users, ArrowRight } from 'lucide-react';
import ShowroomSplitSection from './ShowroomSplitSection';
import { showroomImages } from './images';

const features = [
  { icon: Ruler, title: 'Calidad certificada', desc: 'Materiales premium y resistencia verificada' },
  { icon: Package, title: 'Asesoramiento experto', desc: 'Ingenieros especializados en cada equipamiento' },
  { icon: Users, title: 'Verificación física', desc: 'Probar las máquinas antes de decidir' },
  { icon: ArrowRight, title: 'Planos a medida', desc: 'Diseño técnico para tu proyecto' }
];

export default function ShowroomFeatures() {
  return (
    <ShowroomSplitSection
      image={showroomImages[3]}
      imageAlt="Rack con dumbells del showroom"
      eyebrow="Características"
      title="Lo que podés experimentar"
      reverse
    >
      <div className="grid grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group bg-white/5 border border-white/10 p-6 brutal-shadow hover:border-white/30 transition-all"
          >
            <div className="w-12 h-12 bg-neon-green/10 flex items-center justify-center mb-4 group-hover:bg-neon-green/20 transition-colors">
              <feature.icon className="text-neon-green" size={24} />
            </div>
            <h3 className="text-base font-display uppercase tracking-widest mb-2">{feature.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </ShowroomSplitSection>
  );
}
