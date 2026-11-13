'use client';

import ShowroomSplitSection from './ShowroomSplitSection';
import { showroomImages } from './images';

const benefits = [
  'Probar las máquinas y equipamiento en persona',
  'Conocer la calidad de los materiales y acabados',
  'Ver cada detalle de nuestro catálogo de productos',
  'Recibir asesoramiento experto para tu proyecto'
];

export default function ShowroomStatement() {
  return (
    <>
      <ShowroomSplitSection
        image={showroomImages[2]}
        imageAlt="Racks en el showroom de AM Performance"
        eyebrow="¿Qué esperás encontrar?"
        title="Un espacio diseñado para el alto rendimiento"
      >
        <div className="space-y-6 text-white/60">
          <p className="leading-relaxed">
            En nuestro showroom de CABA podés:
          </p>
          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 bg-neon-green mt-2.5 shrink-0" />
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </ShowroomSplitSection>

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
