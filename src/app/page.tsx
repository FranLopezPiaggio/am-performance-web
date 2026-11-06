import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import BestSellersSection from '@/components/BestSellersSection';
import Link from 'next/link';
import { Suspense } from 'react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getCategories, getBestSellers } from '@/lib/supabase/queries';
import Footer from '@/components/Footer';

async function CategoryGridWrapper() {
  const supabase = await createClient();
  const categories = await getCategories(supabase);
  return <CategoryGrid categories={categories} />;
}

async function BestSellersWrapper() {
  const supabase = await createClient();
  const bestSellers = await getBestSellers(supabase, 8);
  return <BestSellersSection products={bestSellers} />;
}

function GridFallback() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square bg-white/5 animate-pulse brutal-shadow" />
        ))}
      </div>
    </section>
  );
}

function BestSellersFallback() {
  return (
    <section className="py-24 bg-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse brutal-shadow" />
          ))}
        </div>
      </div>
    </section>
  );
}

const trustItems = [
  { icon: Truck, title: 'Envíos a todo el país', desc: 'Llegamos a cada rincón de Argentina.' },
  { icon: ShieldCheck, title: 'Garantía Oficial', desc: 'Todos nuestros productos tienen respaldo.' },
  { icon: CreditCard, title: 'Pagos Seguros', desc: 'Mercado Pago y cuotas fijas.' },
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

      <Suspense fallback={<GridFallback />}>
        <CategoryGridWrapper />
      </Suspense>

      <Suspense fallback={<BestSellersFallback />}>
        <BestSellersWrapper />
      </Suspense>

      {/* Newsletter / CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="bg-neon-green p-12 md:p-24 flex flex-col md:flex-row items-center justify-between brutal-shadow">
          <div className="mb-8 md:mb-0">
            <Link href="/showroom" className="block">
              <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter text-brutal-black leading-[1] hover:underline">
                Veni a conocer nuestro <b>SHOWROOM</b>
              </h2>
            </Link>
            <a href={getWhatsAppUrl('info')} target="_blank" rel="noopener noreferrer" className="text-brutal-black font-bold uppercase tracking-widest text-sm mt-6 inline-block hover:underline">Agenda una visita</a>
          </div>
          <div className="w-full md:w-auto flex flex-col space-y-4">
            <a
              href={getWhatsAppUrl('showroom')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brutal-black text-neon-green p-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-brutal-black transition-colors flex items-center justify-center text-center w-full md:w-80"
            >
              Agendar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
