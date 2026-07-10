-- Migration: seed_catalog_data
-- Description: Schema adjustments + seed catalog data from Excel
-- Generated: 2026-07-09T22:12:06.281421

-- ==========================================
-- 1. Schema adjustments
-- ==========================================

ALTER TABLE products ALTER COLUMN description DROP NOT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS provider_code TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}'::jsonb;
ALTER TABLE project_leads DROP CONSTRAINT IF EXISTS project_leads_assigned_to_fkey;
DROP TABLE IF EXISTS admin_users CASCADE;

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_parent_id_key;
ALTER TABLE categories ADD UNIQUE (name, parent_id);

-- ==========================================
-- 2. Lines
-- ==========================================

INSERT INTO lines (name, slug) VALUES ('Elite', 'elite') ON CONFLICT (slug) DO NOTHING;
INSERT INTO lines (name, slug) VALUES ('Elite A Disco', 'elite-a-disco') ON CONFLICT (slug) DO NOTHING;
INSERT INTO lines (name, slug) VALUES ('Essential', 'essential') ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 3. Categories
-- ==========================================

INSERT INTO categories (name, slug) VALUES ('Bancos & Soportes', 'bancos-soportes') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id)
SELECT 'Bancos', 'bancos-soportes-bancos', id FROM categories WHERE slug = 'bancos-soportes'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES ('Cardio & Entrenamiento', 'cardio-entrenamiento') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id)
SELECT 'Maquinas Aerobicas', 'cardio-entrenamiento-maquinas-aerobicas', id FROM categories WHERE slug = 'cardio-entrenamiento'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id)
SELECT 'Maquinas de Aire', 'cardio-entrenamiento-maquinas-de-aire', id FROM categories WHERE slug = 'cardio-entrenamiento'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES ('Estructuras & Multiestaciones', 'estructuras-multiestaciones') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id)
SELECT 'Lingoteras', 'estructuras-multiestaciones-lingoteras', id FROM categories WHERE slug = 'estructuras-multiestaciones'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES ('Funcional - Accesorios - Almacenamiento - Pisos', 'funcional-accesorios-almacenamiento-pisos') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id)
SELECT 'Acc. Polea', 'funcional-accesorios-almacenamiento-pisos-acc-polea', id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES ('Maquinas', 'maquinas') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id)
SELECT 'A Disco', 'maquinas-a-disco', id FROM categories WHERE slug = 'maquinas'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, parent_id)
SELECT 'Lingoteras', 'maquinas-lingoteras', id FROM categories WHERE slug = 'maquinas'
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 4. Products & Variants
-- ==========================================

-- FF-01 - sillon femorales
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'sillon femorales',
        'sillon-femorales',
        'lingotera de 100kg',
        'FF01',
        '{"dimensions": "1516*1097*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF-01', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF02 - sillon cuadricep
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'sillon cuadricep',
        'sillon-cuadricep',
        'lingotera de 100kg',
        'FF02',
        '{"dimensions": "1372*1252*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF02', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF-03 - prensa 90 grados lingotera
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'prensa 90 grados lingotera',
        'prensa-90-grados-lingotera',
        'lingotera de 100kg',
        'FF03',
        '{"dimensions": "1969*1125*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF-03', 'Única', 2787.84, 1548.80, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF-06 - press de hombros
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'press de hombros',
        'press-de-hombros',
        'lingotera de 100kg',
        'FF06',
        '{"dimensions": "1505*1345*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF-06', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF07 - peck deck / posteriores
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'peck deck / posteriores',
        'peck-deck-posteriores',
        'lingotera de 100kg',
        'FF07',
        '{"dimensions": "1349*1018*2095"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF07', 'Única', 2653.20, 1474, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF08 - press de pecho
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'press de pecho',
        'press-de-pecho',
        'lingotera de 100kg',
        'FF08',
        '{"dimensions": "1426*1412*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF08', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF24 - maquina de gluteos
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'maquina de gluteos',
        'maquina-de-gluteos',
        'lingotera de 100kg',
        'FF24',
        '{"dimensions": "1337*1013*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF24', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF256 - maquina de aductores y abductores
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'maquina de aductores y abductores',
        'maquina-de-aductores-y-abductores',
        'lingotera de 100kg',
        'FF25',
        '{"dimensions": "1679*746*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF256', 'Única', 2653.20, 1474, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF29 - maquina dorsalera individual
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'maquina dorsalera individual',
        'maquina-dorsalera-individual',
        'lingotera de 100kg',
        'FF29',
        '{"dimensions": "1540*1200*2055"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF29', 'Única', 2653.20, 1474, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF33 - maquina remo
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'maquina remo',
        'maquina-remo',
        'lingotera de 100kg',
        'FF33',
        '{"dimensions": "2036*1167*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF33', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF34 - maquina remo con apoyo
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'maquina remo con apoyo',
        'maquina-remo-con-apoyo',
        'lingotera de 100kg',
        'FF34',
        '{"dimensions": "1286*1267*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF34', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- FF89 - maquina dorsalera & remo
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'maquina dorsalera & remo',
        'maquina-dorsalera-remo',
        'lingotera de 100kg',
        'FF89',
        '{"dimensions": "2130*1230*2225"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'FF89', 'Única', 2070.29, 1150.16, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- fb17 - polea doble en v
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'polea doble en v',
        'polea-doble-en-v',
        '2 lingoteras de 70kg',
        'FB17',
        '{"dimensions": "1890*1040*2300"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'fb17', 'Única', 2716.56, 1509.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- fb16 - polea doble enfrentada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'polea doble enfrentada',
        'polea-doble-enfrentada',
        '2 lingoteras de 70kg',
        'FB16',
        '{"dimensions": "3830*700*2260"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'fb16', 'Única', 2716.56, 1509.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff94 - Vuelos laterales a polea
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'Vuelos laterales a polea',
        'vuelos-laterales-a-polea',
        'lingotera de 100kg',
        'FF94',
        '{"dimensions": "1465*865*2005"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff94', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff30 - bicep a polea
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'bicep a polea',
        'bicep-a-polea',
        'lingotera de 100kg',
        'FF86',
        '{"dimensions": "1464*1252*150"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff30', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff19 - abdominales en polea
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'abdominales en polea',
        'abdominales-en-polea',
        'lingotera de 100kg',
        'FF19',
        '{"dimensions": "1120* 1155* 1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff19', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff87 - cuadricep y femorales
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'cuadricep y femorales',
        'cuadricep-y-femorales',
        'lingotera de 100kg',
        'FF87',
        '{"dimensions": "1255*1360*1500"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff87', 'Única', 2620.02, 1455.56, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- f81 - 5 multi station
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        '5 multi station',
        '5-multi-station',
        'lingotera de 100kg',
        NULL,
        '{"dimensions": "5170*4620*231"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'f81', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- f83 - 8 multi station
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        '8 multi station',
        '8-multi-station',
        'lingotera de 100kg',
        NULL,
        '{"dimensions": "5170*4620*2310"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'f83', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- c81 - polea multifuncional smith
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-lingoteras'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'polea multifuncional smith',
        'polea-multifuncional-smith',
        '2 lingoteras de 70kg',
        'C81',
        '{"dimensions": "1470*1960*2230"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'c81', 'Única', 3445.20, 1914, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff36 - banco plano
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'bancos-soportes-bancos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'banco plano',
        'banco-plano',
        NULL,
        'FF36',
        '{"dimensions": "1280*736*380"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff36', 'Única', 372.24, 206.80, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff37 - banco abdominales
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'bancos-soportes-bancos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'banco abdominales',
        'banco-abdominales',
        NULL,
        'FF37',
        '{"dimensions": "1626*736*1071"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff37', 'Única', 732.60, 407, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff38 - banco 90 grados
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'bancos-soportes-bancos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'banco 90 grados',
        'banco-90-grados',
        NULL,
        'FF38',
        '{"dimensions": "1157*736*778"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff38', 'Única', 372.24, 206.80, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff39 - banco multiangular
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'bancos-soportes-bancos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'banco multiangular',
        'banco-multiangular',
        NULL,
        'FF39',
        '{"dimensions": "1329*736*511"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff39', 'Única', 633.60, 352, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff45 - banco lumbar
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'bancos-soportes-bancos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'banco lumbar',
        'banco-lumbar',
        NULL,
        'FF45',
        '{"dimensions": "1111*749*757"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff45', 'Única', 633.60, 352, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff42 - banco olimpico inclinado
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'bancos-soportes-bancos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'banco olimpico inclinado',
        'banco-olimpico-inclinado',
        NULL,
        'FF42',
        '{"dimensions": "1942*1784*1425"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff42', 'Única', 1188, 660, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff43 - banco olimpico declinado
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'bancos-soportes-bancos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'banco olimpico declinado',
        'banco-olimpico-declinado',
        NULL,
        'FF43',
        '{"dimensions": "1742*1784*1280"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff43', 'Única', 1053.36, 585.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff44 - banco scott
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'bancos-soportes-bancos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'banco scott',
        'banco-scott',
        NULL,
        'FF44',
        '{"dimensions": "924*934*900"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff44', 'Única', 574.20, 319, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff63 - maquina smith inclinada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'maquina smith inclinada',
        'maquina-smith-inclinada',
        NULL,
        'FF63',
        '{"dimensions": "2209*1272*2317"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff63', 'Única', 2201.76, 1223.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- f63 - maquina smith recta
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'maquina smith recta',
        'maquina-smith-recta',
        NULL,
        'FF63',
        '{"dimensions": "2210*1150*2190"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'f63', 'Única', 2201.76, 1223.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff50 - rack sentadilla
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'estructuras-multiestaciones'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'rack sentadilla',
        'rack-sentadilla',
        NULL,
        'FF50',
        '{"dimensions": "1691*1641*1842"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff50', 'Única', 1120.68, 622.60, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ff54 - porta discos
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'porta discos',
        'porta-discos',
        NULL,
        'FF54',
        '{"dimensions": "620*605*1264"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'ff54', 'Única', 451.44, 250.80, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- go5 - pecho a disco
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'pecho a disco',
        'pecho-a-disco',
        NULL,
        'FF08',
        '{"dimensions": "1500*1200*1715"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'go5', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- g25 - remo bajo a disco
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'remo bajo a disco',
        'remo-bajo-a-disco',
        NULL,
        'G25',
        '{"dimensions": "1320*1250*1630"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'g25', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- g30 - remo bajo inclinado a disco
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'remo bajo inclinado a disco',
        'remo-bajo-inclinado-a-disco',
        NULL,
        'G30',
        '{"dimensions": "1190*1380*1300"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'g30', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- g35 - hombro a discos
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'hombro a discos',
        'hombro-a-discos',
        NULL,
        'G35',
        '{"dimensions": "1570*1290*1630"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'g35', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- g50 - prensa
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'prensa',
        'prensa',
        NULL,
        'G50',
        '{"dimensions": "1780*2060*1525"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'g50', 'Única', 2514.60, 1397, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- spl36 - prensa 90 grados
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'prensa 90 grados',
        'prensa-90-grados',
        NULL,
        'SPL36',
        '{"dimensions": "2450*1770*1620"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'spl36', 'Única', 3334.32, 1852.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- spl37 - prensa 90 grados sistema dual
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'prensa 90 grados sistema dual',
        'prensa-90-grados-sistema-dual',
        NULL,
        'SPL37',
        '{"dimensions": "2475*1790*1645"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'spl37', 'Única', 3666.96, 2037.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- spl40 - squat machine
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'squat machine',
        'squat-machine',
        NULL,
        NULL,
        '{"dimensions": "1885*1395*1620"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'spl40', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- spl42 - squat pendular
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'squat pendular',
        'squat-pendular',
        NULL,
        'SPL42',
        '{"dimensions": "2020*1860*1445"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'spl42', 'Única', 3334.32, 1852.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- spl44 - hack squat
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'hack squat',
        'hack-squat',
        NULL,
        'SPL44',
        '{"dimensions": "2280*1345*1620"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'spl44', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- spl67 - pecho a disco asistido
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'pecho a disco asistido',
        'pecho-a-disco-asistido',
        NULL,
        'SPL67',
        '{"dimensions": "2235*1745*1615"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'spl67', 'Única', 3132.36, 1740.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- spl68 - hombro a disco asistido
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'hombro a disco asistido',
        'hombro-a-disco-asistido',
        NULL,
        'SPL68',
        '{"dimensions": "2100*1955*2215"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'spl68', 'Única', 3132.36, 1740.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- g55 - cuadricep a disco
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'cuadricep a disco',
        'cuadricep-a-disco',
        NULL,
        'G55',
        '{"dimensions": "1604*1338*1013"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'g55', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- ll623 - hip trust
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'hip trust',
        'hip-trust',
        NULL,
        'AN65-(1)',
        '{"dimensions": "1546*1140*730"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'll623', 'Única', 1330.56, 739.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- an55 - sentadilla hack
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'sentadilla hack',
        'sentadilla-hack',
        NULL,
        NULL,
        '{"dimensions": "2100*1660*1290"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'an55', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- PL-57 - remo a disco. convergente
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'remo a disco. convergente',
        'remo-a-disco-convergente',
        NULL,
        NULL,
        '{"dimensions": "1820*1135*1185"}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'PL-57', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- cc58 - air bike echo
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'cardio-entrenamiento-maquinas-de-aire'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'air bike echo',
        'air-bike-echo',
        NULL,
        'D23',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'cc58', 'Única', 1326.60, 737, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- cc14 - bike erg
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'cardio-entrenamiento-maquinas-de-aire'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'bike erg',
        'bike-erg',
        NULL,
        'CC14',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'cc14', 'Única', 1255.32, 697.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- y600b - cinta curva
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'cardio-entrenamiento-maquinas-de-aire'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'cinta curva',
        'cinta-curva',
        NULL,
        'CC16A',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'y600b', 'Única', 2827.44, 1570.80, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- NITREC - bici fija de spinning
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'cardio-entrenamiento-maquinas-aerobicas'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'bici fija de spinning',
        'bici-fija-de-spinning',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'NITREC', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND D16 - bici fija de spinning pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'cardio-entrenamiento-maquinas-aerobicas'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'bici fija de spinning pro',
        'bici-fija-de-spinning-pro',
        NULL,
        'D16',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND D16', 'Única', 993.56, 551.98, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- rt i led g3 - cinta de correr movement
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'cardio-entrenamiento-maquinas-aerobicas'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'cinta de correr movement',
        'cinta-de-correr-movement',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'rt i led g3', 'Única', 6318, 3510, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- lx e g4 - eliptico movement
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'cardio-entrenamiento-maquinas-aerobicas'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'eliptico movement',
        'eliptico-movement',
        NULL,
        'B06',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'lx e g4', 'Única', 1607.76, 893.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- lx r g4 - bicicleta movement
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'cardio-entrenamiento-maquinas-aerobicas'),
        (SELECT id FROM lines WHERE slug = 'elite'),
        'bicicleta movement',
        'bicicleta-movement',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'lx r g4', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL01 - Prensa de Pecho Vertical Superior
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Pecho Vertical Superior',
        'prensa-de-pecho-vertical-superior',
        NULL,
        'SPL01',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL01', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL02 - Prensa de Pecho Inclinada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Pecho Inclinada',
        'prensa-de-pecho-inclinada',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL02', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL03 - Prensa de Pecho Declinada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Pecho Declinada',
        'prensa-de-pecho-declinada',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL03', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL04 - Prensa de Banco Horizontal
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Banco Horizontal',
        'prensa-de-banco-horizontal',
        NULL,
        'SPL04',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL04', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL05 - Prensa de Banco Inclinada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Banco Inclinada',
        'prensa-de-banco-inclinada',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL05', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL06 - Apertura de Pecho Medio (Pec Fly)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Apertura de Pecho Medio (Pec Fly)',
        'apertura-de-pecho-medio-pec-fly',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL06', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL07 - Apertura de Pecho Superior
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Apertura de Pecho Superior',
        'apertura-de-pecho-superior',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL07', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL08 - Apertura de Pecho Inferior
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Apertura de Pecho Inferior',
        'apertura-de-pecho-inferior',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL08', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL09 - Prensa Múltiple Horizontal
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa Múltiple Horizontal',
        'prensa-múltiple-horizontal',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL09', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL10 - Prensa de Fondos (Dips) Sistema Dual
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Fondos (Dips) Sistema Dual',
        'prensa-de-fondos-dips-sistema-dual',
        NULL,
        'SPL10',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL10', 'Única', 3132.36, 1740.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL11 - Prensa de Fondos Estándar
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Fondos Estándar',
        'prensa-de-fondos-estándar',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL11', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL12 - Máquina Pullover Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina Pullover Pro',
        'máquina-pullover-pro',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL12', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL13 - Máquina Pullover Estándar
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina Pullover Estándar',
        'máquina-pullover-estándar',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL13', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL14 - Dorsalera Lat Convergente
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Dorsalera Lat Convergente',
        'dorsalera-lat-convergente',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL14', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL15 - Jalón Dorsal Circular
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Jalón Dorsal Circular',
        'jalón-dorsal-circular',
        NULL,
        'SPL15',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL15', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL16 - Remo Alto Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Remo Alto Pro',
        'remo-alto-pro',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL16', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL17 - Remo de Potencia Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Remo de Potencia Pro',
        'remo-de-potencia-pro',
        NULL,
        'SPL17',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL17', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL18 - Remo Bajo Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Remo Bajo Pro',
        'remo-bajo-pro',
        NULL,
        'FF33',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL18', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL19 - Remo Quiebre Articulado
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Remo Quiebre Articulado',
        'remo-quiebre-articulado',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL19', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL20 - Remo Circular Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Remo Circular Pro',
        'remo-circular-pro',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL20', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL21 - Remo en Barra T (T-Bar Row)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Remo en Barra T (T-Bar Row)',
        'remo-en-barra-t-t-bar-row',
        NULL,
        'G25',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL21', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL22 - Barra Dorsal Superior
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Barra Dorsal Superior',
        'barra-dorsal-superior',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL22', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL23 - Barra Dorsal Frontal
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Barra Dorsal Frontal',
        'barra-dorsal-frontal',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL23', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL24 - Máquina de Encogimiento de Hombros (Shrug)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina de Encogimiento de Hombros (Shrug)',
        'máquina-de-encogimiento-de-hombros-shrug',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL24', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL25 - Prensa de Deltoides Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Deltoides Pro',
        'prensa-de-deltoides-pro',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL25', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL26 - Vuelos Laterales de Deltoides
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Vuelos Laterales de Deltoides',
        'vuelos-laterales-de-deltoides',
        NULL,
        'FF94',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL26', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL27 - Deltoides Posteriores
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Deltoides Posteriores',
        'deltoides-posteriores',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL27', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL28 - Prensa Francesa Pro (Tríceps)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa Francesa Pro (Tríceps)',
        'prensa-francesa-pro-tríceps',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL28', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL29 - Máquina de Tríceps Alternada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina de Tríceps Alternada',
        'máquina-de-tríceps-alternada',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL29', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL30 - Máquina de Tríceps Integrada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina de Tríceps Integrada',
        'máquina-de-tríceps-integrada',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL30', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL31 - Máquina de Bíceps Alternada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina de Bíceps Alternada',
        'máquina-de-bíceps-alternada',
        NULL,
        'G65',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL31', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL32 - Máquina de Bíceps Scott
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina de Bíceps Scott',
        'máquina-de-bíceps-scott',
        NULL,
        'FF44',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL32', 'Única', 574.20, 319, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL33 - Máquina de Bíceps de Tres Ángulos
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina de Bíceps de Tres Ángulos',
        'máquina-de-bíceps-de-tres-ángulos',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL33', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL34 - Puente Prensa de Piernas Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Puente Prensa de Piernas Pro',
        'puente-prensa-de-piernas-pro',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL34', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL35 - Prensa de Piernas Horizontal Dual
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Piernas Horizontal Dual',
        'prensa-de-piernas-horizontal-dual',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL35', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL36 - Prensa de Piernas a 45 Grados
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Piernas a 45 Grados',
        'prensa-de-piernas-a-45-grados',
        NULL,
        'FF38',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL36', 'Única', 372.24, 206.80, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL37 - Prensa 45° Sistema Dual Profesional
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa 45° Sistema Dual Profesional',
        'prensa-45-sistema-dual-profesional',
        NULL,
        'SPL37',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL37', 'Única', 3666.96, 2037.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL38 - Prensa de Pierna Vertical Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Pierna Vertical Pro',
        'prensa-de-pierna-vertical-pro',
        NULL,
        'SPL38',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL38', 'Única', 3666.96, 2037.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL39 - Prensa de Pierna Vertical Estándar
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa de Pierna Vertical Estándar',
        'prensa-de-pierna-vertical-estándar',
        NULL,
        'SPL38',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL39', 'Única', 3666.96, 2037.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL40 - Máquina de Sentadillas Pro (Squat)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina de Sentadillas Pro (Squat)',
        'máquina-de-sentadillas-pro-squat',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL40', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL41 - Sentadilla de Potencia Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Sentadilla de Potencia Pro',
        'sentadilla-de-potencia-pro',
        NULL,
        'SPL41',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL41', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL42 - Sentadilla de Péndulo Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Sentadilla de Péndulo Pro',
        'sentadilla-de-péndulo-pro',
        NULL,
        'SPL42',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL42', 'Única', 3334.32, 1852.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL43 - Sentadilla con Cinturón (Belt Squat)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Sentadilla con Cinturón (Belt Squat)',
        'sentadilla-con-cinturón-belt-squat',
        NULL,
        'SPL43',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL43', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL44 - Sentadilla Hacka Profesional (Hack Squat)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Sentadilla Hacka Profesional (Hack Squat)',
        'sentadilla-hacka-profesional-hack-squat',
        NULL,
        'SPL41',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL44', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL45 - Extensión de Pantorrillas Hacka
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Extensión de Pantorrillas Hacka',
        'extensión-de-pantorrillas-hacka',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL45', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL46 - Simulador de Carrera de Potencia (Power Runner)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Simulador de Carrera de Potencia (Power Runner)',
        'simulador-de-carrera-de-potencia-power-runner',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL46', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL47 - Máquina de Empuje de Cadera (Hip Thrust)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina de Empuje de Cadera (Hip Thrust)',
        'máquina-de-empuje-de-cadera-hip-thrust',
        NULL,
        'SPL47',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL47', 'Única', 2732.40, 1518, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL48 - Abductor de Pie
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Abductor de Pie',
        'abductor-de-pie',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL48', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL49 - Extensión de Pierna Alternada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Extensión de Pierna Alternada',
        'extensión-de-pierna-alternada',
        NULL,
        'SPL49',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL49', 'Única', 2601.72, 1445.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL50 - Extensión de Piernas Estándar
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Extensión de Piernas Estándar',
        'extensión-de-piernas-estándar',
        NULL,
        'SPL50',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL50', 'Única', 2265.12, 1258.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL51 - Sillon de Femoral Alternado
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Sillon de Femoral Alternado',
        'sillon-de-femoral-alternado',
        NULL,
        'SPL51',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL51', 'Única', 3132.36, 1740.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL52 - Sillon de Femoral Estándar
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Sillon de Femoral Estándar',
        'sillon-de-femoral-estándar',
        NULL,
        'SPL52',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL52', 'Única', 2265.12, 1258.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL53 - Sillon de Femoral Sentado
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Sillon de Femoral Sentado',
        'sillon-de-femoral-sentado',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL53', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL54 - Camillas de Femoral de Rodillas
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Camillas de Femoral de Rodillas',
        'camillas-de-femoral-de-rodillas',
        NULL,
        'SPL54',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL54', 'Única', 2692.80, 1496, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL55 - Hiperextensión Inversa (Reverse Hyper)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Hiperextensión Inversa (Reverse Hyper)',
        'hiperextensión-inversa-reverse-hyper',
        NULL,
        'SPL55',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL55', 'Única', 2265.12, 1258.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL56 - Pantorrilla Sentada Pro
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Pantorrilla Sentada Pro',
        'pantorrilla-sentada-pro',
        NULL,
        'SPL56',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL56', 'Única', 1999.80, 1111, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL57 - Pantorrilla Tipo Burro (Donkey Calf)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Pantorrilla Tipo Burro (Donkey Calf)',
        'pantorrilla-tipo-burro-donkey-calf',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL57', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL58 - Contractor de Pecho y Dorsal Inverso
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Contractor de Pecho y Dorsal Inverso',
        'contractor-de-pecho-y-dorsal-inverso',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL58', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL59 - Prensa Vikinga y Pantorrillas
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Prensa Vikinga y Pantorrillas',
        'prensa-vikinga-y-pantorrillas',
        NULL,
        'SPL59',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL59', 'Única', 3334.32, 1852.40, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL60 - Máquina Smith Olímpica con Contrapeso
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Máquina Smith Olímpica con Contrapeso',
        'máquina-smith-olímpica-con-contrapeso',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL60', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL61 - Medio Rack Olímpico (Half Rack)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Medio Rack Olímpico (Half Rack)',
        'medio-rack-olímpico-half-rack',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL61', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL62 - Jaula de Potencia Olímpica
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Jaula de Potencia Olímpica',
        'jaula-de-potencia-olímpica',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL62', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL63 - Banco Militar Olímpico
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Banco Militar Olímpico',
        'banco-militar-olímpico',
        NULL,
        'FF42',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL63', 'Única', 1188, 660, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL64 - Banco Predicador Bicep
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Banco Predicador Bicep',
        'banco-predicador-bicep',
        NULL,
        'FF86',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL64', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL65 - Banco con Rack para Barra de Bíceps
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Banco con Rack para Barra de Bíceps',
        'banco-con-rack-para-barra-de-bíceps',
        NULL,
        'G65',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL65', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL66 - Banco de Remo Plano Alto (Seal Row)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Banco de Remo Plano Alto (Seal Row)',
        'banco-de-remo-plano-alto-seal-row',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL66', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL67 - Torre de Prensa de Pecho Plana
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Torre de Prensa de Pecho Plana',
        'torre-de-prensa-de-pecho-plana',
        NULL,
        'SPL67',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL67', 'Única', 3132.36, 1740.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL68 - Torre de Prensa de Pecho Inclinada
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Torre de Prensa de Pecho Inclinada',
        'torre-de-prensa-de-pecho-inclinada',
        NULL,
        'SPL67',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL68', 'Única', 3132.36, 1740.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL69 - Entrenador de Abducción 3D
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Entrenador de Abducción 3D',
        'entrenador-de-abducción-3d',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL69', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-SPL70 - Entrenador de Pecho Ajustable
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas-a-disco'),
        (SELECT id FROM lines WHERE slug = 'elite-a-disco'),
        'Entrenador de Pecho Ajustable',
        'entrenador-de-pecho-ajustable',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-SPL70', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G05 - Prensa de Pecho Plana (Chest Press)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Prensa de Pecho Plana (Chest Press)',
        'prensa-de-pecho-plana-chest-press',
        NULL,
        'FF08',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G05', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G10 - Prensa de Pecho Ancha (Wide Chest Press)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Prensa de Pecho Ancha (Wide Chest Press)',
        'prensa-de-pecho-ancha-wide-chest-press',
        NULL,
        'FF08',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G10', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G15 - Prensa de Pecho Inclinada (Incline Chest Press)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Prensa de Pecho Inclinada (Incline Chest Press)',
        'prensa-de-pecho-inclinada-incline-chest-press',
        NULL,
        'FF08',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G15', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G20 - Jalón Dorsal (Pull Down)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Jalón Dorsal (Pull Down)',
        'jalón-dorsal-pull-down',
        NULL,
        'G20',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G20', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G25 - Remo Bajo (Low Row)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Remo Bajo (Low Row)',
        'remo-bajo-low-row',
        NULL,
        'FF33',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G25', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G30 - Remo Inclinado a Nivel (Incline Level Row)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Remo Inclinado a Nivel (Incline Level Row)',
        'remo-inclinado-a-nivel-incline-level-row',
        NULL,
        'G30',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G30', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G35 - Prensa de Hombros (Shoulder Press)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Prensa de Hombros (Shoulder Press)',
        'prensa-de-hombros-shoulder-press',
        NULL,
        'FF06',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G35', 'Única', 2399.76, 1333.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MNDG40- - Patada de Glúteo Posterior (Rear Kick)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Patada de Glúteo Posterior (Rear Kick)',
        'patada-de-glúteo-posterior-rear-kick',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MNDG40-', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G45 - Prensa de Pantorrillas (Calf)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Prensa de Pantorrillas (Calf)',
        'prensa-de-pantorrillas-calf',
        NULL,
        NULL,
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G45', 'Única', 0, NULL, FALSE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G50 - Prensa de Piernas (Leg Press)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Prensa de Piernas (Leg Press)',
        'prensa-de-piernas-leg-press',
        NULL,
        'G50',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G50', 'Única', 2514.60, 1397, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G55 - Extensión de Piernas (Leg Extension)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Extensión de Piernas (Leg Extension)',
        'extensión-de-piernas-leg-extension',
        NULL,
        'G55',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G55', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G60 - Fondos Sentado (Seated Dip)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Fondos Sentado (Seated Dip)',
        'fondos-sentado-seated-dip',
        NULL,
        'G60',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G60', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G65 - Máquina de Bíceps (Biceps)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Máquina de Bíceps (Biceps)',
        'máquina-de-bíceps-biceps',
        NULL,
        'G65',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G65', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G70 - Sillón de Femoral de Pie (Standing Leg Curl)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Sillón de Femoral de Pie (Standing Leg Curl)',
        'sillón-de-femoral-de-pie-standing-leg-curl',
        NULL,
        'G70',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G70', 'Única', 1627.56, 904.20, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- MND-G75 - Prensa de Piernas Lineal (Linear Leg Press)
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'maquinas'),
        (SELECT id FROM lines WHERE slug = 'essential'),
        'Prensa de Piernas Lineal (Linear Leg Press)',
        'prensa-de-piernas-lineal-linear-leg-press',
        NULL,
        'G75',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'MND-G75', 'Única', 3005.64, 1669.80, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- wg126 - manubrio recto
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos-acc-polea'),
        NULL,
        'manubrio recto',
        'manubrio-recto',
        NULL,
        'WG126',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'wg126', 'Única', 22.22, 12.34, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- wg114 - estribo individual
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos-acc-polea'),
        NULL,
        'estribo individual',
        'estribo-individual',
        NULL,
        'WG114',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'wg114', 'Única', 11.88, 6.60, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- wg112 - soga tricep
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos-acc-polea'),
        NULL,
        'soga tricep',
        'soga-tricep',
        NULL,
        'WG112',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'wg112', 'Única', 10.49, 5.83, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- wg118 - manubrio v tricep
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos-acc-polea'),
        NULL,
        'manubrio v tricep',
        'manubrio-v-tricep',
        NULL,
        'WG118',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'wg118', 'Única', 19.21, 10.67, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- wg103 - barra dorsalera
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos-acc-polea'),
        NULL,
        'barra dorsalera',
        'barra-dorsalera',
        NULL,
        'WG103',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'wg103', 'Única', 46.85, 26.03, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- wg106 - barra alternativa polea
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos-acc-polea'),
        NULL,
        'barra alternativa polea',
        'barra-alternativa-polea',
        NULL,
        'WG106',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'wg106', 'Única', 40.23, 22.35, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- wg116 - estribo triangular polea
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos-acc-polea'),
        NULL,
        'estribo triangular polea',
        'estribo-triangular-polea',
        NULL,
        'WG116',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'wg116', 'Única', 24.04, 13.35, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;
-- wg130 - kit de agarre dorsalera
WITH p AS (
    INSERT INTO products (category_id, line_id, name, slug, description, provider_code, attributes, is_active)
    VALUES (
        (SELECT id FROM categories WHERE slug = 'funcional-accesorios-almacenamiento-pisos-acc-polea'),
        NULL,
        'kit de agarre dorsalera',
        'kit-de-agarre-dorsalera',
        NULL,
        'WG130',
        '{}'::jsonb,
        TRUE
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category_id = EXCLUDED.category_id,
        line_id = EXCLUDED.line_id,
        description = EXCLUDED.description,
        provider_code = EXCLUDED.provider_code,
        attributes = EXCLUDED.attributes
    RETURNING id
)
INSERT INTO product_variants (product_id, sku, variant_name, price, cost_price, is_active)
SELECT id, 'wg130', 'Única', 118.92, 66.07, TRUE
FROM p
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    cost_price = EXCLUDED.cost_price,
    is_active = EXCLUDED.is_active;

-- ==========================================
-- 5. Images
-- ==========================================

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb01-commercial-grade-fitness-gym-machine-prone-leg-curl-product/', 'sillon femorales', 0, TRUE FROM products WHERE slug = 'sillon-femorales'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb02-new-pin-loaded-strength-gym-equipment-seated-leg-extension-product/', 'sillon cuadricep', 0, TRUE FROM products WHERE slug = 'sillon-cuadricep'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb03-commercial-pin-selection-pin-loaded-strength-gym-equipment-leg-press-machine-product/', 'prensa 90 grados lingotera', 0, TRUE FROM products WHERE slug = 'prensa-90-grados-lingotera'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb06-commercial-gym-equipment-bodybuilding-exercise-shoulder-press-machine-product/', 'press de hombros', 0, TRUE FROM products WHERE slug = 'press-de-hombros'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb07-factory-wholesale-commercial-fitness-exercise-gym-equipment-pearl-delrpec-fly-machine-product/', 'peck deck / posteriores', 0, TRUE FROM products WHERE slug = 'peck-deck-posteriores'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb08-factory-wholesale-commercial-fitness-pin-loaded-machine-gym-equipment-vertical-press-machine-product/', 'press de pecho', 0, TRUE FROM products WHERE slug = 'press-de-pecho'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb24-new-strength-pin-load-selection-gym-equipment-glute-isolator-product/', 'maquina de gluteos', 0, TRUE FROM products WHERE slug = 'maquina-de-gluteos'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb25-gym-commercial-fitness-dual-function-abductoradductor-gym-equipment-product/', 'maquina de aductores y abductores', 0, TRUE FROM products WHERE slug = 'maquina-de-aductores-y-abductores'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb29-commercial-fitness-strength-exercise-equipment-split-high-pull-trainer-product/', 'maquina dorsalera individual', 0, TRUE FROM products WHERE slug = 'maquina-dorsalera-individual'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb33-seated-low-row-trainer-exercise-strength-gym-workout-fitness-equipment-long-pull-product/', 'maquina remo', 0, TRUE FROM products WHERE slug = 'maquina-remo'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb34-professional-fitness-exercise-workout-equipment-strength-gym-double-pull-back-trainer-product/', 'maquina remo con apoyo', 0, TRUE FROM products WHERE slug = 'maquina-remo-con-apoyo'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.alibaba.com/product-detail/fitness-sport-commercial-gym-equipment-fitness_1600740798509.html', 'maquina dorsalera & remo', 0, TRUE FROM products WHERE slug = 'maquina-dorsalera-remo'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-f17-new-pin-loaded-strength-gym-equipment-fts-glide-product/', 'polea doble en v', 0, TRUE FROM products WHERE slug = 'polea-doble-en-v'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-f16-new-pin-loaded-strength-gym-equipment-adjustable-crossover-product/', 'polea doble enfrentada', 0, TRUE FROM products WHERE slug = 'polea-doble-enfrentada'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff94-standing-lateral-raise-rear-delt-machine-commercial-fitness-equipment-luxurious-popular-strength-training-machine-product/', 'Vuelos laterales a polea', 0, TRUE FROM products WHERE slug = 'vuelos-laterales-a-polea'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb30-pin-loaded-exercise-45-degree-biceps-trainer-machine-fitness-strength-training-gym-workout-equipment-camber-curl-product/', 'bicep a polea', 0, TRUE FROM products WHERE slug = 'bicep-a-polea'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-fb19-popular-pin-load-selection-gym-equipment-abdominal-machine-product/', 'abdominales en polea', 0, TRUE FROM products WHERE slug = 'abdominales-en-polea'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.alibaba.com/product-detail/MND-FF87-Seated-Leg-Curl-Extension_1601809534787.html?spm=a2700.image-text-search.normal_offer.d_image.7a6067afmlvXcf&priceId=2c84c9bcfbca4e4790ad137a3f96ee92', 'cuadricep y femorales', 0, TRUE FROM products WHERE slug = 'cuadricep-y-femorales'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-f81-multi-functional-fitness-machine-5-station-product/', '5 multi station', 0, TRUE FROM products WHERE slug = '5-multi-station'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-f83-multi-functional-fitness-machine-8-station-product/', '8 multi station', 0, TRUE FROM products WHERE slug = '8-multi-station'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-c81-fitness-multi-functional-smith-machine-commercial-integrated-machine-fitness-equipment-product/', 'polea multifuncional smith', 0, TRUE FROM products WHERE slug = 'polea-multifuncional-smith'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff36-workout-bench-weight-lifting-bench-for-dumbbell-barbell-press-flat-bench-product/', 'banco plano', 0, TRUE FROM products WHERE slug = 'banco-plano'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff37-commercial-gym-fitness-equipment-weight-lifting-adjustable-decline-bench-product/', 'banco abdominales', 0, TRUE FROM products WHERE slug = 'banco-abdominales'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff38-gym-fitness-equipment-exercise-dumbbell-workout-multi-purpose-adjustable-bench-product/', 'banco 90 grados', 0, TRUE FROM products WHERE slug = 'banco-90-grados'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff39-commercial-gym-fitness-bench-bodybuilding-weight-lifting-multi-adjustable-bench-product/', 'banco multiangular', 0, TRUE FROM products WHERE slug = 'banco-multiangular'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff45-commercial-roman-chair-fitness-equipment-back-extension-for-fitness-bodbuilding-back-extension-product/', 'banco lumbar', 0, TRUE FROM products WHERE slug = 'banco-lumbar'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff42-gym-equipment-fitness-machine-press-and-squat-rack-professional-commercial-weight-lifting-adjustable-incline-bench-product/', 'banco olimpico inclinado', 0, TRUE FROM products WHERE slug = 'banco-olimpico-inclinado'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff43-wholesale-muscle-training-commercial-fitness-power-rack-gym-equipment-seated-flat-bench-product/', 'banco olimpico declinado', 0, TRUE FROM products WHERE slug = 'banco-olimpico-declinado'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff44-commercial-gym-exercise-training-free-weight-bench-for-sale-indoor-bodybuilding-seated-preacher-curl-product/', 'banco scott', 0, TRUE FROM products WHERE slug = 'banco-scott'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff63-smith-machine-product/', 'maquina smith inclinada', 0, TRUE FROM products WHERE slug = 'maquina-smith-inclinada'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-f63-commercial-gym-smith-fitness-machine-plate-loaded-smith-machine-product/', 'maquina smith recta', 0, TRUE FROM products WHERE slug = 'maquina-smith-recta'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff50-squat-rack-product/', 'rack sentadilla', 0, TRUE FROM products WHERE slug = 'rack-sentadilla'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-ff54-weight-plate-tree-product/', 'porta discos', 0, TRUE FROM products WHERE slug = 'porta-discos'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.technogym.com/es-INT/product/pure-strength-chest-press_MG0500-NBGJV0.html', 'pecho a disco', 0, TRUE FROM products WHERE slug = 'pecho-a-disco'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.technogym.com/es-INT/product/pure-strength-low-row_MG2500-NBGJV0.html', 'remo bajo a disco', 0, TRUE FROM products WHERE slug = 'remo-bajo-a-disco'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.technogym.com/es-INT/product/pure-strength-row_MG3000-NBGJV0.html', 'remo bajo inclinado a disco', 0, TRUE FROM products WHERE slug = 'remo-bajo-inclinado-a-disco'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.technogym.com/es-INT/product/pure-strength-shoulder-press_MG3500-NBGJV0.html', 'hombro a discos', 0, TRUE FROM products WHERE slug = 'hombro-a-discos'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.technogym.com/es-INT/product/pure-strength-leg-press_MG5000-NBGJV0.html', 'prensa', 0, TRUE FROM products WHERE slug = 'prensa'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.technogym.com/es-INT/product/pure-strength-linear-leg-press_MG7500-NBGJV0.html', 'prensa 90 grados', 0, TRUE FROM products WHERE slug = 'prensa-90-grados'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.technogym.com/es-INT/product/pure-strength-leg-extension_MG6500-NBGJV0.html', 'cuadricep a disco', 0, TRUE FROM products WHERE slug = 'cuadricep-a-disco'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-an55-plate-loaded-linear-hack-squat-product/', 'sentadilla hack', 0, TRUE FROM products WHERE slug = 'sentadilla-hack'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-pl61-marketing-fitness-equipment-incline-lever-row-import-gym-machine-product/', 'remo a disco. convergente', 0, TRUE FROM products WHERE slug = 'remo-a-disco-convergente'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://ironside.com.ar/products/air-bike-combat-ironside-echo', 'air bike echo', 0, TRUE FROM products WHERE slug = 'air-bike-echo'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-cc14-commercial-gym-fitness-air-bike-for-crossfit-use-product/', 'bike erg', 0, TRUE FROM products WHERE slug = 'bike-erg'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://tienda.gfitness.com.ar/shop/b3200d-bike-erg-4064?category=5#attr=', 'bike erg', 1, FALSE FROM products WHERE slug = 'bike-erg'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-mnd-y600a-commercial-air-runner-aluminium-running-belt-curved-treadmill-for-sale-product/', 'cinta curva', 0, TRUE FROM products WHERE slug = 'cinta-curva'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://tienda.gfitness.com.ar/shop/mnd-800-cinta-curva-sin-resistencia-modelo-mnd-800-1811?category=5#attr=', 'cinta curva', 1, FALSE FROM products WHERE slug = 'cinta-curva'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mercadolibre.com.ar/bicicleta-fija-spinning-nitrec-indoor-negra-volante-20kg-resistencia-mecanica/p/MLA17255843', 'bici fija de spinning', 0, TRUE FROM products WHERE slug = 'bici-fija-de-spinning'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.mndfitnessequip.com/mnd-d16-cardio-exercise-gym-fitness-equipment-magnetic-spinning-bike-product/', 'bici fija de spinning pro', 0, TRUE FROM products WHERE slug = 'bici-fija-de-spinning-pro'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://mirfitness.com.ar/producto/cinta-trotadora-profesional-rt-i-led-g3/', 'cinta de correr movement', 0, TRUE FROM products WHERE slug = 'cinta-de-correr-movement'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://mirfitness.com.ar/producto/eliptico-profesional-lxe-g4/', 'eliptico movement', 0, TRUE FROM products WHERE slug = 'eliptico-movement'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://mirfitness.com.ar/producto/bicicleta-horizontal-profesional-lxr-g4/', 'bicicleta movement', 0, TRUE FROM products WHERE slug = 'bicicleta-movement'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://tienda.gfitness.com.ar/shop/pb34-barra-corta-20-2363#attr=', 'manubrio recto', 0, TRUE FROM products WHERE slug = 'manubrio-recto'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.highperformance.com.ar/productos/estribo-agarre-metalico-macizo-para-polea/', 'estribo individual', 0, TRUE FROM products WHERE slug = 'estribo-individual'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.highperformance.com.ar/productos/soga-para-triceps-polea/', 'soga tricep', 0, TRUE FROM products WHERE slug = 'soga-tricep'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.highperformance.com.ar/productos/agarre-v-de-triceps-polea/', 'manubrio v tricep', 0, TRUE FROM products WHERE slug = 'manubrio-v-tricep'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.highperformance.com.ar/productos/barra-dorsalera-centro-giratorio/', 'barra dorsalera', 0, TRUE FROM products WHERE slug = 'barra-dorsalera'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://tienda.gfitness.com.ar/shop/pb01-barra-remo-2304#attr=', 'barra alternativa polea', 0, TRUE FROM products WHERE slug = 'barra-alternativa-polea'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://www.highperformance.com.ar/productos/agarre-para-polea-triangulo-bombeador/', 'estribo triangular polea', 0, TRUE FROM products WHERE slug = 'estribo-triangular-polea'
ON CONFLICT DO NOTHING;
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT id, 'https://tienda.gfitness.com.ar/shop/w7826c-kit-de-agarres-5-agarres-6939?category=26#attr=', 'kit de agarre dorsalera', 0, TRUE FROM products WHERE slug = 'kit-de-agarre-dorsalera'
ON CONFLICT DO NOTHING;

-- ==========================================
-- Summary
-- ==========================================
SELECT '150 products, 12 categories, 3 lines, 60 images seeded' AS result;
