// src/lib/supabase/products.ts
// Products API - Supabase queries
// AMPerformance - AGENT-BACKEND

import { createClient } from './client';
import type { Product, Category } from '@/types/database';
import { getProductImage } from '../utils/images';

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

/**
 * Fetch products by category slug
 */
// export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
//   const supabase = createClient();

//   // First get the category ID
//   const { data: category, error: categoryError } = await supabase
//     .from('categories')
//     .select('id')
//     .eq('slug', categorySlug)
//     .single();

//   if (categoryError || !category) {
//     console.error('Error fetching category:', categoryError);
//     console.log('Category Slug requested:', categorySlug);
//     return [];
//   }

//   // Then get products in that category
//   const { data: productCategories, error: pcError } = await supabase
//     .from('product_categories')
//     .select('product_id')
//     .eq('category_id', category.id);

//   if (pcError) {
//     console.error('Error fetching product categories:', pcError);
//     return [];
//   }

//   if (!productCategories || productCategories.length === 0) {
//     return [];
//   }

//   const productIds = productCategories.map(pc => pc.product_id);

//   const { data, error } = await supabase
//     .from('products')
//     .select('*')
//     .in('id', productIds)
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.error('Error fetching products by category:', error);
//     throw new Error(error.message);
//   }

//   return data || [];
// }

// export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
//   const supabase = createClient();

//   // STEP 1: Get Category ID
//   const { data: category, error: categoryError } = await supabase
//     .from('categories')
//     .select('id')
//     .eq('slug', categorySlug)
//     .single();

//   if (categoryError || !category) {
//     console.error(`❌ CRÍTICO: Categoría "${categorySlug}" no encontrada en BD.`);
//     return []; // Retorna vacío si no hay categoría
//   }
//   console.log(`✅ Category ID encontrado: ${category.id}`);

//   // // STEP 2: Get Relations
//   // const { data: productCategories, error: pcError } = await supabase
//   //   .from('product_categories')
//   //   .select('product_id')
//   //   .eq('category_id', category.id);

//   // if (pcError) {
//   //   console.error(`❌ ERROR en tabla product_categories:`, pcError);
//   //   return [];
//   // }

//   // console.log(`🔗 Encontradas ${productCategories.length} relaciones.`);
//   // if (!productCategories || productCategories.length === 0) {
//   //   console.warn(`⚠️ ADVERTENCIA: La categoría ${categorySlug} existe, pero NO tiene productos vinculados en la tabla 'product_categories'.`);
//   //   return [];
//   // }

//   // STEP 2: Get Relations (DEBUG MODE)
//   const { data: allRelations, error: allError } = await supabase
//     .from('product_categories')
//     .select('*'); // QUITAMOS el filtro .eq() temporalmente

//   console.log('🔍 DEBUG: TODAS las relaciones en la tabla:', allRelations);
//   console.log('🔍 DEBUG: Error si existe:', allError);

//   // ... resto del código igual ...

//   // STEP 3: Get Products
//   const productIds = productCategories.map(pc => pc.product_id);

//   // ... después de const { data: productCategories, error: pcError } = ...

//   // 🔍 AGREGA ESTO PARA DEPURACIÓN:
//   console.log('📥 QUERY RESULT (Raw):', productCategories);
//   console.log('📥 ERROR:', pcError);

//   if (pcError) {
//     console.error('❌ Error buscando relaciones:', pcError);
//     return [];
//   }
//   const { data, error } = await supabase
//     .from('products')
//     .select('*')
//     .in('id', productIds) // .in() es correcto para arrays
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.error(`❌ ERROR al buscar productos:`, error);
//     return [];
//   }

//   console.log(`✅ ÉXITO: ${data?.length} productos recuperados.`);
//   return data || [];
// }

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
 * Map Supabase product to UI format
 * Converts DB schema to what ProductCard expects
 */
export function mapProductToCard(product: Product) {
  const price = product.offer_price || product.base_price;
  const discount = product.offer_price
    ? Math.round(((product.base_price - product.offer_price) / product.base_price) * 100)
    : undefined;

  return {
    id: product.id,
    name: product.name,
    price: price,
    image: getProductImage(product.name, product.images?.[0]),
    category: product.name, // Will be enhanced with category lookup
    rating: 5, // Default rating - could be added to schema
    reviews: 0, // Default reviews - could be added to schema
    isNew: product.is_featured,
    discount: discount,
  };
}
