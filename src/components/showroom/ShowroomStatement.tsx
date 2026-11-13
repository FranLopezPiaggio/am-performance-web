'use client';

import { motion } from 'framer-motion';
import { Ruler, Package, Users } from 'lucide-react';

const statementCards = [
  { icon: Ruler, title: 'Calidad certificada', desc: 'Materiales premium y resistencia verificada' },
  { icon: Package, title: 'Asesoramiento', desc: 'Ingenieros especializados en cada equipamiento' },
  { icon: Users, title: 'Verificación física', desc: 'Probar antes de decidir' }
];

export default function ShowroomStatement() {
  return (
    <>
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
                En nuestro showroom de CABA podés:
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
              {statementCards.map((card) => (
                <div
                  key={card.title}
                  className="group bg-white/5 border border-white/10 p-6 brutal-shadow hover:border-white/30 transition-all group-hover:bg-white/10"
                >
                  <div className="w-12 h-12 bg-neon-green/10 flex items-center justify-center mb-4 group-hover:bg-neon-green/20 transition-colors">
                    <card.icon className="text-neon-green text-2xl" />
                  </div>
                  <h3 className="text-xl font-display uppercase tracking-widest mb-2">{card.title}</h3>
                  <p className="text-white/60 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
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
    </>
  );
}