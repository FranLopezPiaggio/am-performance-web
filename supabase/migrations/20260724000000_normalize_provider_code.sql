-- Migration: normalize_provider_code
-- Description: Normalize products.provider_code to lowercase without hyphens
-- This enables matching against Cloudinary filenames (e.g., ff01.webp)
--
-- Transformations:
--   'FF-01'  → 'ff01'
--   'MND-SPL01' → 'mndspl01'
--   'FB17'   → 'fb17'
--   'ff01'   → 'ff01' (idempotent)

UPDATE products
SET provider_code = LOWER(REPLACE(provider_code, '-', ''))
WHERE provider_code IS NOT NULL;

-- Verify no hyphens or uppercase remain
-- ponytail: one-off data cleanup, not a recurring constraint.
-- If provider_code becomes user-editable in the future, add a CHECK constraint.
