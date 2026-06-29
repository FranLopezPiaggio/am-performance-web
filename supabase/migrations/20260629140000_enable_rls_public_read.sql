-- Enable RLS on all product-facing tables and add public SELECT policies.
-- The anon (public) role can read but not write anything.
-- Admin operations use the service_role key which bypasses RLS entirely.

-- ====== Products ======
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_products" ON products
  FOR SELECT
  TO anon
  USING (true);

-- ====== Product Variants ======
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_variants" ON product_variants
  FOR SELECT
  TO anon
  USING (true);

-- ====== Product Images ======
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_images" ON product_images
  FOR SELECT
  TO anon
  USING (true);

-- ====== Categories ======
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_categories" ON categories
  FOR SELECT
  TO anon
  USING (true);

-- ====== Lines ======
ALTER TABLE lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_lines" ON lines
  FOR SELECT
  TO anon
  USING (true);
