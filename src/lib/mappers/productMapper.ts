import { ProductWithVariants } from '@/types/database';
import { StaticImageData } from 'next/image';

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: number;
  immediatelyAvailable?: boolean;
  delivery_lead_days?: number | null;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function mapProductToCard(product: ProductWithVariants): ProductCardData {
  const firstVariant = product.variants.find((v) => v.is_active) || product.variants[0];
  const firstImage = product.images.find((i) => i.is_primary) || product.images[0];

  const price = firstVariant?.price ?? 0;
  const compareAtPrice = firstVariant?.compare_at_price ?? 0;
  const discount =
    compareAtPrice > price
      ? Math.round((1 - price / compareAtPrice) * 100)
      : undefined;
  const stock = firstVariant?.stock ?? 0;
  const isNew =
    Date.now() - new Date(product.created_at).getTime() <= THIRTY_DAYS_MS;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price,
    image: firstImage?.image_url ?? '',
    category: product.category.name,
    rating: 0,
    reviews: 0,
    isNew: isNew || undefined,
    discount,
    immediatelyAvailable: product.variants.length > 0 ? stock > 0 : true,
    delivery_lead_days: null,
  };
}
