import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/images/upload
 *
 * Sube una imagen al bucket 'product-images' y crea el registro en product_images.
 * Acepta FormData con: file (Blob), product_id (UUID), alt_text (opcional), is_primary (opcional "true").
 * Usa service_role key para Storage (bypass RLS) + DB writes.
 */
export async function POST(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('product_id') as string | null;
    const altText = formData.get('alt_text') as string | null;
    const isPrimary = formData.get('is_primary') === 'true';

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'file y product_id son requeridos' },
        { status: 400 }
      );
    }

    // ── Validate file type ──────────────────────────────────────────
    const allowedTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no válido. Permitidos: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Validate file size (5MB) ────────────────────────────────────
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo excede el límite de 5MB' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const ext = file.name.split('.').pop() || 'webp';
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const storagePath = `${productId}/${fileName}`;

    // ── Upload to Storage ───────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Error al subir la imagen al storage' },
        { status: 500 }
      );
    }

    // ── Get public URL ──────────────────────────────────────────────
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(storagePath);

    // ── If is_primary, unmark existing primary for this product ────
    if (isPrimary) {
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId)
        .eq('is_primary', true);
    }

    // ── Get next display_order ──────────────────────────────────────
    const { data: maxOrder } = await supabase
      .from('product_images')
      .select('display_order')
      .eq('product_id', productId)
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrder?.display_order ?? -1) + 1;

    // ── Insert into product_images ──────────────────────────────────
    const { data: image, error: insertError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        variant_id: null,
        image_url: publicUrl,
        alt_text: altText,
        display_order: nextOrder,
        is_primary: isPrimary || nextOrder === 0, // first image is primary by default
      })
      .select()
      .single();

    if (insertError) {
      // Cleanup: remove the uploaded file from storage
      await supabase.storage
        .from('product-images')
        .remove([storagePath]);

      console.error('DB insert error:', insertError);
      return NextResponse.json(
        { error: 'Error al guardar la imagen en la base de datos' },
        { status: 500 }
      );
    }

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la subida de la imagen' },
      { status: 500 }
    );
  }
}
