// src/types/database.ts
// AMPerformance Database Types
// Generated from .agents/knowledge/SCHEMA.md
// Migration: 20260619110000_create_new_schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ==========================================
// 1. AUTHENTICATION & ADMIN USERS
// ==========================================

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string; // admin, super_admin
  created_at: string;
  updated_at: string;
}

export type AdminUserInsert = Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>;
export type AdminUserUpdate = Partial<AdminUserInsert>;

// ==========================================
// 2. PRODUCT CATALOG
// ==========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;
export type CategoryUpdate = Partial<CategoryInsert>;

export interface Line {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export type LineInsert = Omit<Line, 'id' | 'created_at'>;
export type LineUpdate = Partial<LineInsert>;

export interface Product {
  id: string;
  category_id: string;
  line_id: string | null;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  disciplines: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductInsert>;

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  variant_name: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  stock: number;
  weight_kg: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductVariantInsert = Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>;
export type ProductVariantUpdate = Partial<ProductVariantInsert>;

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id: string | null;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export type ProductImageInsert = Omit<ProductImage, 'id' | 'created_at'>;
export type ProductImageUpdate = Partial<ProductImageInsert>;

// ==========================================
// 3. LEADS & ADDRESSES
// ==========================================

export interface Lead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  source: string | null; // web, instagram, referral
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'>;
export type LeadUpdate = Partial<LeadInsert>;

export interface Address {
  id: string;
  lead_id: string | null;
  address_type: string; // shipping, billing
  first_name: string;
  last_name: string;
  company: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  created_at: string;
}

export type AddressInsert = Omit<Address, 'id' | 'created_at'>;
export type AddressUpdate = Partial<AddressInsert>;

// ==========================================
// 4. ORDERS & PAYMENTS
// ==========================================

export interface OrderStatus {
  id: string;
  name: string; // pending, paid, processing, shipped, delivered, cancelled
  description: string | null;
  color: string | null;
  display_order: number;
  created_at: string;
}

export type OrderStatusInsert = Omit<OrderStatus, 'id' | 'created_at'>;
export type OrderStatusUpdate = Partial<OrderStatusInsert>;

export interface Order {
  id: string;
  order_number: string;
  lead_id: string | null;
  status_id: string;
  shipping_address_id: string;
  billing_address_id: string | null;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderInsert = Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'status_id'> & { status_id?: string };
export type OrderUpdate = Partial<OrderInsert>;

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_id: string;
  snapshot_product_name: string;
  snapshot_variant_name: string;
  snapshot_sku: string;
  snapshot_price: number;
  quantity: number;
  total: number;
  created_at: string;
}

export type OrderItemInsert = Omit<OrderItem, 'id' | 'created_at'>;
export type OrderItemUpdate = Partial<OrderItemInsert>;

export interface Payment {
  id: string;
  order_id: string;
  payment_method: string; // stripe, paypal, transfer, cash
  amount: number;
  currency: string;
  status: string; // pending, completed, failed, refunded
  transaction_id: string | null;
  payment_gateway_response: Json | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export type PaymentInsert = Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
export type PaymentUpdate = Partial<PaymentInsert>;

// ==========================================
// 5. COUPONS & DISCOUNTS
// ==========================================

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: string; // percentage, fixed
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export type CouponInsert = Omit<Coupon, 'id' | 'created_at'>;
export type CouponUpdate = Partial<CouponInsert>;

export interface OrderCoupon {
  id: string;
  order_id: string;
  coupon_id: string;
  discount_amount: number;
  created_at: string;
}

export type OrderCouponInsert = Omit<OrderCoupon, 'id' | 'created_at'>;
export type OrderCouponUpdate = Partial<OrderCouponInsert>;

// ==========================================
// 6. PROJECT LEADS (Build Your Gym)
// ==========================================

export interface ProjectLead {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  square_meters: number;
  gym_type: string; // commercial, institutional, boutique, hotel, personal, box, studio
  budget_range: string | null; // low, medium, high, premium
  timeline: string | null; // immediate, 1-3_months, 3-6_months, flexible
  additional_notes: string | null;
  status: string; // new, contacted, quoted, won, lost
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectLeadInsert = Omit<ProjectLead, 'id' | 'created_at' | 'updated_at'> & { status?: string };
export type ProjectLeadUpdate = Partial<ProjectLeadInsert>;

// ==========================================
// COMPOSITE TYPES
// ==========================================

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  images: ProductImage[];
  category: Category;
  line: Line | null;
}

export interface OrderWithDetails extends Order {
  status: OrderStatus;
  lead: Lead | null;
  shipping_address: Address;
  billing_address: Address | null;
  items: OrderItem[];
  payments: Payment[];
  coupons: OrderCoupon[];
}

// ==========================================
// DATABASE INTERFACE
// ==========================================

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: AdminUser;
        Insert: AdminUserInsert;
        Update: AdminUserUpdate;
      };
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      lines: {
        Row: Line;
        Insert: LineInsert;
        Update: LineUpdate;
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: ProductVariantInsert;
        Update: ProductVariantUpdate;
      };
      product_images: {
        Row: ProductImage;
        Insert: ProductImageInsert;
        Update: ProductImageUpdate;
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
      };
      addresses: {
        Row: Address;
        Insert: AddressInsert;
        Update: AddressUpdate;
      };
      order_statuses: {
        Row: OrderStatus;
        Insert: OrderStatusInsert;
        Update: OrderStatusUpdate;
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      order_items: {
        Row: OrderItem;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
      };
      payments: {
        Row: Payment;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
      };
      coupons: {
        Row: Coupon;
        Insert: CouponInsert;
        Update: CouponUpdate;
      };
      order_coupons: {
        Row: OrderCoupon;
        Insert: OrderCouponInsert;
        Update: OrderCouponUpdate;
      };
      project_leads: {
        Row: ProjectLead;
        Insert: ProjectLeadInsert;
        Update: ProjectLeadUpdate;
      };
    };
  };
}
