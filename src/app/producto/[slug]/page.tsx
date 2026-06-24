'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ChevronLeft, Package, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useProduct } from '@/hooks/useProduct';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { mapProductToCard } from '@/lib/mappers/productMapper';
import type { ProductVariant, ProductImage } from '@/types/database';

// ─── Image Gallery ───────────────────────────────────────────────────────────

function ImageGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const primaryIndex = sorted.findIndex((img) => img.is_primary);
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const current = sorted[selectedIndex];

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-white/5 flex items-center justify-center">
        <Package size={48} className="text-white/20" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-brutal-black border border-white/10 overflow-hidden">
        <Image
          src={current.image_url}
          alt={current.alt_text ?? productName}
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
          priority
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-20 flex-shrink-0 border-2 transition-colors overflow-hidden ${
                i === selectedIndex
                  ? 'border-neon-green'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text ?? `${productName} ${i + 1}`}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Variant Selector ─────────────────────────────────────────────────────────

function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const activeVariants = variants.filter((v) => v.is_active);

  if (activeVariants.length <= 1) return null;

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">
        Presentación
      </p>
      <div className="flex flex-wrap gap-3">
        {activeVariants.map((v) => {
          const isSelected = v.id === selectedId;
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border transition-all ${
                isSelected
                  ? 'bg-neon-green text-brutal-black border-neon-green'
                  : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              {v.variant_name}
              {v.stock <= 0 && (
                <span className="block text-[10px] font-normal opacity-60">Sin stock</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Delivery Badge ───────────────────────────────────────────────────────────

function DeliveryBadge({ stock }: { stock: number }) {
  if (stock > 0) {
    return (
      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2">
        <Truck size={16} className="text-green-400" />
        <span className="text-green-400 text-xs font-bold uppercase tracking-widest">
          Entrega Inmediata
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-yellow/10 border border-yellow/20 px-4 py-2">
      <Package size={16} className="text-yellow" />
      <span className="text-yellow text-xs font-bold uppercase tracking-widest">
        A Coordinar
      </span>
    </div>
  );
}

// ─── Related Products ─────────────────────────────────────────────────────────

function RelatedProducts({
  categorySlug,
  excludeProductId,
}: {
  categorySlug: string;
  excludeProductId: string;
}) {
  const { products, loading, error } = useProducts({ categorySlug }, 5);

  if (error || (!loading && products.length === 0)) return null;

  const related = products
    .filter((p) => p.id !== excludeProductId)
    .slice(0, 4)
    .map(mapProductToCard);

  if (related.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-display uppercase tracking-tighter mb-12">
        Productos Relacionados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-48 bg-white/5 animate-pulse mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="aspect-square bg-white/5 animate-pulse" />

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="h-6 w-24 bg-white/5 animate-pulse" />
          <div className="h-12 w-3/4 bg-white/5 animate-pulse" />
          <div className="h-8 w-32 bg-white/5 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-white/5 animate-pulse" />
            <div className="h-4 w-full bg-white/5 animate-pulse" />
            <div className="h-4 w-2/3 bg-white/5 animate-pulse" />
          </div>
          <div className="h-14 w-full bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { product, loading, error } = useProduct(slug);
  const { addToCart } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Determine selected variant
  const activeVariants = product?.variants.filter((v) => v.is_active) ?? [];
  const selectedVariant =
    activeVariants.find((v) => v.id === selectedVariantId) ??
    activeVariants[0] ?? null;

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <ProductDetailSkeleton />
      </main>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center">
          <div className="inline-block p-8 bg-white/5 border border-white/10 mb-8">
            <Package size={64} className="text-white/20 mx-auto" />
          </div>
          <h1 className="text-4xl font-display uppercase tracking-tighter mb-4">
            Error al cargar el producto
          </h1>
          <p className="text-white/50 uppercase tracking-widest text-sm mb-12">
            {error.message}
          </p>
          <Link href="/catalogo" className="brutal-btn inline-block">
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  // ─── Not found ────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 text-center">
          <div className="inline-block p-8 bg-white/5 border border-white/10 mb-8">
            <Package size={64} className="text-white/20 mx-auto" />
          </div>
          <h1 className="text-4xl font-display uppercase tracking-tighter mb-4">
            Producto no encontrado
          </h1>
          <p className="text-white/50 uppercase tracking-widest text-sm mb-12">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link href="/catalogo" className="brutal-btn inline-block">
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  // ─── Product found ────────────────────────────────────────────────────────
  const hasDiscount =
    selectedVariant &&
    selectedVariant.compare_at_price &&
    selectedVariant.compare_at_price > selectedVariant.price;

  const discountPercent = hasDiscount
    ? Math.round((1 - selectedVariant!.price / selectedVariant!.compare_at_price!) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: selectedVariant?.price ?? 0,
        image:
          product.images.find((i) => i.is_primary)?.image_url ??
          product.images[0]?.image_url ??
          '',
        category: product.category.name,
        inmediatamente_available: (selectedVariant?.stock ?? 0) > 0,
        delivery_lead_days: null,
      },
      1
    );
  };

  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-8">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/40">
          <Link href="/catalogo" className="hover:text-neon-green transition-colors">
            Catálogo
          </Link>
          <span>/</span>
          <Link
            href={`/catalogo?categoria=${product.category.slug}`}
            className="hover:text-neon-green transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-white/80">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Gallery */}
          <ImageGallery images={product.images} productName={product.name} />

          {/* Right: Info */}
          <div className="flex flex-col gap-6">
            {/* Category & Line */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                {product.category.name}
              </span>
              {product.line && (
                <>
                  <span className="text-white/20">|</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    {product.line.name}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-display uppercase tracking-tighter leading-[1]">
              {product.name}
            </h1>

            {/* Short description */}
            {product.short_description && (
              <p className="text-white/60 text-sm leading-relaxed uppercase tracking-wider">
                {product.short_description}
              </p>
            )}

            {/* Delivery Badge */}
            <DeliveryBadge stock={selectedVariant?.stock ?? 0} />

            {/* Price */}
            <div>
              <div className="flex items-end gap-4">
                <span className="text-5xl font-display text-white">
                  ${(selectedVariant?.price ?? 0).toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-white/30 line-through mb-1">
                      ${selectedVariant!.compare_at_price!.toLocaleString()}
                    </span>
                    <span className="bg-white text-brutal-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-1">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Variant Selector */}
            <VariantSelector
              variants={product.variants}
              selectedId={selectedVariant?.id ?? null}
              onSelect={setSelectedVariantId}
            />

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock <= 0}
              className="w-full bg-neon-green text-brutal-black py-5 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              {selectedVariant && selectedVariant.stock > 0
                ? 'Agregar al carrito'
                : 'Sin stock disponible'}
            </button>

            {/* Full Description */}
            <div className="border-t border-white/10 pt-6 mt-2">
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-4">
                Descripción
              </p>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Disciplines */}
            {product.disciplines.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">
                  Disciplinas
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.disciplines.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-white/20 text-white/60"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to catalog */}
            <Link
              href="/catalogo"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-neon-green transition-colors mt-4"
            >
              <ChevronLeft size={14} />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        categorySlug={product.category.slug}
        excludeProductId={product.id}
      />
    </main>
  );
}
