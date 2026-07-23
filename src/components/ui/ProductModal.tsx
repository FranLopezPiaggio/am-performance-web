'use client';

import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import { useModal } from '@/components/providers/ModalProvider';
import { useProduct } from '@/hooks/useProduct';
import { useCart } from '@/context/CartContext';
import { mapProductToCard } from '@/lib/mappers/productMapper';

export default function ProductModal() {
  const { isOpen, productId, closeModal } = useModal();
  const { product, loading, error } = useProduct(productId ?? undefined);
  const { addToCart } = useCart();

  return (
    <>{isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-brutal-black border border-white/10 p-8 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {loading && (
              <div className="flex items-center justify-center h-48">
                <p className="text-white/60">Cargando...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-48">
                <p className="text-red-500">Error al cargar producto</p>
              </div>
            )}

            {product && (
              <>
                <h2 className="text-3xl font-display uppercase tracking-tighter text-neon-green mb-4">
                  {product.name}
                </h2>
                <div className="flex gap-6">
                  {(() => {
                    const firstImage = product.images.find(i => i.is_primary) || product.images[0];
                    return firstImage ? (
                      <div className="w-48 h-48 flex-shrink-0 relative">
                        <SafeImage
                          src={firstImage.image_url}
                          alt={firstImage.alt_text ?? product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center bg-brutal-black text-white/20 text-xs uppercase tracking-widest">
                        Sin imagen
                      </div>
                    );
                  })()}
                  <div className="flex flex-col gap-4 flex-1">
                    <p className="text-white/80 text-sm leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-auto">
                      <p className="text-2xl font-display text-white mb-4">
                        ${(product.variants.find(v => v.is_active)?.price ?? product.variants[0]?.price ?? 0).toLocaleString()}
                      </p>
                      <button
                        onClick={() => addToCart(mapProductToCard(product), 1)}
                        className="bg-neon-green text-brutal-black px-6 py-3 font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-white transition-colors"
                      >
                        <ShoppingCart size={18} />
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}</>
  );
}
