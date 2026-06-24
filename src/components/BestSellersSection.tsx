'use client';

import Link from 'next/link';
import { useBestSellers } from '@/hooks/useBestSellers';
import { mapProductToCard } from '@/lib/mappers/productMapper';
import ProductCard from '@/components/ProductCard';

export default function BestSellersSection() {
  const { products, loading, error } = useBestSellers(4);

  const displayProducts = products.map(mapProductToCard);

  return (
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

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-500 font-bold uppercase tracking-widest text-sm">
            Error loading products
          </div>
        )}

        {!loading && !error && displayProducts.length === 0 && (
          <div className="text-center text-white/40 font-bold uppercase tracking-widest text-sm">
            No products available
          </div>
        )}

        {!loading && !error && displayProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
