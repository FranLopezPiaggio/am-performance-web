-- Migration: Create Supabase Storage bucket for product images
-- Creates the 'product-images' bucket and makes it publicly readable.
-- Writes go through API routes using service_role key, so no object-level
-- RLS policies are needed (service_role bypasses RLS).

-- Create the bucket (idempotent via ON CONFLICT)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,                                                    -- public reads
    5242880,                                                 -- 5MB in bytes
    '{image/webp,image/jpeg,image/png,image/avif}'::text[]   -- allowed MIME types
)
ON CONFLICT (id) DO NOTHING;

-- Note: Since writes are performed server-side via service_role key,
-- no additional RLS policies on storage.objects are required.
-- The bucket's `public = true` setting allows unauthenticated reads.
