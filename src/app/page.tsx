import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import BestSellersSection from '@/components/BestSellersSection';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getCategories, getBestSellers } from '@/lib/supabase/queries';
import Footer from '@/components/Footer';
import ShowroomBanner from '@/components/ShowroomBanner';
import TrustBar from '@/components/TrustBar';

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

export default function Home() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <TrustBar />
      <Hero />

      {/* Showroom Banner CTA */}
      <ShowroomBanner />

      <Suspense fallback={<GridFallback />}>
        <CategoryGridWrapper />
      </Suspense>

      <Suspense fallback={<BestSellersFallback />}>
        <BestSellersWrapper />
      </Suspense>

      {/* Footer */}
      <Footer />
    </main>
  );
}
