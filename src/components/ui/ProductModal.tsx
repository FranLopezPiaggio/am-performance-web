// src/components/ui/ProductModal.tsx
// Product Detail Modal with Image Carousel
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '@/components/providers/ModalProvider';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/lib/supabase/products';
import type { Product } from '@/types/database';

export default function ProductModal() {
  const { isOpen, productId, closeModal } = useModal();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Reset state when modal opens - intentional pattern for modal behavior
  useEffect(() => {
    if (isOpen) {
      // Reset all state when modal opens
      setLoading(true);
      setQuantity(1);
      setCurrentImageIndex(0);
      setAddedToCart(false);
      setProduct(null);
    }
  }, [isOpen]);

  // Fetch product when productId changes
  useEffect(() => {
    if (!productId) return;

    getProductById(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeModal]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.offer_price || product.base_price,
      image: product.images?.[0] || '',
      category: product.name,
      rating: 5,
      reviews: 0,
    }, quantity);

    setAddedToCart(true);

    setTimeout(() => {
      closeModal();
    }, 1000);
  };

  const images = product?.images?.length ? product.images : ['/img/download.jpg'];
  const price = product?.offer_price || product?.base_price || 0;
  const originalPrice = product?.offer_price ? product.base_price : null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-brutal-black border border-white/20 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>

          {loading ? (
            // Loading State
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : product ? (
            // Product Content
            <>
              {/* Image Carousel */}
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-black">
                <Image
                  src={images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-neon-green' : 'bg-white/40'
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Stock Badge */}
                <div className="absolute top-4 left-4">
                  {product.in_stock ? (
                    <span className="bg-neon-green text-brutal-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                      En Stock
                    </span>
                  ) : (
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                      Agotado
                    </span>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                  {product.sku && (
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                      SKU: {product.sku}
                    </p>
                  )}
                  <h2 className="text-2xl md:text-3xl font-display uppercase tracking-tighter mb-4">
                    {product.name}
                  </h2>
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-display text-neon-green">
                      ${price.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="text-lg text-white/40 line-through">
                        ${originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">
                      Descripción
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Variants */}
                {product.variants && Object.keys(product.variants).length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">
                      Características
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(product.variants).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-3 py-1 bg-white/5 border border-white/10 text-xs"
                        >
                          <span className="text-white/40">{key}:</span>{' '}
                          <span className="text-white">{String(value)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">
                    Cantidad
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/20">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-3 hover:bg-white/5 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center bg-transparent border-none focus:outline-none text-lg font-medium"
                        min="1"
                        max={product.stock_quantity || 99}
                      />
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 99, q + 1))}
                        className="p-3 hover:bg-white/5 transition-colors"
                        disabled={quantity >= (product.stock_quantity || 99)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-xs text-white/40">
                      {product.stock_quantity || 0} disponibles
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || addedToCart}
                  className={`w-full py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${addedToCart
                    ? 'bg-neon-green text-brutal-black'
                    : product.in_stock
                      ? 'brutal-btn'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={20} />
                      <span>Agregado al Carrito</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      <span>{product.in_stock ? 'Agregar al Carrito' : 'Producto Agotado'}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            // Error State
            <div className="flex-1 flex items-center justify-center p-12">
              <p className="text-white/60">No se pudo cargar el producto</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
