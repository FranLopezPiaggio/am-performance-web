import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';
import { checkBodySize } from '@/lib/api-security';

export const dynamic = 'force-dynamic';

// ── Validation ───────────────────────────────────────────────────────

const saveSchema = z.object({
  publicId: z.string().min(1, 'publicId es requerido'),
  secureUrl: z.string().url('secureUrl debe ser una URL válida'),
  productId: z.string().uuid('productId debe ser un UUID válido'),
  altText: z.string().nullable().optional(),
  isPrimary: z.boolean().optional(),
});

// ── Route ────────────────────────────────────────────────────────────

/**
 * POST /api/admin/images/save
 *
 * Persiste en la base de datos el resultado de un upload exitoso a Cloudinary.
 *
 * Este endpoint se llama DESPUÉS de que el cliente subió el archivo
 * directamente a Cloudinary (Direct Client-to-Cloud).
 *
 * Body esperado:
 *   { publicId, secureUrl, productId, altText?, isPrimary? }
 *
 * Retorna:
 *   El registro de product_images creado
 */
export async function POST(request: Request) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const sizeCheck = checkBodySize(request);
  if (sizeCheck) return sizeCheck;

  try {
    // ── Validate body ──────────────────────────────────────────────
    const body = await request.json();
    const parsed = saveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { publicId, secureUrl, productId, altText, isPrimary } = parsed.data;

    const supabase = createAdminClient();

    // ── Verify product exists ──────────────────────────────────────
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // ── If isPrimary, unmark existing primary for this product ────
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
        image_url: secureUrl,
        alt_text: altText ?? null,
        display_order: nextOrder,
        is_primary: isPrimary ?? nextOrder === 0, // primera imagen es primary por defecto
      })
      .select()
      .single();

    if (insertError) {
      console.error('DB insert error:', insertError);

      // Cleanup: el asset ya se subió a Cloudinary, pero no se pudo persistir.
      // Intentamos eliminarlo de Cloudinary para no dejar assets huérfanos.
      try {
        const { deleteAsset } = await import('@/lib/services/image.service');
        await deleteAsset(publicId);
      } catch {
        // Si falla la limpieza, al menos logueamos para debug manual
        console.warn(
          `[CLEANUP] Asset huérfano en Cloudinary: ${publicId}`
        );
      }

      return NextResponse.json(
        { error: 'Error al guardar la imagen en la base de datos' },
        { status: 500 }
      );
    }

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Image save error:', error);
    return NextResponse.json(
      { error: 'Error al procesar el guardado de la imagen' },
      { status: 500 }
    );
  }
}
