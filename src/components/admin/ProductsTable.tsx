'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, ExternalLink, ImageUp, ChevronDown, ChevronRight, Save } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import type { ProductVariant } from '@/types/database';

function VariantRow({ variant, productId, onStockUpdated }: {
  variant: ProductVariant;
  productId: string;
  onStockUpdated: (variantId: string, stock: number) => void;
}) {
  const [stock, setStock] = useState(variant.stock);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants/${variant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      onStockUpdated(variant.id, stock);
    } catch {
      setStock(variant.stock); // revert
    } finally {
      setSaving(false);
    }
  };

  const changed = stock !== variant.stock;

  return (
    <tr className="border-b border-white/5 bg-white/[0.02]">
      <td className="px-4 py-3 pl-12">
        <span className="text-white/70 text-xs">{variant.variant_name}</span>
      </td>
      <td />
      <td className="px-4 py-3 text-right">
        <span className="text-white/50 text-xs font-mono">${variant.price.toLocaleString()}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-20 bg-black border border-white/10 px-3 py-1.5 text-white text-xs text-center focus:border-neon-green focus:outline-none transition-colors"
          />
          {changed && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-neon-green hover:text-white transition-colors disabled:opacity-50"
            >
              <Save size={14} />
            </button>
          )}
        </div>
      </td>
      <td />
      <td />
    </tr>
  );
}

export default function ProductsTable() {
  const { products, loading, error, total } = useProducts({}, 100);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [variantStock, setVariantStock] = useState<Record<string, number>>({});

  const toggleExpand = (productId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handleStockUpdated = (variantId: string, stock: number) => {
    setVariantStock((prev) => ({ ...prev, [variantId]: stock }));
  };

  const getStockDisplay = (variants: ProductVariant[]) => {
    const active = variants.filter((v) => v.is_active);
    const totalStock = active.reduce((s, v) => s + (variantStock[v.id] ?? v.stock), 0);
    if (active.length === 0) return { label: 'Sin variantes', color: 'text-white/30' };
    return {
      label: `${active.length} var. · ${totalStock} u.`,
      color: totalStock > 5 ? 'text-green-400' : totalStock > 0 ? 'text-yellow' : 'text-red-500',
    };
  };

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
          {products.map((p) => {
            const isExpanded = expanded.has(p.id);
            const activeVariants = p.variants.filter((v) => v.is_active);
            const stockInfo = getStockDisplay(p.variants);
            const isNew =
              Date.now() - new Date(p.created_at).getTime() <= 30 * 24 * 60 * 60 * 1000;

            return (
              <React.Fragment key={p.id}>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {activeVariants.length > 0 && (
                        <button
                          onClick={() => toggleExpand(p.id)}
                          className="text-white/30 hover:text-white/60 transition-colors"
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      )}
                      <span className="font-bold text-white uppercase tracking-wider">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-white/50 uppercase tracking-widest text-[10px]">
                    {p.category.name}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-white">
                    ${(p.variants.find((v) => v.is_active)?.price ?? p.variants[0]?.price ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-bold ${stockInfo.color}`}>
                      {stockInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {isNew && (
                      <span className="bg-neon-green/20 text-neon-green text-[10px] px-2 py-1 font-bold uppercase tracking-widest">
                        Nuevo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/productos/${p.slug}`}
                        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-neon-green hover:text-white transition-colors"
                      >
                        Editar
                      </Link>
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
                {isExpanded && activeVariants.map((v) => (
                  <VariantRow
                    key={v.id}
                    variant={v}
                    productId={p.id}
                    onStockUpdated={handleStockUpdated}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
