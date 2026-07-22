'use client';

import { useState, useRef } from 'react';
import { ImageUp, Trash2, Star, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import type { ProductImage } from '@/types/database';

interface ImageManagerProps {
  productId: string;
  productName: string;
  initialImages: ProductImage[];
}

export default function ImageManager({ productId, productName, initialImages }: ImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sort by display_order for rendering
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);

  // ── Helpers ──────────────────────────────────────────────────────

  const flashError = (msg: string) => {
    setError(msg);
    setSuccess(null);
    setTimeout(() => setError(null), 4000);
  };

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  // ── Upload (Direct Client-to-Cloud con Backend Signing) ──────────
  //
  // 1. POST /api/admin/images/sign  → obtiene firma + params
  // 2. POST https://api.cloudinary.com/… → sube el archivo directo
  // 3. POST /api/admin/images/save  → persiste en nuestra DB
  //
  // Beneficio: los bytes NUNCA pasan por Vercel serverless.

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // ── 1. Get upload signature from server ────────────────────────
      const signRes = await fetch('/api/admin/images/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, originalName: file.name }),
      });

      const signData = await signRes.json();

      if (!signRes.ok) {
        throw new Error(signData.error || 'Error al obtener firma de upload');
      }

      const { signature, timestamp, apiKey, cloudName, folder, publicId, imageId } = signData;

      // ── 2. Upload directly to Cloudinary ───────────────────────────
      const cloudFormData = new FormData();
      cloudFormData.append('file', file);
      cloudFormData.append('api_key', apiKey);
      cloudFormData.append('timestamp', String(timestamp));
      cloudFormData.append('signature', signature);
      cloudFormData.append('folder', folder);
      cloudFormData.append('public_id', publicId);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: cloudFormData }
      );

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || 'Error al subir la imagen a Cloudinary');
      }

      // ── 3. Save the result to our database ─────────────────────────
      const saveRes = await fetch('/api/admin/images/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageId,
          publicId: uploadData.public_id,
          secureUrl: uploadData.secure_url,
          productId,
          format: uploadData.format,
          width: uploadData.width,
          height: uploadData.height,
          bytes: uploadData.bytes,
          originalFilename: uploadData.original_filename,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.error || 'Error al guardar la imagen en la base de datos');
      }

      setImages((prev) => [...prev, saveData]);
      flashSuccess('Imagen subida correctamente');
    } catch (err) {
      flashError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Delete (de Cloudinary + DB) ──────────────────────────────────

  const handleDelete = async (imageId: string) => {
    if (!confirm('¿Eliminar esta imagen? Esta acción no se puede deshacer.')) return;

    try {
      const res = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar la imagen');
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      flashSuccess('Imagen eliminada');
    } catch (err) {
      flashError(err instanceof Error ? err.message : 'Error al eliminar la imagen');
    }
  };

  // ── Set Primary ──────────────────────────────────────────────────

  const handleSetPrimary = async (imageId: string) => {
    try {
      const res = await fetch('/api/admin/images/primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al establecer imagen principal');
      }

      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      );

      flashSuccess('Imagen principal actualizada');
    } catch (err) {
      flashError(err instanceof Error ? err.message : 'Error al establecer imagen principal');
    }
  };

  // ── Reorder ──────────────────────────────────────────────────────

  const handleReorder = async (newOrderIds: string[]) => {
    try {
      const res = await fetch('/api/admin/images/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, imageIds: newOrderIds }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al reordenar');
      }

      // Sync local display_order to match new order
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          display_order: newOrderIds.indexOf(img.id),
        }))
      );
    } catch (err) {
      flashError(err instanceof Error ? err.message : 'Error al reordenar');
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const ids = sortedImages.map((img) => img.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    handleReorder(ids);
  };

  const moveDown = (index: number) => {
    if (index === sortedImages.length - 1) return;
    const ids = sortedImages.map((img) => img.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    handleReorder(ids);
  };

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <a
            href="/admin?view=products"
            className="text-[10px] uppercase tracking-widest text-white/40 hover:text-neon-green transition-colors"
          >
            ← Volver a productos
          </a>
          <h1 className="text-2xl font-display uppercase tracking-tighter mt-1">
            {productName}
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
            {sortedImages.length} imagen{sortedImages.length !== 1 ? 'es' : ''}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/webp,image/jpeg,image/png,image/avif"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-6 py-3 bg-neon-green text-brutal-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ImageUp size={16} />
          )}
          {uploading ? 'Subiendo...' : 'Subir Imagen'}
        </button>
      </div>

      {/* ── Messages ────────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-xs uppercase tracking-widest font-bold">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20">
          <p className="text-green-400 text-xs uppercase tracking-widest font-bold">{success}</p>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────── */}
      {sortedImages.length === 0 && (
        <div className="p-16 text-center border border-dashed border-white/10">
          <ImageUp size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/60 uppercase tracking-widest text-sm mb-2">Sin imágenes</p>
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Subí la primera imagen para este producto.
          </p>
        </div>
      )}

      {/* ── Image Grid ──────────────────────────────────────────── */}
      {sortedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedImages.map((img, index) => (
            <div
              key={img.id}
              className="group relative bg-white/5 border border-white/10 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt={img.alt_text ?? productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Controls overlay (appear on hover) */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                {/* Primary toggle */}
                <button
                  onClick={() => handleSetPrimary(img.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    img.is_primary
                      ? 'text-yellow border border-yellow/30 bg-yellow/10'
                      : 'text-white/60 hover:text-yellow hover:border-yellow/30'
                  }`}
                  title={img.is_primary ? 'Imagen principal' : 'Establecer como principal'}
                >
                  <Star size={12} fill={img.is_primary ? 'currentColor' : 'none'} />
                  {img.is_primary ? 'Principal' : 'Como principal'}
                </button>

                {/* Reorder */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 text-white/60 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Mover atrás"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <span className="text-[10px] text-white/30 font-mono">
                    {index + 1}/{sortedImages.length}
                  </span>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === sortedImages.length - 1}
                    className="p-1.5 text-white/60 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Mover adelante"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(img.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-red-400 transition-colors"
                  title="Eliminar imagen"
                >
                  <Trash2 size={12} />
                  Eliminar
                </button>
              </div>

              {/* Primary badge (always visible) */}
              {img.is_primary && (
                <div className="absolute top-2 left-2">
                  <span className="bg-yellow text-brutal-black text-[8px] font-bold px-2 py-1 uppercase tracking-widest">
                    Principal
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
