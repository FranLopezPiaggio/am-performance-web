// src/lib/supabase/products.ts
// Products API - Supabase queries
// AMPerformance - AGENT-BACKEND

import { createClient } from './client';
import type { Product, Category } from '@/types/database';
import { getProductImage } from '../utils/images';
import type { StaticImageData } from 'next/image';

export type { Product, Category };

/**
 * Fetch all products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = createClient();

  // STEP 1: Get Category ID
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (categoryError || !category) {
    console.error(`❌ CRÍTICO: Categoría "${categorySlug}" no encontrada en BD.`);
    return [];
  }
  console.log(`✅ Category ID encontrado: ${category.id}`);

  // STEP 2: Get Relations (TRAE DE VUELTA EL CÓDIGO ORIGINAL)
  const { data: productCategories, error: pcError } = await supabase
    .from('product_categories')
    .select('product_id')
    .eq('category_id', category.id);

  // DEBUG MODE
  console.log('🔍 Relations Found:', productCategories?.length || 0);

  if (pcError) {
    console.error('❌ Error fetching product categories:', pcError);
    return [];
  }

  if (!productCategories || productCategories.length === 0) {
    console.warn(`⚠️ La categoría ${categorySlug} existe, pero NO tiene productos vinculados.`);
    return [];
  }

  // STEP 3: Get Products
  const productIds = productCategories.map(pc => pc.product_id);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`❌ ERROR al buscar productos:`, error);
    return [];
  }

  console.log(`✅ ÉXITO: ${data?.length} productos recuperados.`);
  return data || [];
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

/**
 * Fetch category name for a specific product using the join table
 * Uses product_categories (product_id, category_id) -> categories(id, name)
 */
export async function getCategoryByProductId(productId: string): Promise<string | null> {
  const supabase = createClient();

  // Step 1: Get category_id from product_categories
  const { data: productCategory, error: pcError } = await supabase
    .from('product_categories')
    .select('category_id')
    .eq('product_id', productId)
    .single();

  if (pcError || !productCategory) {
    console.warn(`⚠️ No category found for product ${productId}`);
    return null;
  }

  // Step 2: Get category name from categories table
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('name')
    .eq('id', productCategory.category_id)
    .single();

  if (catError || !category) {
    console.warn(`⚠️ Category not found for id ${productCategory.category_id}`);
    return null;
  }

  return category.name;
}

/**
 * Map Supabase product to UI format with category
 * Fetches category name via join table
 */
export async function mapProductToCard(product: Product): Promise<{
  id: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: number;
  in_stock: boolean;
  inmediately_available: boolean;
}> {
  const price = product.offer_price || product.base_price;
  const discount = product.offer_price
    ? Math.round(((product.base_price - product.offer_price) / product.base_price) * 100)
    : undefined;

  // Fetch category via join table
  const category = await getCategoryByProductId(product.id);

  return {
    id: product.id,
    name: product.name,
    price: price,
    image: getProductImage(product.name, product.images?.[0]),
    category: category || 'General', // Fallback if no category
    rating: 5, // Default rating - could be added to schema
    reviews: 0, // Default reviews - could be added to schema
    isNew: product.is_featured,
    discount: discount,
    in_stock: product.in_stock,
    inmediately_available: product.inmediately_available
  };
}
