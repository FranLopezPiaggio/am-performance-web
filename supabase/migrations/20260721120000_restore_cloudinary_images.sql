-- Phase A: Replace external seed URLs with placeholder (/img/download.jpg)
-- The original backup (backups/catalog-product_images.json) had 101 Cloudinary URLs
-- but they referenced product UUIDs from a different DB state (pre-reseed).
-- Current DB has 150 products with different UUIDs.
-- Keeping the 5 real Cloudinary URLs that match current product IDs,
-- replacing 60 external URLs (mndfitnessequip.com, technogym.com, etc.) with placeholder.

UPDATE product_images 
SET image_url = '/img/download.jpg' 
WHERE image_url NOT LIKE 'https://res.cloudinary.com%';
