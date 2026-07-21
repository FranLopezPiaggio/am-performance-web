'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ImageUp, Package, Save, Eye, EyeOff } from 'lucide-react';
import { useAdminProductDetail } from '@/hooks/useAdminProductDetail';

function VariantEditRow({
  variant,
  onSave,
}: {
  variant: { id: string; variant_name: string; price: number; compare_at_price: number | null; cost_price: number | null; stock: number; is_active: boolean };
  onSave: (variantId: string, fields: Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState(variant.variant_name);
  const [price, setPrice] = useState(variant.price);
  const [comparePrice, setComparePrice] = useState(variant.compare_at_price ?? 0);
  const [costPrice, setCostPrice] = useState(variant.cost_price ?? 0);
  const [isActive, setIsActive] = useState(variant.is_active);
  const [saving, setSaving] = useState(false);

  const changed =
    name !== variant.variant_name ||
    price !== variant.price ||
    comparePrice !== (variant.compare_at_price ?? 0) ||
    costPrice !== (variant.cost_price ?? 0) ||
    isActive !== variant.is_active;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(variant.id, {
        variant_name: name,
        price,
        compare_at_price: comparePrice || null,
        cost_price: costPrice || null,
        is_active: isActive,
      });
    } catch {
      setName(variant.variant_name);
      setPrice(variant.price);
      setComparePrice(variant.compare_at_price ?? 0);
      setCostPrice(variant.cost_price ?? 0);
      setIsActive(variant.is_active);
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="border-b border-white/5 bg-white/[0.02]">
      <td className="px-4 py-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black border border-white/10 px-3 py-1.5 text-white text-xs focus:border-neon-green focus:outline-none transition-colors"
        />
      </td>
      <td className="px-4 py-3">
        <span className="text-white/40 text-xs font-mono">{variant.variant_name}</span>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          step={0.01}
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="w-24 bg-black border border-white/10 px-3 py-1.5 text-white text-xs text-right focus:border-neon-green focus:outline-none transition-colors"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          step={0.01}
          value={comparePrice}
          onChange={(e) => setComparePrice(parseFloat(e.target.value) || 0)}
          className="w-24 bg-black border border-white/10 px-3 py-1.5 text-white/60 text-xs text-right focus:border-neon-green focus:outline-none transition-colors"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          step={0.01}
          value={costPrice}
          onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
          className="w-24 bg-black border border-white/10 px-3 py-1.5 text-white/60 text-xs text-right focus:border-neon-green focus:outline-none transition-colors"
        />
      </td>
      <td className="px-4 py-3 text-center font-mono text-xs text-white/50">
        {variant.stock}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`transition-colors ${isActive ? 'text-neon-green' : 'text-white/20'}`}
        >
          {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        {changed && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1 text-neon-green hover:text-white transition-colors text-xs uppercase tracking-widest font-bold disabled:opacity-50"
          >
            <Save size={12} />
            {saving ? '...' : 'Guardar'}
          </button>
        )}
      </td>
    </tr>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-white/40 uppercase tracking-widest text-sm animate-pulse">
        Cargando producto...
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-8 text-center">
      <Package size={32} className="text-white/20 mx-auto mb-4" />
      <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
        Error al cargar el producto
      </p>
      <p className="text-white/30 text-xs uppercase tracking-widest">{message}</p>
      <Link
        href="/admin?view=products"
        className="inline-block mt-6 text-neon-green text-xs uppercase tracking-widest hover:text-white transition-colors"
      >
        ← Volver a productos
      </Link>
    </div>
  );
}

export default function AdminProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { product, loading, error, updateProduct, updateVariant } = useAdminProductDetail(slug);

  const [saving, setSaving] = useState<string | null>(null); // 'product' or variant id
  const [productForm, setProductForm] = useState<{
    name: string;
    description: string;
    short_description: string;
    is_active: boolean;
  } | null>(null);

  // Init form when product loads (derived state — not useEffect, avoids cascading render warning)
  if (product && !productForm) {
    setProductForm({
      name: product.name,
      description: product.description,
      short_description: product.short_description ?? '',
      is_active: product.is_active,
    });
  }

  const handleProductSave = async () => {
    if (!productForm || !product) return;
    setSaving('product');
    try {
      await updateProduct({
        name: productForm.name,
        description: productForm.description,
        short_description: productForm.short_description || null,
        is_active: productForm.is_active,
      });
    } catch {
      // revert
      setProductForm({
        name: product.name,
        description: product.description,
        short_description: product.short_description ?? '',
        is_active: product.is_active,
      });
    } finally {
      setSaving(null);
    }
  };

  const handleVariantSave = async (variantId: string, fields: Record<string, unknown>) => {
    setSaving(variantId);
    try {
      await updateVariant(variantId, fields);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!product) return <ErrorState message="Producto no encontrado" />;

  const productChanged =
    productForm &&
    (productForm.name !== product.name ||
      productForm.description !== product.description ||
      productForm.short_description !== (product.short_description ?? '') ||
      productForm.is_active !== product.is_active);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin?view=products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Volver a productos
          </Link>
          <h1 className="text-3xl font-display uppercase tracking-tighter">
            {product.name}
          </h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
            {product.category.name} — {product.slug}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/productos/${product.slug}/imagenes`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-xs uppercase tracking-widest text-white/60 hover:text-white hover:border-white/40 transition-all"
          >
            <ImageUp size={14} />
            Imágenes
          </Link>
          <Link
            href={`/producto/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-xs uppercase tracking-widest text-white/60 hover:text-white hover:border-white/40 transition-all"
          >
            <ExternalLink size={14} />
            Ver en sitio
          </Link>
        </div>
      </div>

      {/* Product Info */}
      {productForm && (
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display uppercase tracking-widest">
              Información del Producto
            </h2>
            {productChanged && (
              <button
                onClick={handleProductSave}
                disabled={saving === 'product'}
                className="brutal-btn inline-flex items-center gap-2 text-xs disabled:opacity-50"
              >
                <Save size={14} />
                {saving === 'product' ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Descripción Corta
              </label>
              <input
                type="text"
                value={productForm.short_description}
                onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Descripción
              </label>
              <textarea
                rows={4}
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors resize-y"
              />
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  onClick={() => setProductForm({ ...productForm, is_active: !productForm.is_active })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    productForm.is_active ? 'bg-neon-green' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-black transition-transform ${
                      productForm.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className="text-xs uppercase tracking-widest text-white/60">
                  Producto Activo
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Variants Table */}
      <div className="bg-white/5 border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-display uppercase tracking-widest">
            Variantes ({product.variants.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">SKU</th>
                <th className="text-right px-4 py-3">Precio</th>
                <th className="text-right px-4 py-3">Comparar en</th>
                <th className="text-right px-4 py-3">Costo</th>
                <th className="text-center px-4 py-3">Stock</th>
                <th className="text-center px-4 py-3">Activo</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {product.variants.map((v) => (
                <VariantEditRow
                  key={v.id}
                  variant={v}
                  onSave={handleVariantSave}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
