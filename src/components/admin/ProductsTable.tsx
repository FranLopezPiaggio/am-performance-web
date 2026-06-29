'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ExternalLink, ImageUp } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { mapProductToCard } from '@/lib/mappers/productMapper';

export default function ProductsTable() {
  const { products, loading, error, total } = useProducts({}, 100);
  const displayProducts = products.map(mapProductToCard);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <Package size={32} className="text-white/20 mx-auto mb-4" />
        <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
          Error al cargar productos
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">
          {error.message}
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-16 text-center">
        <Package size={48} className="text-white/20 mx-auto mb-4" />
        <p className="text-white/60 uppercase tracking-widest text-sm mb-2">
          Sin productos
        </p>
        <p className="text-white/30 text-xs uppercase tracking-widest">
          No hay productos en el catálogo todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="p-4 border-b border-white/10">
        <p className="text-xs uppercase tracking-widest text-white/40">
          {total} producto{total !== 1 ? 's' : ''} en total
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            <th className="text-left px-4 py-3">Producto</th>
            <th className="text-left px-4 py-3">Categoría</th>
            <th className="text-right px-4 py-3">Precio</th>
            <th className="text-center px-4 py-3">Stock</th>
            <th className="text-center px-4 py-3">Estado</th>
            <th className="text-right px-4 py-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map((p) => (
            <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-4 py-4">
                <span className="font-bold text-white uppercase tracking-wider">
                  {p.name}
                </span>
              </td>
              <td className="px-4 py-4 text-white/50 uppercase tracking-widest text-[10px]">
                {p.category}
              </td>
              <td className="px-4 py-4 text-right font-bold text-white">
                ${p.price.toLocaleString()}
              </td>
              <td className="px-4 py-4 text-center">
                <span className={`text-xs font-bold ${
                  p.inmediately_available ? 'text-green-400' : 'text-yellow'
                }`}>
                  {p.inmediately_available ? 'Disponible' : 'A Coordinar'}
                </span>
              </td>
              <td className="px-4 py-4 text-center">
                {p.isNew && (
                  <span className="bg-neon-green/20 text-neon-green text-[10px] px-2 py-1 font-bold uppercase tracking-widest">
                    Nuevo
                  </span>
                )}
                {p.discount && (
                  <span className="bg-white/20 text-white text-[10px] px-2 py-1 font-bold uppercase tracking-widest ml-1">
                    -{p.discount}%
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/productos/${p.slug}/imagenes`}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/40 hover:text-neon-green transition-colors"
                  >
                    <ImageUp size={12} />
                    Imágenes
                  </Link>
                  <Link
                    href={`/producto/${p.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/40 hover:text-neon-green transition-colors"
                  >
                    <ExternalLink size={12} />
                    Ver
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
