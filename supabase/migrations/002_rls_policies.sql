-- =============================================================================
-- Kucibok — Row Level Security (RLS) policies
-- À exécuter APRÈS 001_initial_schema.sql
-- =============================================================================
-- Convention :
--   SELECT public  = lecture pour tous les utilisateurs authentifiés
--   SELECT own     = lecture de ses propres données uniquement
--   INSERT/UPDATE/DELETE = uniquement sur ses propres données (ou admin)
-- =============================================================================

-- ─── Activer RLS sur toutes les tables ──────────────────────────────────────

ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists                ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_artworks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_artwork_ids   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_inquiries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE numerisation_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents              ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients                ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_lists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns              ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_drafts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_clients            ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections            ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries              ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities               ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics              ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE logidoo_alerts         ENABLE ROW LEVEL SECURITY;

-- ─── Helpers ─────────────────────────────────────────────────────────────────

-- Retourne vrai si l'utilisateur courant a le rôle 'admin'
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Retourne vrai si l'utilisateur courant a le rôle 'professional'
CREATE OR REPLACE FUNCTION is_professional()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('professional', 'admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- =============================================================================
-- USERS
-- =============================================================================

-- Lecture : chaque utilisateur voit son propre enregistrement ; admin voit tout
CREATE POLICY "users: lecture propre ou admin"
  ON users FOR SELECT
  USING (id = auth.uid() OR is_admin());

-- Mise à jour : uniquement son propre enregistrement
CREATE POLICY "users: modification propre"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Insertion : gérée par le trigger handle_new_user (SECURITY DEFINER)
-- Suppression : admin uniquement
CREATE POLICY "users: suppression admin"
  ON users FOR DELETE
  USING (is_admin());

-- =============================================================================
-- ARTISTS
-- =============================================================================

CREATE POLICY "artists: lecture publique"
  ON artists FOR SELECT
  USING (TRUE);

CREATE POLICY "artists: insertion propre"
  ON artists FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "artists: modification propre ou admin"
  ON artists FOR UPDATE
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "artists: suppression admin"
  ON artists FOR DELETE
  USING (is_admin());

-- =============================================================================
-- PROFILES
-- =============================================================================

CREATE POLICY "profiles: lecture propre ou admin"
  ON profiles FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "profiles: insertion propre"
  ON profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles: modification propre ou admin"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid() OR is_admin());

-- =============================================================================
-- ARTWORKS
-- =============================================================================

-- Approuvées = visibles par tous ; pending/rejected = owner + admin
CREATE POLICY "artworks: lecture approuvée publique"
  ON artworks FOR SELECT
  USING (
    status = 'approved'
    OR user_id = auth.uid()
    OR artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "artworks: insertion artiste ou pro"
  ON artworks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "artworks: modification owner ou admin"
  ON artworks FOR UPDATE
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "artworks: suppression admin"
  ON artworks FOR DELETE
  USING (is_admin());

-- =============================================================================
-- LIKED_ARTWORKS
-- =============================================================================

CREATE POLICY "liked_artworks: lecture propre"
  ON liked_artworks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "liked_artworks: insertion propre"
  ON liked_artworks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "liked_artworks: suppression propre"
  ON liked_artworks FOR DELETE
  USING (user_id = auth.uid());

-- =============================================================================
-- TRANSACTIONS
-- =============================================================================

CREATE POLICY "transactions: lecture acheteur ou vendeur ou admin"
  ON transactions FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR is_admin());

CREATE POLICY "transactions: insertion authentifié"
  ON transactions FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- =============================================================================
-- AUCTIONS & BIDS
-- =============================================================================

CREATE POLICY "auctions: lecture publique"
  ON auctions FOR SELECT
  USING (TRUE);

CREATE POLICY "auctions: création pro ou admin"
  ON auctions FOR INSERT
  WITH CHECK (is_professional());

CREATE POLICY "auctions: modification admin"
  ON auctions FOR UPDATE
  USING (is_admin());

CREATE POLICY "bids: lecture publique enchère"
  ON bids FOR SELECT
  USING (TRUE);

CREATE POLICY "bids: enchère authentifié"
  ON bids FOR INSERT
  WITH CHECK (bidder_id = auth.uid());

-- =============================================================================
-- SUBSCRIPTIONS
-- =============================================================================

CREATE POLICY "subscriptions: lecture propre ou admin"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "subscriptions: insertion propre"
  ON subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions: modification admin"
  ON subscriptions FOR UPDATE
  USING (is_admin());

-- =============================================================================
-- PLANS
-- =============================================================================

CREATE POLICY "plans: lecture publique"
  ON plans FOR SELECT
  USING (TRUE);

CREATE POLICY "plans: modification admin"
  ON plans FOR ALL
  USING (is_admin());

-- =============================================================================
-- DELIVERY
-- =============================================================================

CREATE POLICY "delivery: lecture propre ou admin"
  ON delivery_requests FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "delivery: insertion authentifié"
  ON delivery_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "delivery: modification admin"
  ON delivery_requests FOR UPDATE
  USING (is_admin());

CREATE POLICY "delivery_events: lecture propre ou admin"
  ON delivery_events FOR SELECT
  USING (
    delivery_id IN (
      SELECT id FROM delivery_requests WHERE user_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "delivery_events: insertion admin"
  ON delivery_events FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "delivery_artwork_ids: lecture propre ou admin"
  ON delivery_artwork_ids FOR SELECT
  USING (
    delivery_id IN (
      SELECT id FROM delivery_requests WHERE user_id = auth.uid()
    )
    OR is_admin()
  );

-- =============================================================================
-- SOURCING & NUMÉRISATION
-- =============================================================================

CREATE POLICY "sourcing: lecture propre ou admin"
  ON sourcing_inquiries FOR SELECT
  USING (requested_by = auth.uid() OR is_admin());

CREATE POLICY "sourcing: insertion authentifié"
  ON sourcing_inquiries FOR INSERT
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "sourcing: modification admin"
  ON sourcing_inquiries FOR UPDATE
  USING (is_admin());

CREATE POLICY "numerisation: lecture propre ou admin"
  ON numerisation_requests FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "numerisation: insertion propre"
  ON numerisation_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- DOCUMENTS
-- =============================================================================

CREATE POLICY "documents: lecture propre ou admin"
  ON documents FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "documents: insertion admin"
  ON documents FOR INSERT
  WITH CHECK (is_admin());

-- =============================================================================
-- CRM & MARKETING (propre au professionnel)
-- =============================================================================

-- Macro : lecture/écriture sur ses propres données
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'clients', 'contacts', 'contact_lists', 'campaigns',
    'email_templates', 'email_drafts', 'crm_clients'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY "%s: lecture propre" ON %I FOR SELECT USING (user_id = auth.uid() OR is_admin())',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "%s: insertion propre" ON %I FOR INSERT WITH CHECK (user_id = auth.uid())',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "%s: modification propre" ON %I FOR UPDATE USING (user_id = auth.uid() OR is_admin())',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "%s: suppression propre" ON %I FOR DELETE USING (user_id = auth.uid() OR is_admin())',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- =============================================================================
-- BLOG & REVIEWS
-- =============================================================================

CREATE POLICY "blog_posts: lecture publique publiée"
  ON blog_posts FOR SELECT
  USING (published = TRUE OR user_id = auth.uid() OR is_admin());

CREATE POLICY "blog_posts: insertion admin ou pro"
  ON blog_posts FOR INSERT
  WITH CHECK (is_professional());

CREATE POLICY "blog_posts: modification propre ou admin"
  ON blog_posts FOR UPDATE
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "reviews: lecture publique"
  ON reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "reviews: insertion pro"
  ON reviews FOR INSERT
  WITH CHECK (is_professional());

-- =============================================================================
-- COLLECTIONS, GALLERIES, ENTITIES, INTEGRATIONS
-- =============================================================================

CREATE POLICY "collections: lecture propre ou admin"
  ON collections FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "collections: écriture propre"
  ON collections FOR ALL
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "galleries: lecture publique"
  ON galleries FOR SELECT
  USING (TRUE);

CREATE POLICY "galleries: écriture propre ou admin"
  ON galleries FOR ALL
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "entities: écriture propre ou admin"
  ON entities FOR ALL
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "integrations: écriture propre ou admin"
  ON integrations FOR ALL
  USING (user_id = auth.uid() OR is_admin());

-- =============================================================================
-- CATEGORIES
-- =============================================================================

CREATE POLICY "categories: lecture publique"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "categories: modification admin"
  ON categories FOR ALL
  USING (is_admin());

-- =============================================================================
-- SUPPORT, LOGS, ANALYTICS
-- =============================================================================

CREATE POLICY "support_tickets: lecture propre ou admin"
  ON support_tickets FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "support_tickets: insertion authentifié"
  ON support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "support_tickets: modification admin"
  ON support_tickets FOR UPDATE
  USING (is_admin());

CREATE POLICY "logs: lecture admin"
  ON logs FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "logs: insertion authentifié"
  ON logs FOR INSERT
  WITH CHECK (user_id = auth.uid() OR TRUE);  -- service level insert possible

CREATE POLICY "analytics: lecture admin"
  ON analytics FOR SELECT
  USING (is_admin());

CREATE POLICY "analytics: insertion service"
  ON analytics FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "professional_analytics: lecture propre ou admin"
  ON professional_analytics FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- =============================================================================
-- VISITORS & LOGIDOO
-- =============================================================================

CREATE POLICY "visitors: insertion service"
  ON visitors FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "visitors: lecture admin"
  ON visitors FOR SELECT
  USING (is_admin());

CREATE POLICY "logidoo_alerts: lecture admin"
  ON logidoo_alerts FOR SELECT
  USING (is_admin());

CREATE POLICY "logidoo_alerts: insertion service"
  ON logidoo_alerts FOR INSERT
  WITH CHECK (TRUE);
