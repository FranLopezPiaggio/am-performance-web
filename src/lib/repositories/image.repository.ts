// src/lib/repositories/image.repository.ts
// ImageRepository — abstrae operaciones de persistencia de product_images
//
// Solo conoce metadata. No sabe nada de Cloudinary ni CDNs.
// Usa service-role client para operaciones admin.

import { createAdminClient } from '@/lib/supabase/admin';
import type { ProductImage } from '@/types/database';

// ─── Types ────────────────────────────────────────────────────────────

export interface ImageInsertInput {
  id?: string;
  product_id: string;
  variant_id?: string | null;
  image_url: string;
  alt_text?: string | null;
  display_order?: number;
  is_primary?: boolean;
  public_id?: string | null;
  folder?: string | null;
  original_name?: string | null;
  slugified_name?: string | null;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  mime_type?: string | null;
  checksum?: string | null;

  // Update-only (tienen defaults en DB pero se pasan en updates)
  status?: string;
  marked_deleted_at?: string | null;
  delete_attempts?: number;
}

export type ImageUpdateInput = Partial<ImageInsertInput>;

// ─── Repository ───────────────────────────────────────────────────────

export const imageRepository = {
  async insert(data: ImageInsertInput): Promise<ProductImage> {
    const supabase = createAdminClient();

    const { data: image, error } = await supabase
      .from('product_images')
      .insert({
        ...(data.id ? { id: data.id } : {}),
        product_id: data.product_id,
        variant_id: data.variant_id ?? null,
        image_url: data.image_url,
        alt_text: data.alt_text ?? null,
        display_order: data.display_order ?? 0,
        is_primary: data.is_primary ?? false,
        public_id: data.public_id ?? null,
        folder: data.folder ?? null,
        original_name: data.original_name ?? null,
        slugified_name: data.slugified_name ?? null,
        format: data.format ?? null,
        width: data.width ?? null,
        height: data.height ?? null,
        bytes: data.bytes ?? null,
        mime_type: data.mime_type ?? null,
        checksum: data.checksum ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return image;
  },

  async update(id: string, data: ImageUpdateInput): Promise<ProductImage> {
    const supabase = createAdminClient();

    const { data: image, error } = await supabase
      .from('product_images')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return image;
  },

  async findById(id: string): Promise<ProductImage | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async findByPublicId(publicId: string): Promise<ProductImage | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('public_id', publicId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async findByProduct(productId: string): Promise<ProductImage[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async markPendingDelete(id: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('product_images')
      .update({
        status: 'pending_delete',
        marked_deleted_at: new Date().toISOString(),
        delete_attempts: 0,
      })
      .eq('id', id);

    if (error) throw error;
  },

  async findPendingDelete(limit = 50, olderThanMinutes = 5): Promise<ProductImage[]> {
    const supabase = createAdminClient();
    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('status', 'pending_delete')
      .lt('marked_deleted_at', cutoff)
      .order('marked_deleted_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async markFailed(id: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('product_images')
      .update({ status: 'failed' })
      .eq('id', id);

    if (error) throw error;
  },

  async hardDelete(id: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ponytail: repository singleton. Sin interface/implementación separada —
// solo hay una base de datos. Agregar interface cuando haya segunda.
