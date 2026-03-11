-- 004_indexes_and_security.sql
-- Indexes manquants sur FK + correctifs sécurité RLS
-- Sprint 2 : Infra fixes #2, #3, #4, #5

-- ─── Indexes sur FK (performance) ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artworks_user_id ON artworks(user_id);
CREATE INDEX IF NOT EXISTS idx_artworks_owner_id ON artworks(owner_id);
CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_for_sale ON artworks(for_sale) WHERE for_sale = true;
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_artwork_id ON transactions(artwork_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_ref ON transactions(payment_ref);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_user_id ON delivery_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_tracking_id ON delivery_requests(tracking_id);
CREATE INDEX IF NOT EXISTS idx_delivery_events_delivery_id ON delivery_events(delivery_request_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_artwork_id ON sourcing_inquiries(artwork_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_requested_by ON sourcing_inquiries(requested_by);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ─── Contrainte UNIQUE manquante sur documents ───────────────────────────────

ALTER TABLE documents ADD CONSTRAINT uq_documents_artwork_type UNIQUE (artwork_id, type);

-- ─── RLS fixes ────────────────────────────────────────────────────────────────

-- logs : restreindre INSERT à user_id = auth.uid()
DROP POLICY IF EXISTS "logs_insert" ON logs;
CREATE POLICY "logs_insert" ON logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- analytics : requérir authentification pour INSERT
DROP POLICY IF EXISTS "analytics_insert" ON analytics;
CREATE POLICY "analytics_insert" ON analytics FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
