-- Enable RLS on project_consultations.
-- Access is managed via service_role API routes (admin-auth middleware).
-- This follows the same pattern as orders, order_items, and leads.

ALTER TABLE project_consultations ENABLE ROW LEVEL SECURITY;
