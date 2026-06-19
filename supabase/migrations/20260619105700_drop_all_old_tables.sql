-- Migration: drop_all_old_tables
-- Description: Drops all tables from the old schema to start fresh
-- Date: 2026-06-19

-- Drop tables with FK dependencies first, then parent tables
-- Using CASCADE to handle any remaining FK constraints

DROP TABLE IF EXISTS order_audit_logs CASCADE;
DROP TABLE IF EXISTS processed_webhooks CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop profiles table if it exists (created manually via Supabase Auth trigger)
DROP TABLE IF EXISTS profiles CASCADE;

-- Note: auth.users table is managed by Supabase Auth and cannot be dropped.
-- It will be kept for future admin authentication.
