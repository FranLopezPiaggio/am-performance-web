import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ProductWithVariants } from '@/types/database';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/products/by-slug/[slug]
 *
 * Devuelve un producto con variantes, imágenes, categoría y línea.
 * Usa el admin client (service_role) para ver productos inactivos también.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await verifyAdminRequest();
  if (!auth.authorized) return auth.response;

  const { slug } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*),
      images:product_images(*),
      category:categories(*),
      line:lines(*)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { error: 'Producto no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(data as unknown as ProductWithVariants);
}
