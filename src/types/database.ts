// src/types/database.ts
// AMPerformance Database Types
// Generated from .agents/docs/SCHEMA.md

// Json type definition (compatible with Supabase)
export type Json = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: Json | undefined } 
  | Json[];

// ==========================================
// ENUMS
// ==========================================

export type OrderStatus = 
  | 'cart' 
  | 'pending_whatsapp' 
  | 'confirmed_by_admin' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type ProjectStatus = 
  | 'new' 
  | 'contacted' 
  | 'quote_sent' 
  | 'closed' 
  | 'lost';

// ==========================================
// TABLES - ROW TYPES
// ==========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  base_price: number;
  offer_price: number | null;
  is_featured: boolean;
  in_stock: boolean;
  stock_quantity: number;
  variants: Json;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  product_id: string;
  category_id: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_details: Json; // { name, email, phone }
  status: OrderStatus;
  total_amount: number;
  whatsapp_message_url: string | null;
  whatsapp_message_body: string | null;
  admin_notes: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string | null;
  unit_price: number;
  quantity: number;
  variant_info: Json | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  square_meters: number | null;
  gym_style: string | null;
  budget_range: string | null;
  requirements: string | null;
  status: ProjectStatus;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_data: Json | null;
  new_data: Json | null;
  changed_at: string;
}

// ==========================================
// INSERT TYPES (For creating records)
// ==========================================

export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;
export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductCategoryInsert = Omit<ProductCategory, never>; // Both PKs required
export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at' | 'whatsapp_message_url' | 'whatsapp_message_body' | 'expires_at'>;
export type OrderItemInsert = Omit<OrderItem, 'id' | 'created_at'>;
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'status'>; // status defaults to 'new'
export type AuditLogInsert = Omit<AuditLog, 'id' | 'changed_at'>;

// ==========================================
// UPDATE TYPES (For updating records)
// ==========================================

export type CategoryUpdate = Partial<CategoryInsert>;
export type ProductUpdate = Partial<ProductInsert>;
export type OrderUpdate = Partial<OrderInsert>;
export type OrderItemUpdate = Partial<OrderItemInsert>;
export type ProjectUpdate = Partial<ProjectInsert> & { status?: ProjectStatus };

// ==========================================
// DATABASE INTERFACE
// ==========================================

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      product_categories: {
        Row: ProductCategory;
        Insert: ProductCategoryInsert;
        Update: never; // Composite PK, no updates
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
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: AuditLogInsert;
        Update: never; // Audit logs should not be updated
      };
    };
  };
}

// ==========================================
// HELPER TYPES
// ==========================================

// Type for fetching products with their categories
export interface ProductWithCategories extends Product {
  categories: Category[];
}

// Type for order with items
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Type for cart item (frontend use)
export interface CartItem {
  product: Product;
  quantity: number;
  variant_info?: Json;
}

// Customer details JSON structure
export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}
