// AMPerformance - Database Seeder
// Run with: npx tsx src/lib/seed.ts
import dotenv from 'dotenv';
dotenv.config();


import { createClient } from '@supabase/supabase-js';
import type { ProductInsert } from '@/types/database';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// SEED DATA
// ==========================================

const categories = [
  {
    name: 'Cardio',
    slug: 'cardio',
    description: 'Equipos de cardio de alto rendimiento',
    image_url: 'https://placehold.co/400x400/black/white?text=Cardio',
  },
  {
    name: 'Máquinas de Fuerza',
    slug: 'maquinas-fuerza',
    description: 'Máquinas selectorizadas para entrenamiento de fuerza',
    image_url: 'https://placehold.co/400x400/black/white?text=Máquinas',
  },
  {
    name: 'Mancuernas y Kettlebells',
    slug: 'mancuernas-kettlebells',
    description: 'Pesas libres y kettlebells para entrenamiento funcional',
    image_url: 'https://placehold.co/400x400/black/white?text=Mancuernas',
  },
  {
    name: 'Barras y Discos',
    slug: 'barras-discos',
    description: 'Barras olímpicas y discos de diferentes pesos',
    image_url: 'https://placehold.co/400x400/black/white?text=Barras',
  },
  {
    name: 'Racks y Bancos',
    slug: 'racks-bancos',
    description: 'Racks de potencia, racks multifunción y bancos de entrenamiento',
    image_url: 'https://placehold.co/400x400/black/white?text=Racks',
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Bandas, sogas, colchonetas y más accesorios',
    image_url: 'https://placehold.co/400x400/black/white?text=Accesorios',
  },
];

const products: Omit<ProductInsert, 'created_at' | 'updated_at'>[] = [
  // CARDIO
  {
    sku: 'CARD-001',
    name: 'Caminadora Comercial T350',
    description: 'Caminadora profesional con motor de 4.0 HP, velocidad máxima 20 km/h, inclinación automática 0-15%, pantalla táctil de 10.1", compatible con apps de fitness.',
    base_price: 1850000,
    offer_price: 1599000,
    is_featured: true,
    in_stock: true,
    stock_quantity: 5,
    variants: { motor: '4.0 HP', velocidad: '20 km/h', pantalla: '10.1"', peso_maximo: '180 kg' },
    images: ['https://placehold.co/800x800/black/white?text=Caminadora+T350'],
  },
  {
    sku: 'CARD-002',
    name: 'Bicicleta Spinning Pro',
    description: 'Bicicleta de spinning con volante de 22 kg, transmisión por correa, sistema de freno de emergencia, asiento y manillar ajustables.',
    base_price: 450000,
    offer_price: null,
    is_featured: true,
    in_stock: true,
    stock_quantity: 12,
    variants: { volante: '22 kg', transmission: 'Correa', peso_maximo: '150 kg' },
    images: ['https://placehold.co/800x800/black/white?text=Bici+Spinning'],
  },
  {
    sku: 'CARD-003',
    name: 'Elíptica Profesional Elite',
    description: 'Elíptica con stride de 51 cm, 32 niveles de resistencia, volante de 14 kg, monitor cardíaco y compatibilidad con apps.',
    base_price: 980000,
    offer_price: 850000,
    is_featured: false,
    in_stock: true,
    stock_quantity: 8,
    variants: { stride: '51 cm', niveles: '32', volante: '14 kg' },
    images: ['https://placehold.co/800x800/black/white?text=Elíptica+Elite'],
  },

  // MÁQUINAS DE FUERZA
  {
    sku: 'MAQ-001',
    name: 'Press de Banca Plate Loaded',
    description: 'Máquina de press de banca con estructura de acero reforzado, regulación de altura del soporte, funda para discos olímpicos.',
    base_price: 650000,
    offer_price: null,
    is_featured: true,
    in_stock: true,
    stock_quantity: 6,
    variants: { capacidad: '400 kg', estructura: 'Acero 3mm', dimensiones: '180x150x140 cm' },
    images: ['https://placehold.co/800x800/black/white?text=Press+Banca'],
  },
  {
    sku: 'MAQ-002',
    name: 'Dual Pec Fly / Rear Delt',
    description: 'Máquina dual para trabajo de pecho y hombros posteriores. Movimiento convergente para mejor sensación muscular.',
    base_price: 520000,
    offer_price: 480000,
    is_featured: false,
    in_stock: true,
    stock_quantity: 4,
    variants: { capacidad: '300 kg', peso_total: '180 kg' },
    images: ['https://placehold.co/800x800/black/white?text=Pec+Fly'],
  },
  {
    sku: 'MAQ-003',
    name: 'Lat Pulldown Luxe',
    description: 'Máquina de polea alta con recorrido fluido, asiento regulable en altura, barraWide grip y narrow grip incluidas.',
    base_price: 480000,
    offer_price: null,
    is_featured: true,
    in_stock: true,
    stock_quantity: 7,
    variants: { poleas: '2', cable: 'Acero recubierto', capacidad: '250 kg' },
    images: ['https://placehold.co/800x800/black/white?text=Lat+Pulldown'],
  },

  // MANCUERNAS Y KETTLEBELLS
  {
    sku: 'MAN-001',
    name: 'Mancuerna Olímpica 10kg',
    description: 'Mancuerna hexagonal de goma con mango cromado. Peso: 10 kg. Par para entrenamiento bilateral.',
    base_price: 45000,
    offer_price: 38000,
    is_featured: true,
    in_stock: true,
    stock_quantity: 50,
    variants: { peso: '10 kg', material: 'Goma/Hierro', mango: 'Cromado' },
    images: ['https://placehold.co/800x800/black/white?text=Mancuerna+10kg'],
  },
  {
    sku: 'MAN-002',
    name: 'Kettlebell 16kg Competition',
    description: 'Kettlebell de competition estándar. Asa ergonómica, cuerpo de acero, peso calibrado para CrossFit.',
    base_price: 68000,
    offer_price: null,
    is_featured: false,
    in_stock: true,
    stock_quantity: 30,
    variants: { peso: '16 kg', tipo: 'Competition', material: 'Acero' },
    images: ['https://placehold.co/800x800/black/white?text=Kettlebell+16kg'],
  },
  {
    sku: 'MAN-003',
    name: 'Set Mancuernas Ajustables 20kg',
    description: 'Set de mancuernas ajustables con pesas de 2.5kg, 5kg y 10kg. Incluye barra y замок.',
    base_price: 185000,
    offer_price: 165000,
    is_featured: false,
    in_stock: true,
    stock_quantity: 15,
    variants: { peso_max: '20 kg', piezas: '6 pares', material: 'Acero/Cromo' },
    images: ['https://placehold.co/800x800/black/white?text=Mancuernas+Ajustables'],
  },

  // BARRAS Y DISCOS
  {
    sku: 'BAR-001',
    name: 'Barra Olímpica 20kg',
    description: 'Barra recta olímpica 220 cm, carga máxima 680 kg,轴承 de bronze autolubricantes,markas de carga.',
    base_price: 145000,
    offer_price: null,
    is_featured: true,
    in_stock: true,
    stock_quantity: 25,
    variants: { peso: '20 kg', longitud: '220 cm', capacidad: '680 kg' },
    images: ['https://placehold.co/800x800/black/white?text=Barra+Olímpica'],
  },
  {
    sku: 'BAR-002',
    name: 'Disco Bumper 20kg Competition',
    description: 'Disco bumper de competition-certificado IWF. Tolerance ±10g. Color: Azul. Par.',
    base_price: 95000,
    offer_price: 85000,
    is_featured: false,
    in_stock: true,
    stock_quantity: 40,
    variants: { peso: '20 kg', tipo: 'Competition', color: 'Azul', tolerance: '±10g' },
    images: ['https://placehold.co/800x800/black/white?text=Disco+20kg'],
  },

  // RACKS Y BANCOS
  {
    sku: 'RAC-001',
    name: 'Rack de Potencia SR-650',
    description: 'Rack de potencia profesional con spotter platforms, bandas elásticas hooks,J-hooks regulables. Capacidad 450 kg.',
    base_price: 890000,
    offer_price: 780000,
    is_featured: true,
    in_stock: true,
    stock_quantity: 3,
    variants: { capacidad: '450 kg', altura: '193 cm', profundidad: '122 cm', spotter: 'Sí' },
    images: ['https://placehold.co/800x800/black/white?text=Rack+SR650'],
  },
  {
    sku: 'RAC-002',
    name: 'Banco Multifunción Ajustable',
    description: 'Banco plano/inclinado/declinado con soporte para press de hombros. Estructura de acero reforzado.',
    base_price: 280000,
    offer_price: null,
    is_featured: false,
    in_stock: true,
    stock_quantity: 18,
    variants: { capacidad: '400 kg', angulos: '7 posiciones', estructura: 'Acero 2.5mm' },
    images: ['https://placehold.co/800x800/black/white?text=Banco+Multi'],
  },

  // ACCESORIOS
  {
    sku: 'ACC-001',
    name: 'Set Bandas de Resistencia (5 niveles)',
    description: 'Set de 5 bandas de resistencia progresivas. Niveles: XS, S, M, L, XL. Ideales para calentamiento y rehabilitación.',
    base_price: 35000,
    offer_price: 28000,
    is_featured: true,
    in_stock: true,
    stock_quantity: 60,
    variants: { niveles: '5', resistencias: '3-30 kg', material: 'Látex premium' },
    images: ['https://placehold.co/800x800/black/white?text=Bandas'],
  },
  {
    sku: 'ACC-002',
    name: 'Soga de Batida Speed Jump',
    description: 'Soga de saltar profesional con cable de acero recubierto, rodamientos 360°, mango ergonómico antiderrapante.',
    base_price: 18000,
    offer_price: null,
    is_featured: false,
    in_stock: true,
    stock_quantity: 100,
    variants: { longitud: '3 m', rodamientos: '360°', material: 'Acero/Plástico' },
    images: ['https://placehold.co/800x800/black/white?text=Soga+Batida'],
  },
];

// Category-to-Product mapping (by index)
// 0: Cardio -> products 0, 1, 2
// 1: Máquinas -> products 3, 4, 5
// 2: Mancuernas -> products 6, 7, 8
// 3: Barras -> products 9, 10
// 4: Racks -> products 11, 12
// 5: Accesorios -> products 13, 14

const categoryProductMap: { [key: number]: number[] } = {
  0: [0, 1, 2],       // Cardio
  1: [3, 4, 5],       // Máquinas
  2: [6, 7, 8],       // Mancuernas
  3: [9, 10],         // Barras
  4: [11, 12],        // Racks
  5: [13, 14],        // Accesorios
};

// ==========================================
// SEED FUNCTION
// ==========================================

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  let categoriesInserted = 0;
  let productsInserted = 0;
  let relationsCreated = 0;

  // 1. Seed Categories
  console.log('📦 Seeding categories...');
  for (const category of categories) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.slug)
      .single();

    if (existing) {
      console.log(`   ⏭️  Category "${category.name}" already exists, skipping...`);
      continue;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select('id')
      .single();

    if (error) {
      console.error(`   ❌ Error inserting category "${category.name}":`, error.message);
    } else {
      categoriesInserted++;
      console.log(`   ✅ Inserted category: ${category.name}`);
    }
  }

  // 2. Fetch category IDs
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, slug');

  const categoryMap: { [key: string]: string } = {};
  allCategories?.forEach((cat) => {
    categoryMap[cat.slug] = cat.id;
  });

  // 3. Seed Products
  console.log('\n📦 Seeding products...');
  const productIds: string[] = [];

  for (const product of products) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .single();

    if (existing) {
      console.log(`   ⏭️  Product "${product.name}" already exists, skipping...`);
      productIds.push(existing.id);
      continue;
    }

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select('id')
      .single();

    if (error) {
      console.error(`   ❌ Error inserting product "${product.name}":`, error.message);
    } else {
      productsInserted++;
      productIds.push(data!.id);
      console.log(`   ✅ Inserted product: ${product.name} ($${product.base_price.toLocaleString()})`);
    }
  }

  // 4. Create Product-Category Relations
  console.log('\n🔗 Creating product-category relations...');
  for (const [categoryIndex, productIndices] of Object.entries(categoryProductMap)) {
    const catSlug = categories[parseInt(categoryIndex)].slug;
    const categoryId = categoryMap[catSlug];

    if (!categoryId) {
      console.warn(`   ⚠️  Category not found for slug: ${catSlug}`);
      continue;
    }

    for (const productIndex of productIndices) {
      const productId = productIds[productIndex];
      if (!productId) continue;

      const { error } = await supabase
        .from('product_categories')
        .upsert(
          { product_id: productId, category_id: categoryId },
          { onConflict: 'product_id,category_id' }
        );

      if (error) {
        console.error(`   ❌ Error creating relation:`, error.message);
      } else {
        relationsCreated++;
        console.log(`   ✅ Linked product ${productIndex} to ${catSlug}`);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SEED SUMMARY');
  console.log('='.repeat(50));
  console.log(`   Categories inserted: ${categoriesInserted}`);
  console.log(`   Products inserted:   ${productsInserted}`);
  console.log(`   Relations created:  ${relationsCreated}`);
  console.log('='.repeat(50));

  if (categoriesInserted === 0 && productsInserted === 0) {
    console.log('\nℹ️  Database already seeded. No new items added.');
  } else {
    console.log('\n🎉 Database seeding completed!');
  }
}

// Run the seed
seedDatabase().catch((error) => {
  console.error('❌ Fatal error during seeding:', error);
  process.exit(1);
});
