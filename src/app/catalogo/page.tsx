'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getProducts, getProductsByCategory, getCategories, mapProductToCard } from '@/lib/supabase/products';
import type { Category } from '@/lib/supabase/products';

import Logo from '@/assets/download.jpg'

// Category type for UI
interface CategoryUI {
  name: string;
  slug: string;
}

// Mapped product type for UI (returned by mapProductToCard)
interface MappedProduct {
  id: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: number;
  in_stock: boolean;
  inmediately_available: boolean;
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('categoria') || 'todos';
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [categories, setCategories] = useState<CategoryUI[]>([
    { name: 'Todos', slug: 'todos' },
    { name: 'Cardio', slug: 'cardio' },
    { name: 'Máquinas', slug: 'musculacion' },
    { name: 'Pesas Libres', slug: 'crossfit' },
    { name: 'Accesorios', slug: 'accesorios' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  // Fetch categories from Supabase on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dbCategories = await getCategories();
        if (dbCategories.length > 0) {
          const uiCategories: CategoryUI[] = [
            { name: 'Todos', slug: 'todos' },
            ...dbCategories.map((c: Category) => ({ name: c.name, slug: c.slug }))
          ];
          setCategories(uiCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fall back to static categories
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let productsList;

        if (activeCategory === 'todos') {
          productsList = await getProducts();
        } else {
          productsList = await getProductsByCategory(activeCategory);
        }

        // Map products to UI format (async to fetch category via join table)
        const mapped = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          productsList.map((product: any) => mapProductToCard(product))
        );

        setProducts(mapped);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  // mappedProducts is now stored directly in products state

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Equipamiento</p>
          <h1 className="text-6xl font-display uppercase tracking-tighter">Catálogo</h1>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat.slug
                ? 'bg-neon-green text-brutal-black'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="py-24 text-center border border-white/10 bg-white/5">
          <p className="font-display uppercase text-2xl text-white/30">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense fallback={<div className="pt-32 px-4 text-center font-display uppercase">Cargando catálogo...</div>}>
        <CatalogContent />
      </Suspense>
    </main>
  );
}
