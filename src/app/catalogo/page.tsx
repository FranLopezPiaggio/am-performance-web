import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getProducts, getProductCount, getCategories } from '@/lib/supabase/queries';
import { mapProductToCard } from '@/lib/mappers/productMapper';
import Navbar from '@/components/Navbar';
import CatalogoClient from './CatalogoClient';
import type { ProductFilters } from '@/lib/supabase/queries';

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const categoria = typeof sp.categoria === 'string' ? sp.categoria : undefined;
  const search = typeof sp.search === 'string' ? sp.search : undefined;

  const supabase = await createClient();
  const filters: ProductFilters = {};
  if (categoria) filters.categorySlug = categoria;
  if (search) filters.search = search;

  const [products, total, categories] = await Promise.all([
    getProducts(supabase, { ...filters, limit: 12, offset: 0 }),
    getProductCount(supabase, filters),
    getCategories(supabase),
  ]);

  const initialProducts = products.map(mapProductToCard);

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <Suspense
        fallback={
          <div className="pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="h-16 w-64 bg-white/5 animate-pulse mb-4" />
              <div className="h-4 w-32 bg-white/5 animate-pulse" />
            </div>
          </div>
        }
      >
        <CatalogoClient
          key={JSON.stringify(sp)}
          initialProducts={initialProducts}
          total={total}
          categories={categories}
        />
      </Suspense>
    </main>
  );
}
