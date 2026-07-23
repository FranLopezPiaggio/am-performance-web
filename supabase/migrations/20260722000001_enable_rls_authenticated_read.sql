-- Add SELECT policies for authenticated role (admin users).
-- The admin dashboard uses createBrowserClient() which picks up the auth session,
-- making requests as "authenticated" instead of "anon".
-- Anon already has SELECT policies; authenticated was an oversight.
-- Admin API routes that use service_role (e.g. /api/admin/stats) bypass RLS entirely
-- and are unaffected by this change.

-- ====== Products ======
DROP POLICY IF EXISTS "authenticated_select_products" ON products;
CREATE POLICY "authenticated_select_products" ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- ====== Product Variants ======
DROP POLICY IF EXISTS "authenticated_select_variants" ON product_variants;
CREATE POLICY "authenticated_select_variants" ON product_variants
  FOR SELECT
  TO authenticated
  USING (true);

-- ====== Product Images ======
DROP POLICY IF EXISTS "authenticated_select_images" ON product_images;
CREATE POLICY "authenticated_select_images" ON product_images
  FOR SELECT
  TO authenticated
  USING (true);

-- ====== Categories ======
DROP POLICY IF EXISTS "authenticated_select_categories" ON categories;
CREATE POLICY "authenticated_select_categories" ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- ====== Lines ======
DROP POLICY IF EXISTS "authenticated_select_lines" ON lines;
CREATE POLICY "authenticated_select_lines" ON lines
  FOR SELECT
  TO authenticated
  USING (true);
