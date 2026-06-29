import { createAdminClient } from '@/lib/supabase/admin';
import ImageManager from '@/components/admin/ImageManager';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * Page: /admin/productos/:slug/imagenes
 *
 * Server component that loads product data and existing images by slug,
 * then passes them to the client ImageManager for interactive management.
 * Admin authentication is protected by middleware.
 */
export default async function ProductImagesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();

  // Fetch product by slug
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();

  if (productError || !product) notFound();

  // Fetch existing images ordered by display_order
  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', product.id)
    .order('display_order', { ascending: true });

  return (
    <ImageManager
      productId={product.id}
      productName={product.name}
      initialImages={images ?? []}
    />
  );
}
