import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import Crossfit from '@/assets/crossfit-equip.jpg';


const bestSellers = [
  {
    id: 'bs1',
    name: 'Mancuerna Hexagonal 20kg',
    price: 45000,
    image: Crossfit,
    category: 'Pesas Libres',
    rating: 5,
    reviews: 124,
    isNew: true
  },
  {
    id: 'bs2',
    name: 'Rack de Potencia Elite',
    price: 850000,
    image: Crossfit,
    category: 'Máquinas',
    rating: 5,
    reviews: 45
  },
  {
    id: 'bs3',
    name: 'Cinta de Correr T800',
    price: 1200000,
    image: Crossfit,
    category: 'Cardio',
    rating: 4,
    reviews: 89,
    discount: 15
  },
  {
    id: 'bs4',
    name: 'Banco Multiajustable',
    price: 180000,
    image: Crossfit,
    category: 'Máquinas',
    rating: 5,
    reviews: 67
  }
];

const trustItems = [
  { icon: Truck, title: 'Envíos a todo el país', desc: 'Llegamos a cada rincón de Argentina.' },
  { icon: ShieldCheck, title: 'Garantía Oficial', desc: 'Todos nuestros productos tienen respaldo.' },
  { icon: CreditCard, title: 'Pagos Seguros', desc: 'Mercado Pago y cuotas sin interés.' },
  { icon: Headphones, title: 'Soporte 24/7', desc: 'Asesoramiento técnico especializado.' }
];

export default function Home() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <Hero />

      {/* Trust Bar */}
      <section className="bg-white text-brutal-black py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {trustItems.map((item, i) => (
            <div key={i} className="flex items-center space-x-4">
              <item.icon size={32} strokeWidth={2.5} />
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs">{item.title}</h4>
                <p className="text-[10px] opacity-70 uppercase font-bold">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CategoryGrid />

      {/* Best Sellers */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Lo más buscado</p>
              <h2 className="text-5xl font-display uppercase tracking-tighter">Best Sellers</h2>
            </div>
            <Link href="/catalogo" className="text-sm font-bold uppercase tracking-widest border-b-2 border-neon-green pb-1 hover:text-neon-green transition-colors">
              Ver Catálogo
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="bg-neon-green p-12 md:p-24 flex flex-col md:flex-row items-center justify-between brutal-shadow">
          <div className="mb-8 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter text-brutal-black leading-[1]">
              Veni a conocer nuestro <b>SHOWROOM</b>
            </h2>
            <Link href="/contacto" className="text-brutal-black font-bold uppercase tracking-widest text-sm mt-6">Agenda una visita</Link>
          </div>
          <div className="w-full md:w-auto flex flex-col space-y-4">
            <input
              type="email"
              placeholder="TU EMAIL"
              className="bg-white border-2 border-brutal-black p-4 text-brutal-black font-bold placeholder:text-brutal-black/30 focus:outline-none w-full md:w-80"
            />
            <button className="bg-brutal-black text-neon-green p-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-brutal-black transition-colors">
              Suscribirme
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="md:col-span-2">
            <span className="text-4xl font-display uppercase tracking-tighter text-white mb-6 block">
              AM <span className="text-neon-green">Performance</span>
            </span>
            <p className="text-white/50 max-w-md uppercase text-xs font-bold leading-loose tracking-widest">
              Somos líderes en equipamiento de gimnasios y centros de alto rendimiento en Argentina.
              Diseñamos y fabricamos soluciones técnicas para atletas exigentes.
            </p>
          </div>
          <div>
            <h5 className="font-bold uppercase tracking-widest text-xs mb-6 text-neon-green">Navegación</h5>
            <ul className="space-y-4 text-sm uppercase tracking-widest font-medium">
              <li><Link href="/catalogo" className="hover:text-neon-green transition-colors">Catálogo</Link></li>
              <li><Link href="/catalogo?ofertas=true" className="hover:text-neon-green transition-colors">Ofertas</Link></li>
              <li><Link href="/nosotros" className="hover:text-neon-green transition-colors">Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-neon-green transition-colors">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold uppercase tracking-widest text-xs mb-6 text-neon-green">Contacto</h5>
            <ul className="space-y-4 text-sm uppercase tracking-widest font-medium text-white/70">
              <li>Av. Libertador 1234, CABA</li>
              <li>info@amperformance.com</li>
              <li>+54 11 4444-5555</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20">
            © 2024 AM PERFORMANCE. BRUTALIST TECHNICAL EQUIPMENT.
          </p>
        </div>
      </footer>
    </main>
  );
}
