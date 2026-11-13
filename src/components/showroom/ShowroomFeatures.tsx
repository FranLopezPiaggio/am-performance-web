'use client';

import { motion } from 'framer-motion';
import { Ruler, Package, Users, ArrowRight } from 'lucide-react';

const features = [
  { icon: Ruler, title: 'Calidad certificada', desc: 'Materiales premium y resistencia verificada' },
  { icon: Package, title: 'Asesoramiento experto', desc: 'Ingenieros especializados en cada equipamiento' },
  { icon: Users, title: 'Verificación física', desc: 'Probar las máquinas antes de decidir' },
  { icon: ArrowRight, title: 'Planos a medida', desc: 'Diseño técnico para tu proyecto' }
];

export default function ShowroomFeatures() {
  return (
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
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white/5 border border-white/10 p-8 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10"
            >
              <div className="w-16 h-16 bg-neon-green/10 flex items-center justify-center mb-6 group-hover:bg-neon-green/20 transition-colors">
                <feature.icon className="text-neon-green text-2xl" />
              </div>
              <h3 className="text-xl font-display uppercase tracking-widest mb-4">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}