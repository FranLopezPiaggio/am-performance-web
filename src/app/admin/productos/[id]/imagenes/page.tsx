import { createAdminClient } from '@/lib/supabase/admin';
import ImageManager from '@/components/admin/ImageManager';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * Page: /admin/productos/:id/imagenes
 *
 * Server component que carga datos iniciales del producto y sus imágenes,
 * y los pasa al componente cliente ImageManager para su gestión interactiva.
 * La autenticación admin está protegida por middleware.
 */
export default async function ProductImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Fetch product basic info
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, slug')
    .eq('id', id)
    .single();

  if (productError || !product) notFound();

  // Fetch existing images ordered by display_order
  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', id)
    .order('display_order', { ascending: true });

  return (
    <ImageManager
      productId={product.id}
      productName={product.name}
      initialImages={images ?? []}
    />
  );
}
