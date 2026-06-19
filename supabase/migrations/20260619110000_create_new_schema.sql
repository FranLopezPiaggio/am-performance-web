-- Migration: create_new_schema
-- Description: Creates all tables for the new e-commerce schema
-- Based on: .agents/knowledge/SCHEMA.md
-- Date: 2026-06-19

-- ==========================================
-- 1. AUTHENTICATION & ADMIN USERS
-- ==========================================

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin', -- admin, super_admin
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_admin_users_email ON admin_users(email);

-- ==========================================
-- 2. PRODUCT CATALOG
-- ==========================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

CREATE TABLE lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lines_slug ON lines(slug);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    line_id UUID REFERENCES lines(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT,
    disciplines TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_line ON products(line_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_disciplines ON products USING GIN(disciplines);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    variant_name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    cost_price NUMERIC(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    weight_kg NUMERIC(6,3),
    length_cm NUMERIC(6,2),
    width_cm NUMERIC(6,2),
    height_cm NUMERIC(6,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE UNIQUE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_active ON product_variants(is_active) WHERE is_active = TRUE;

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_variant ON product_images(variant_id);

-- ==========================================
-- 3. LEADS & ADDRESSES
-- ==========================================

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    source TEXT, -- web, instagram, referral
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    address_type TEXT NOT NULL, -- shipping, billing
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'AR',
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_lead ON addresses(lead_id);

-- ==========================================
-- 4. ORDERS & PAYMENTS
-- ==========================================

CREATE TABLE order_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data for order_statuses
INSERT INTO order_statuses (name, description, color, display_order) VALUES
    ('pending', 'Orden creada, esperando pago', '#FFA500', 1),
    ('paid', 'Pago confirmado', '#008000', 2),
    ('processing', 'Preparando envío', '#0000FF', 3),
    ('shipped', 'Enviado', '#800080', 4),
    ('delivered', 'Entregado', '#008000', 5),
    ('cancelled', 'Cancelada', '#FF0000', 6);

-- Function + trigger for auto-generating order numbers (e.g., ORD-2026-0001)
-- Also sets default status_id to 'pending' if not provided
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION set_order_defaults()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    next_num INTEGER;
BEGIN
    -- Auto-generate order_number if not provided
    IF NEW.order_number IS NULL THEN
        year_prefix := TO_CHAR(NOW(), 'YYYY');
        next_num := NEXTVAL('order_number_seq');
        NEW.order_number := 'ORD-' || year_prefix || '-' || LPAD(next_num::TEXT, 4, '0');
    END IF;

    -- Set default status to 'pending' if not provided
    IF NEW.status_id IS NULL THEN
        SELECT id INTO NEW.status_id FROM order_statuses WHERE name = 'pending';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    status_id UUID NOT NULL REFERENCES order_statuses(id),
    shipping_address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
    billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    shipping_cost NUMERIC(10,2) DEFAULT 0,
    tax_amount NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'ARS',
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_lead ON orders(lead_id);
CREATE INDEX idx_orders_status ON orders(status_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

CREATE TRIGGER trg_orders_set_defaults
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_defaults();

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    snapshot_product_name TEXT NOT NULL,
    snapshot_variant_name TEXT NOT NULL,
    snapshot_sku TEXT NOT NULL,
    snapshot_price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    payment_method TEXT NOT NULL, -- stripe, paypal, transfer, cash
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'ARS',
    status TEXT NOT NULL, -- pending, completed, failed, refunded
    transaction_id TEXT,
    payment_gateway_response JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ==========================================
-- 5. COUPONS & DISCOUNTS
-- ==========================================

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL, -- percentage, fixed
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2),
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active) WHERE is_active = TRUE;

CREATE TABLE order_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE RESTRICT,
    discount_amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_coupons_order ON order_coupons(order_id);

-- ==========================================
-- 6. PROJECT LEADS (Build Your Gym)
-- ==========================================

CREATE TABLE project_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_address TEXT NOT NULL,
    square_meters INTEGER NOT NULL CHECK (square_meters >= 0 AND square_meters <= 1000),
    gym_type TEXT NOT NULL, -- commercial, institutional, boutique, hotel, personal, box, studio
    budget_range TEXT, -- low, medium, high, premium
    timeline TEXT, -- immediate, 1-3_months, 3-6_months, flexible
    additional_notes TEXT,
    status TEXT DEFAULT 'new', -- new, contacted, quoted, won, lost
    assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_leads_status ON project_leads(status);
CREATE INDEX idx_project_leads_created ON project_leads(created_at DESC);
