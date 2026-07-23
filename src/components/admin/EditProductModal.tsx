'use client';

import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, Package } from 'lucide-react';
import { useSupabase } from '@/context/SupabaseProvider';
import ImageManager from '@/components/admin/ImageManager';
import type { ProductWithVariants, Category, Line, ProductVariant } from '@/types/database';

// ── Variant Edit Row ───────────────────────────────────────────────

function ModalVariantRow({
  variant,
  onSave,
}: {
  variant: ProductVariant;
  onSave: (variantId: string, fields: Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState(variant.variant_name);
  const [price, setPrice] = useState(variant.price);
  const [comparePrice, setComparePrice] = useState(variant.compare_at_price ?? 0);
  const [costPrice, setCostPrice] = useState(variant.cost_price ?? 0);
  const [stock, setStock] = useState(variant.stock);
  const [isActive, setIsActive] = useState(variant.is_active);
  const [saving, setSaving] = useState(false);

  const changed =
    name !== variant.variant_name ||
    price !== variant.price ||
    comparePrice !== (variant.compare_at_price ?? 0) ||
    costPrice !== (variant.cost_price ?? 0) ||
    stock !== variant.stock ||
    isActive !== variant.is_active;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(variant.id, {
        variant_name: name,
        price,
        compare_at_price: comparePrice || null,
        cost_price: costPrice || null,
        stock,
        is_active: isActive,
      });
    } catch {
      setName(variant.variant_name);
      setPrice(variant.price);
      setComparePrice(variant.compare_at_price ?? 0);
      setCostPrice(variant.cost_price ?? 0);
      setStock(variant.stock);
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
        <span className="text-white/40 text-xs font-mono">{variant.sku}</span>
      </td>
      <td className="px-4 py-3">
        <input
          type="number" min={0} step={0.01}
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="w-24 bg-black border border-white/10 px-3 py-1.5 text-white text-xs text-right focus:border-neon-green focus:outline-none transition-colors"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number" min={0} step={0.01}
          value={comparePrice}
          onChange={(e) => setComparePrice(parseFloat(e.target.value) || 0)}
          className="w-24 bg-black border border-white/10 px-3 py-1.5 text-white/60 text-xs text-right focus:border-neon-green focus:outline-none transition-colors"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number" min={0} step={0.01}
          value={costPrice}
          onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
          className="w-24 bg-black border border-white/10 px-3 py-1.5 text-white/60 text-xs text-right focus:border-neon-green focus:outline-none transition-colors"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number" min={0}
          value={stock}
          onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-20 bg-black border border-white/10 px-3 py-1.5 text-white text-xs text-center focus:border-neon-green focus:outline-none transition-colors"
        />
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

// ── Props ──────────────────────────────────────────────────────────

interface EditProductModalProps {
  slug: string;
  onClose: () => void;
  onSaved: () => void;
}

// ── Modal ──────────────────────────────────────────────────────────

export default function EditProductModal({ slug, onClose, onSaved }: EditProductModalProps) {
  const supabase = useSupabase()!;
  const [activeTab, setActiveTab] = useState<'info' | 'variants' | 'images'>('info');
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ponytail: el estado del form se derive durante el render, no en useEffect.
  // Se inicializa cuando product se carga (if + setState durante render).
  const [productForm, setProductForm] = useState<{
    name: string;
    slug: string;
    description: string;
    short_description: string;
    category_id: string;
    line_id: string | null;
    disciplines: string;
    is_active: boolean;
  } | null>(null);

  // ── Fetch on mount ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`/api/admin/products/by-slug/${slug}`).then((r) => {
        if (!r.ok) throw new Error('Error al cargar el producto');
        return r.json();
      }),
      supabase.from('categories').select('*').order('name').then((r) => r.data || []),
      supabase.from('lines').select('*').order('name').then((r) => r.data || []),
    ])
      .then(([productData, cats, lineData]) => {
        if (cancelled) return;
        setProduct(productData);
        setCategories(cats as Category[]);
        setLines(lineData as Line[]);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, supabase]);

  // Init form when product loads
  if (product && !productForm) {
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.short_description ?? '',
      category_id: product.category_id,
      line_id: product.line_id,
      disciplines: (product.disciplines || []).join(', '),
      is_active: product.is_active,
    });
  }

  // ── Flash messages ──────────────────────────────────────────────
  const flashSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const flashError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  // ── Save product info ───────────────────────────────────────────
  const handleProductSave = async () => {
    if (!productForm || !product) return;
    setSaving('product');
    setErrorMsg(null);
    try {
      const disciplines = productForm.disciplines
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      const body: Record<string, unknown> = {
        name: productForm.name,
        slug: productForm.slug,
        description: productForm.description,
        short_description: productForm.short_description || null,
        category_id: productForm.category_id,
        line_id: productForm.line_id || null,
        disciplines,
        is_active: productForm.is_active,
      };

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al guardar');
      }

      setProduct((prev) =>
        prev
          ? {
              ...prev,
              ...body,
              slug: productForm.slug,
              disciplines,
            }
          : null
      );
      onSaved();
      flashSuccess('Producto actualizado');
    } catch (err) {
      // revert form to current product state
      setProductForm({
        name: product!.name,
        slug: product!.slug,
        description: product!.description,
        short_description: product!.short_description ?? '',
        category_id: product!.category_id,
        line_id: product!.line_id,
        disciplines: (product!.disciplines || []).join(', '),
        is_active: product!.is_active,
      });
      flashError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(null);
    }
  };

  // ── Save variant ────────────────────────────────────────────────
  const handleVariantSave = async (variantId: string, fields: Record<string, unknown>) => {
    if (!product) return;
    setSaving(variantId);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/variants/${variantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al guardar variante');
      }

      setProduct((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          variants: prev.variants.map((v) =>
            v.id === variantId ? { ...v, ...fields } : v
          ),
        } as ProductWithVariants;
      });

      onSaved();
      flashSuccess('Variante actualizada');
    } catch (err) {
      flashError(err instanceof Error ? err.message : 'Error al guardar variante');
      throw err; // let the row component catch it for revert
    } finally {
      setSaving(null);
    }
  };

  // ── Loading / Error states ──────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-white/40 uppercase tracking-widest text-sm animate-pulse">
          Cargando producto...
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-white/5 border border-white/10 p-8 max-w-md text-center">
          <Package size={32} className="text-white/20 mx-auto mb-4" />
          <p className="text-red-500 uppercase tracking-widest text-sm font-bold mb-2">
            Error al cargar
          </p>
          <p className="text-white/30 text-xs uppercase tracking-widest">{error}</p>
          <button onClick={onClose} className="mt-6 text-neon-green text-xs uppercase tracking-widest hover:text-white transition-colors">
            ← Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (!product || !productForm) return null;

  // ── Derived: has product form changed? ──────────────────────────
  const disciplinesStr = (product.disciplines || []).join(', ');
  const productChanged =
    productForm.name !== product.name ||
    productForm.slug !== product.slug ||
    productForm.description !== product.description ||
    productForm.short_description !== (product.short_description ?? '') ||
    productForm.category_id !== product.category_id ||
    (productForm.line_id || '') !== (product.line_id || '') ||
    productForm.disciplines !== disciplinesStr ||
    productForm.is_active !== product.is_active;

  const tabs = [
    { id: 'info' as const, label: 'Información' },
    { id: 'variants' as const, label: `Variantes (${product.variants.length})` },
    { id: 'images' as const, label: `Imágenes (${product.images.length})` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm py-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-5xl mx-4 bg-brutal-black border border-white/10 shadow-2xl">
        {/* ── Modal Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-brutal-black z-10">
          <h2 className="text-xl font-display uppercase tracking-tighter">{product.name}</h2>
          <div className="flex items-center gap-3">
            {successMsg && (
              <span className="text-green-400 text-xs uppercase tracking-widest">✓ {successMsg}</span>
            )}
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Error message ─────────────────────────────────────── */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-xs uppercase tracking-widest font-bold">{errorMsg}</p>
          </div>
        )}

        {/* ── Tabs ──────────────────────────────────────────────── */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all ${
                activeTab === tab.id
                  ? 'text-neon-green border-b-2 border-neon-green'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Información ──────────────────────────────────── */}
        {activeTab === 'info' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Nombre</label>
                <input type="text" value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Slug</label>
                <input type="text" value={productForm.slug}
                  onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-neon-green focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Categoría</label>
                <select value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors text-sm">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-black">{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Línea</label>
                <select value={productForm.line_id ?? ''}
                  onChange={(e) => setProductForm({ ...productForm, line_id: e.target.value || null })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors text-sm">
                  <option value="" className="bg-black">Sin línea</option>
                  {lines.map((l) => (
                    <option key={l.id} value={l.id} className="bg-black">{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Descripción Corta</label>
                <input type="text" value={productForm.short_description}
                  onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Disciplines (separadas por coma)</label>
                <input type="text" value={productForm.disciplines}
                  onChange={(e) => setProductForm({ ...productForm, disciplines: e.target.value })}
                  placeholder="ej: CrossFit, Functional Training"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors text-sm" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Descripción</label>
                <textarea rows={4} value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors resize-y" />
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    onClick={() => setProductForm({ ...productForm, is_active: !productForm.is_active })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      productForm.is_active ? 'bg-neon-green' : 'bg-white/20'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-black transition-transform ${
                      productForm.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="text-xs uppercase tracking-widest text-white/60">Producto Activo</span>
                </label>
              </div>
            </div>

            {productChanged && (
              <div className="mt-6 flex justify-end border-t border-white/10 pt-6">
                <button onClick={handleProductSave} disabled={saving === 'product'}
                  className="brutal-btn inline-flex items-center gap-2 text-xs disabled:opacity-50">
                  <Save size={14} />
                  {saving === 'product' ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Variantes ────────────────────────────────────── */}
        {activeTab === 'variants' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">SKU</th>
                  <th className="text-right px-4 py-3">Precio</th>
                  <th className="text-right px-4 py-3">Comparar</th>
                  <th className="text-right px-4 py-3">Costo</th>
                  <th className="text-center px-4 py-3">Stock</th>
                  <th className="text-center px-4 py-3">Activo</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <ModalVariantRow key={v.id} variant={v} onSave={handleVariantSave} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tab: Imágenes ─────────────────────────────────────── */}
        {activeTab === 'images' && (
          <div className="p-6">
            <ImageManager
              productId={product.id}
              productName={product.name}
              initialImages={product.images}
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}
