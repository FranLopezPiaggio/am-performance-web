'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useModal } from '@/components/providers/ModalProvider';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string | StaticImageData;
    category: string;
    rating: number;
    reviews: number;
    isNew?: boolean;
    discount?: number;
    inmediate_delivery?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { openModal } = useModal();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-white/5 border border-white/10 overflow-hidden relative"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-neon-green text-brutal-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            Nuevo
          </span>
        )}
        {product.inmediate_delivery && (
          <span className="bg-yellow text-brutal-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            Entrega Inmediata
          </span>
        )}
        {product.discount && (
          <span className="bg-white text-brutal-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-brutal-black">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brutal-black/20 group-hover:bg-transparent transition-colors" />

        {/* View Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal(product.id);
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-white text-brutal-black font-bold uppercase tracking-widest text-xs flex items-center gap-2"
        >
          <Eye size={14} />
          <span>Ver Detalles</span>
        </button>

        {/* Quick Add */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="absolute bottom-0 left-0 w-full py-4 bg-neon-green text-brutal-black font-bold uppercase tracking-widest text-xs translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={16} />
          <span>Agregar al carrito</span>
        </button>
      </div>

      {/* Info */}
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">{product.category}</p>
        <h3 className="font-display uppercase text-xl leading-tight mb-3 group-hover:text-neon-green transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < product.rating ? 'fill-neon-green text-neon-green' : 'text-white/20'}
            />
          ))}
          <span className="text-[10px] text-white/40 ml-2">({product.reviews})</span>
        </div>

        <div className="flex items-end space-x-3">
          <span className="text-2xl font-display text-white">${product.price.toLocaleString()}</span>
          {product.discount && (
            <span className="text-sm text-white/30 line-through mb-1">
              ${(product.price / (1 - product.discount / 100)).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
