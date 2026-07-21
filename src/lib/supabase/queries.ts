import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Database,
  Category,
  Line,
  Product,
  ProductVariant,
  ProductImage,
} from '@/types/database';
import { getOrSet } from '@/lib/cache/redis';

// Re-export types for convenience
export type { Database };

// ====== Query Parameter Types ======

export interface ProductFilters {
  categorySlug?: string;
  lineSlug?: string;
  discipline?: string;
  search?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface ProductWithJoins extends Product {
  variants: ProductVariant[];
  images: ProductImage[];
  category: Category;
  line: Line | null;
}

// ====== Category Queries ======

export async function getCategories(
  supabase: SupabaseClient<Database>
): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getCategory(
  supabase: SupabaseClient<Database>,
  slug: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

/** Resolve a category slug to its ID + all subcategory IDs (if it's a parent). */
async function resolveCategoryIds(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<string[]> {
  const cat = await getCategory(supabase, slug);
  if (!cat) return [];
  if (cat.parent_id) return [cat.id];
  const all = await getCategories(supabase);
  return [cat.id, ...all.filter(c => c.parent_id === cat.id).map(c => c.id)];
}

// ====== Line Queries ======

export async function getLines(
  supabase: SupabaseClient<Database>
): Promise<Line[]> {
  const { data, error } = await supabase
    .from('lines')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

// ====== Product Queries ======

export async function getProducts(
  supabase: SupabaseClient<Database>,
  filters: ProductFilters = {}
): Promise<ProductWithJoins[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*),
      images:product_images(*),
      category:categories(*),
      line:lines(*)
    `);

  if (filters.categorySlug) {
    const ids = await resolveCategoryIds(supabase, filters.categorySlug);
    if (ids.length > 0) query = query.in('category_id', ids);
  }
  if (filters.lineSlug) {
    query = query.eq('lines.slug', filters.lineSlug);
  }
  if (filters.discipline) {
    query = query.contains('disciplines', [filters.discipline]);
  }
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  } else {
    query = query.eq('is_active', true);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 12) - 1);
  }

  const { data, error } = await query.order('name');

  if (error) throw error;
  return data || [];
}

export async function getProduct(
  supabase: SupabaseClient<Database>,
  slug: string
): Promise<ProductWithJoins | null> {
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

  if (error) return null;
  return data;
}

export async function getProductsByCategory(
  supabase: SupabaseClient<Database>,
  categorySlug: string,
  filters: Omit<ProductFilters, 'categorySlug'> = {}
): Promise<ProductWithJoins[]> {
  return getProducts(supabase, { ...filters, categorySlug });
}

export async function getProductsByLine(
  supabase: SupabaseClient<Database>,
  lineSlug: string,
  filters: Omit<ProductFilters, 'lineSlug'> = {}
): Promise<ProductWithJoins[]> {
  return getProducts(supabase, { ...filters, lineSlug });
}

// ====== Best Sellers (placeholder - returns first products until analytics exist) ======

export async function getBestSellers(
  supabase: SupabaseClient<Database>,
  limit: number = 8
): Promise<ProductWithJoins[]> {
  return getProducts(supabase, { limit, isActive: true });
}

// ====== Product Count ======

export async function getProductCount(
  supabase: SupabaseClient<Database>,
  filters: Omit<ProductFilters, 'limit' | 'offset'> = {}
): Promise<number> {
  const cacheKey = `product-count:${filters.categorySlug || 'all'}:${filters.isActive ?? true}`;

  return getOrSet(cacheKey, async () => {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (filters.categorySlug) {
      const ids = await resolveCategoryIds(supabase, filters.categorySlug);
      if (ids.length > 0) query = query.in('category_id', ids);
    }
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }, { ttl: 300 }); // ponytail: 5min TTL, el catálogo no cambia frecuentemente
}
