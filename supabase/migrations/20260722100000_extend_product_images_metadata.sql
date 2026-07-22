-- Migration: extend_product_images_metadata
-- Description: Adds IMS-compliant metadata columns to product_images
-- Based on: .agents/extra/cdn-images/ims-architecture.md
-- Date: 2026-07-22

-- ==========================================
-- 1. ADD METADATA COLUMNS
-- ==========================================
-- All new columns are nullable for backward compat with existing placeholder rows.
-- The seed script and new upload flow will populate them.

ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS public_id        TEXT,
  ADD COLUMN IF NOT EXISTS folder           TEXT,
  ADD COLUMN IF NOT EXISTS original_name    TEXT,
  ADD COLUMN IF NOT EXISTS slugified_name   TEXT,
  ADD COLUMN IF NOT EXISTS format           TEXT,
  ADD COLUMN IF NOT EXISTS width            INT,
  ADD COLUMN IF NOT EXISTS height           INT,
  ADD COLUMN IF NOT EXISTS bytes            BIGINT,
  ADD COLUMN IF NOT EXISTS mime_type        TEXT,
  ADD COLUMN IF NOT EXISTS checksum         TEXT,
  ADD COLUMN IF NOT EXISTS status           TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS marked_deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delete_attempts  INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ==========================================
-- 2. CONSTRAINTS
-- ==========================================

ALTER TABLE product_images
  ADD CONSTRAINT chk_images_status
  CHECK (status IN ('active', 'pending_delete', 'failed'));

-- ==========================================
-- 3. INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_product_images_status
  ON product_images(status)
  WHERE status IN ('pending_delete', 'failed');

CREATE INDEX IF NOT EXISTS idx_product_images_public_id
  ON product_images(public_id);
