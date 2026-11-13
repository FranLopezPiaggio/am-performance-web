import Link from 'next/link';
import { MapPin, Ruler, Users, ArrowRight } from 'lucide-react';

const bannerItems = [
  { icon: MapPin, title: 'Showroom Físico', desc: 'Probá las máquinas en persona.' },
  { icon: Ruler, title: 'Calidad Real', desc: 'Conocé materiales y terminaciones.' },
  { icon: Users, title: 'Asesoramiento', desc: 'Equipo técnico en el local.' }
];

export default function ShowroomBanner() {
  return (
    <section className="bg-neon-green text-brutal-black py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        {bannerItems.map((item, i) => (
          <div key={i} className="flex items-center space-x-4">
            <item.icon size={32} strokeWidth={2.5} />
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs">{item.title}</h4>
              <p className="text-[10px] opacity-70 uppercase font-bold">{item.desc}</p>
            </div>
          </div>
        ))}
        <Link
          href="/showroom"
          className="bg-white text-neon-green font-bold uppercase tracking-widest text-sm px-8 py-4 flex items-center justify-center space-x-2 text-center hover:bg-brutal-black transition-colors"
        >
          <span>Visitar Showroom</span>
          <ArrowRight size={20} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}