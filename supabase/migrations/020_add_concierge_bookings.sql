-- ============================================================================
-- Migration 020: Add Concierge Service Bookings System
-- ============================================================================
-- Manages bookings for premium concierge services
-- Tables: concierge_services, concierge_bookings, concierge_slots
-- RLS: User-scoped access + admin management

-- ============================================================================
-- TABLE: concierge_services (Static catalog)
-- ============================================================================
-- Define available services with pricing and details

CREATE TABLE IF NOT EXISTS concierge_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_name VARCHAR(50),
  duration VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  currency VARCHAR(3) DEFAULT 'EUR',
  turnaround_days INT,
  quota_per_month INT,
  deliverables TEXT[] DEFAULT ARRAY[]::TEXT[],
  details JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TABLE: concierge_bookings
-- ============================================================================
-- User bookings for concierge services

CREATE TABLE IF NOT EXISTS concierge_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES concierge_services(id) ON DELETE RESTRICT,

  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),

  requested_start_date DATE NOT NULL,
  requested_end_date DATE,

  notes TEXT,

  -- Payment info
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),

  -- Admin assignment
  assigned_to_admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  admin_notes TEXT,
  completed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TABLE: concierge_slots (Optional: for availability management)
-- ============================================================================
-- Define available time slots for each service

CREATE TABLE IF NOT EXISTS concierge_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES concierge_services(id) ON DELETE CASCADE,

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  capacity INT DEFAULT 1,
  booked INT DEFAULT 0,

  is_available BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TABLE: concierge_history (Audit trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS concierge_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES concierge_bookings(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by_user_id UUID REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_concierge_services_active ON concierge_services(is_active);
CREATE INDEX IF NOT EXISTS idx_concierge_bookings_user_id ON concierge_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_concierge_bookings_status ON concierge_bookings(status);
CREATE INDEX IF NOT EXISTS idx_concierge_bookings_service_id ON concierge_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_concierge_bookings_admin ON concierge_bookings(assigned_to_admin_id);
CREATE INDEX IF NOT EXISTS idx_concierge_slots_service_date ON concierge_slots(service_id, start_date);
CREATE INDEX IF NOT EXISTS idx_concierge_history_booking_id ON concierge_history(booking_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE concierge_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierge_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierge_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierge_history ENABLE ROW LEVEL SECURITY;

-- Services: readable by all, writable by admin only
DROP POLICY IF EXISTS concierge_services_select_policy ON concierge_services;
CREATE POLICY concierge_services_select_policy ON concierge_services
  FOR SELECT USING (true);

DROP POLICY IF EXISTS concierge_services_insert_policy ON concierge_services;
CREATE POLICY concierge_services_insert_policy ON concierge_services
  FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS concierge_services_update_policy ON concierge_services;
CREATE POLICY concierge_services_update_policy ON concierge_services
  FOR UPDATE USING (is_admin());

-- Bookings: users see their own, admins see all
DROP POLICY IF EXISTS concierge_bookings_select_policy ON concierge_bookings;
CREATE POLICY concierge_bookings_select_policy ON concierge_bookings
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS concierge_bookings_insert_policy ON concierge_bookings;
CREATE POLICY concierge_bookings_insert_policy ON concierge_bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS concierge_bookings_update_policy ON concierge_bookings;
CREATE POLICY concierge_bookings_update_policy ON concierge_bookings
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS concierge_bookings_delete_policy ON concierge_bookings;
CREATE POLICY concierge_bookings_delete_policy ON concierge_bookings
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- Slots: readable by all, managed by admin
DROP POLICY IF EXISTS concierge_slots_select_policy ON concierge_slots;
CREATE POLICY concierge_slots_select_policy ON concierge_slots
  FOR SELECT USING (true);

DROP POLICY IF EXISTS concierge_slots_insert_policy ON concierge_slots;
CREATE POLICY concierge_slots_insert_policy ON concierge_slots
  FOR INSERT WITH CHECK (is_admin());

-- History: readable by booking owner or admin
DROP POLICY IF EXISTS concierge_history_select_policy ON concierge_history;
CREATE POLICY concierge_history_select_policy ON concierge_history
  FOR SELECT USING (
    booking_id IN (SELECT id FROM concierge_bookings WHERE user_id = auth.uid())
    OR is_admin()
  );

-- ============================================================================
-- FUNCTION & TRIGGER: auto-update updated_at
-- ============================================================================

DROP TRIGGER IF EXISTS concierge_services_updated_at ON concierge_services;
CREATE TRIGGER concierge_services_updated_at
  BEFORE UPDATE ON concierge_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS concierge_bookings_updated_at ON concierge_bookings;
CREATE TRIGGER concierge_bookings_updated_at
  BEFORE UPDATE ON concierge_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA: Default Concierge Services
-- ============================================================================

INSERT INTO concierge_services (name, description, icon_name, duration, price, turnaround_days, quota_per_month, deliverables, sort_order)
VALUES
  (
    'Virtual Studio Visit',
    'Meet the artist in video, visit their studio',
    'Video',
    '60 min',
    150,
    7,
    NULL,
    ARRAY['HD video call (Zoom/Meet)', 'Guided studio tour', '5-10 artwork presentations', 'Q&A with artist', 'Kucibok visit report'],
    1
  ),
  (
    'Physical Studio Visit',
    'A Kucibok agent represents you on-site',
    'MapPin',
    'Half day',
    400,
    15,
    1,
    ARRAY['Certified Kucibok agent on-site', 'Complete studio visit', '100+ HD photos', '15-minute presentation video', 'Complete report + recommendations', 'Artwork condition assessment'],
    2
  ),
  (
    'Artist Due Diligence',
    'Complete identity and authenticity verification',
    'Shield',
    '3-5 days',
    200,
    5,
    NULL,
    ARRAY['Identity verification (government ID)', 'Portfolio validation (100% artworks)', 'Provenance research', 'Exhibition verification', 'Artist reputation check', 'KCB-DD Report (10+ pages)'],
    3
  ),
  (
    'Logistics Coordination',
    'Complete transport and customs management',
    'Truck',
    'Variable',
    300,
    NULL,
    NULL,
    ARRAY['Logidoo coordination (exclusive provider)', 'Export permit acquisition', 'Customs clearance management', 'Insurance coordination', 'End-to-end delivery tracking', 'Installation coordination'],
    4
  );

-- ============================================================================
-- FUNCTION: calculate_slot_availability
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_slot_availability(slot_id UUID)
RETURNS INT AS $$
  SELECT COALESCE(capacity - booked, 0)
  FROM concierge_slots
  WHERE id = slot_id;
$$ LANGUAGE SQL STABLE;
