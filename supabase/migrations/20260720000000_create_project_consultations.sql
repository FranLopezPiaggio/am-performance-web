-- Migration: create_project_consultations
-- Description: Normalize project_leads into leads + project_consultations
-- Date: 2026-07-20

-- ==========================================
-- 1. Create project_consultations table
-- ==========================================

CREATE TABLE project_consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    square_meters INTEGER NOT NULL DEFAULT 0,
    gym_type TEXT NOT NULL, -- commercial, institutional, boutique, hotel, personal, box, studio
    budget_range TEXT, -- low, medium, high, premium
    timeline TEXT, -- immediate, 1-3_months, 3-6_months, flexible
    address TEXT, -- combined address line
    additional_notes TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- new, contacted, quoted, won, lost
    assigned_to UUID, -- FK to admin_users (table may not exist depending on migration order)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_consultations_lead ON project_consultations(lead_id);
CREATE INDEX idx_project_consultations_status ON project_consultations(status);
CREATE INDEX idx_project_consultations_created ON project_consultations(created_at DESC);

-- ==========================================
-- 2. Add unique constraint on leads.email for ON CONFLICT
-- ==========================================

ALTER TABLE leads ADD CONSTRAINT leads_email_key UNIQUE (email);

-- ==========================================
-- 3. Migrate existing data from project_leads
-- ==========================================

WITH migrated_leads AS (
    INSERT INTO leads (email, first_name, last_name, phone, source, notes)
    SELECT DISTINCT
        client_email,
        SPLIT_PART(client_name, ' ', 1),
        SUBSTRING(client_name FROM POSITION(' ' IN client_name) + 1),
        client_phone,
        'web',
        'Migrated from project_leads'
    FROM project_leads
    ON CONFLICT (email) DO UPDATE SET
        phone = EXCLUDED.phone,
        updated_at = NOW()
    RETURNING id, email
)
INSERT INTO project_consultations (lead_id, square_meters, gym_type, budget_range, timeline, address, additional_notes, status, assigned_to, created_at, updated_at)
SELECT
    ml.id,
    pl.square_meters,
    pl.gym_type,
    pl.budget_range,
    pl.timeline,
    pl.client_address,
    pl.additional_notes,
    pl.status,
    pl.assigned_to,
    pl.created_at,
    pl.updated_at
FROM project_leads pl
JOIN migrated_leads ml ON ml.email = pl.client_email;

-- ==========================================
-- 4. Backfill updated_at trigger
-- ==========================================

CREATE OR REPLACE FUNCTION update_project_consultations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_project_consultations_updated_at
    BEFORE UPDATE ON project_consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_project_consultations_updated_at();
