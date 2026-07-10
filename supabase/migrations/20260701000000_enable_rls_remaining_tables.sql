-- Enable RLS on all remaining tables and add access policies.
-- These tables hold customer/order data and must not be publicly writable.
-- Admin/API operations use the service_role key which bypasses RLS entirely.
-- order_statuses is a read-only catalog — public SELECT is safe.

-- ====== Leads (customer inquiries) ======
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- No public access — managed via /api/projects with service_role

-- ====== Addresses ======
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- No public access — managed via service_role API routes

-- ====== Order Statuses (reference catalog) ======
ALTER TABLE order_statuses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_order_statuses" ON order_statuses;
CREATE POLICY "public_select_order_statuses" ON order_statuses
  FOR SELECT
  TO anon
  USING (true);

-- ====== Orders ======
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- No public direct access — managed via /api/orders with service_role

-- ====== Order Items ======
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- No public direct access — managed via service_role API routes

-- ====== Payments ======
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- No public direct access — managed via service_role API routes

-- ====== Coupons ======
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- No public access — managed via service_role API routes

-- ====== Order Coupons ======
ALTER TABLE order_coupons ENABLE ROW LEVEL SECURITY;

-- No public access — managed via service_role API routes

-- ====== Project Leads ======
ALTER TABLE project_leads ENABLE ROW LEVEL SECURITY;

-- No public access — managed via /api/projects with service_role

-- ====== Admin Users (legacy, unused) ======
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- No public access — not even used, auth.users.app_metadata.role is the source of truth
