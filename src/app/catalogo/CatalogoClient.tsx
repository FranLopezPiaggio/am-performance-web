'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useSupabase } from '@/context/SupabaseProvider';
import { getProducts } from '@/lib/supabase/queries';
import { mapProductToCard } from '@/lib/mappers/productMapper';
import type { ProductFilters } from '@/lib/supabase/queries';
import type { Category } from '@/types/database';
import type { ProductCardData } from '@/lib/mappers/productMapper';

interface CatalogoClientProps {
  initialProducts: ProductCardData[];
  total: number;
  categories: Category[];
}

const PAGE_SIZE = 12;

export default function CatalogoClient({ initialProducts, total, categories }: CatalogoClientProps) {
  const supabase = useSupabase();
  const searchParams = useSearchParams();
  const categoria = searchParams.get('categoria');
  const ofertas = searchParams.get('ofertas') === 'true';
  const search = searchParams.get('search');

  const [products, setProducts] = useState<ProductCardData[]>(initialProducts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const currentCategory = categoria
    ? categories.find((c) => c.slug === categoria)
    : null;
  const parentCategories = categories.filter((c) => !c.parent_id);
  const hasMore = products.length < total;

  // Group by subcategory when a parent category is selected
  const grouped = currentCategory && !currentCategory.parent_id
    ? Object.entries(
        products.reduce<Record<string, typeof products>>((acc, p) => {
          const key = p.category;
          if (!acc[key]) acc[key] = [];
          acc[key].push(p);
          return acc;
        }, {}),
      )
    : null;

  const filters: ProductFilters = {};
  if (categoria) filters.categorySlug = categoria;
  if (search) filters.search = search;

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    setLoadError(null);
    try {
      const newProducts = await getProducts(supabase!, {
        ...filters,
        limit: PAGE_SIZE,
        offset: products.length,
      });
      setProducts(prev => [...prev, ...newProducts.map(mapProductToCard)]);
    } catch {
      setLoadError('Error al cargar más productos');
    } finally {
      setIsLoadingMore(false);
    }
  }, [filters, products.length, supabase]);

  return (
    <>
      <section className="pt-32 pb-12 bg-brutal-black">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-6xl font-display uppercase tracking-tighter">
            {currentCategory
              ? currentCategory.name
              : search
                ? `Búsqueda: ${search}`
                : 'Catálogo'}
          </h1>
          <p className="text-white/40 uppercase tracking-widest text-xs mt-4">
            {total > 0
              ? `${total} producto${total !== 1 ? 's' : ''}`
              : 'Cargando...'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
          <Link
            href="/catalogo"
            className={`whitespace-nowrap px-5 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
              !categoria && !ofertas
                ? 'bg-neon-green text-brutal-black border-neon-green'
                : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'
            }`}
          >
            Todos
          </Link>
          {parentCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogo?categoria=${cat.slug}`}
              className={`whitespace-nowrap px-5 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
                categoria === cat.slug
                  ? 'bg-neon-green text-brutal-black border-neon-green'
                  : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/catalogo?ofertas=true"
            className={`whitespace-nowrap px-5 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
              ofertas
                ? 'bg-neon-green text-brutal-black border-neon-green'
                : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'
            }`}
          >
            Ofertas
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        {loadError && (
          <div className="text-center py-16">
            <p className="text-red-500 uppercase tracking-widest text-sm font-bold">
              {loadError}
            </p>
          </div>
        )}

        {!loadError && products.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/40 uppercase tracking-widest text-sm font-bold">
              No se encontraron productos
            </p>
          </div>
        )}

        {products.length > 0 && (
          <>
            {grouped ? (
              grouped.map(([subcatName, prods]) => (
                <div key={subcatName} className="mb-12">
                  <h3 className="text-lg font-display uppercase tracking-tighter text-white/40 mb-6 border-b border-white/10 pb-2">
                    {subcatName}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {prods.map((p, i) => (
                      <ProductCard key={p.id} product={p} priority={i === 0} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i === 0} />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-brutal-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
