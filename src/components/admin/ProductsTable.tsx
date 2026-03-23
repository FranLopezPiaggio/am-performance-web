'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/types/database';
import { authenticatedFetch } from '@/hooks/authFetch';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('[ProductsTable] Fetching /api/admin/products...');
        const response = await authenticatedFetch('/api/admin/products');
        console.log('[ProductsTable] Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[ProductsTable] Error response:', errorText);
          throw new Error(`Error al cargar productos: ${response.status}`);
        }
        const data = await response.json();
        console.log('[ProductsTable] Data received:', data);
        setProducts(data);
      } catch (err) {
        console.error('[ProductsTable] Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/40 uppercase tracking-widest text-sm animate-pulse">
          Cargando productos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 text-red-500">
        <p className="font-bold uppercase tracking-widest mb-1">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 p-12 text-center">
        <p className="text-white/40 uppercase tracking-widest text-sm">
          No hay productos registrados
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              ID
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              SKU
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Nombre
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Precio Base
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Precio Oferta
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Stock
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Destacado
            </th>
            <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Entrega Inmediata
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="text-xs font-mono text-white/60">
                  {product.id.slice(0, 8)}...
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-xs font-mono text-white/60">
                  {product.sku || 'N/A'}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-medium">{product.name}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-display">
                  {formatCurrency(product.base_price)}
                </span>
              </td>
              <td className="py-4 px-4">
                {product.offer_price ? (
                  <span className="text-sm font-display text-neon-green">
                    {formatCurrency(product.offer_price)}
                  </span>
                ) : (
                  <span className="text-sm text-white/30">—</span>
                )}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest font-bold ${
                    product.in_stock
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {product.in_stock ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest font-bold ${
                    product.is_featured
                      ? 'bg-yellow/20 text-yellow'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {product.is_featured ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest font-bold ${
                    product.inmediately_available
                      ? 'bg-blue-400/20 text-blue-400'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {product.inmediately_available ? 'Sí' : 'No'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
