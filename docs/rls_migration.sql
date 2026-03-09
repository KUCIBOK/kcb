-- ============================================================
-- Kucibok — Row Level Security (RLS)
-- À coller dans : Supabase Dashboard → SQL Editor → New query
--
-- Toutes les opérations backend passent par le service role
-- (SUPABASE_SERVICE_ROLE_KEY) qui bypasse RLS automatiquement.
-- Ces politiques protègent contre les accès directs à Supabase
-- avec le token utilisateur (ex : curl, Postman, client-side).
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- FONCTION UTILITAIRE — rôle de l'utilisateur courant
-- Lit le claim user_metadata.role depuis le JWT Supabase.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION kcb_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'role',
    'anonymous'
  )
$$;

-- ============================================================
-- 1. ARTWORKS
-- ============================================================

ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Lecture publique des œuvres approuvées
CREATE POLICY "artworks_read_approved"
ON artworks FOR SELECT
USING (status = 'approved');

-- Lecture de ses propres œuvres (tous statuts)
CREATE POLICY "artworks_read_own"
ON artworks FOR SELECT
USING (auth.uid() = user_id);

-- Admin lit tout
CREATE POLICY "artworks_read_admin"
ON artworks FOR SELECT
USING (kcb_user_role() = 'admin');

-- Insertion : utilisateur connecté (le backend vérifie le rôle artist)
CREATE POLICY "artworks_insert_auth"
ON artworks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Mise à jour : propriétaire ou admin
CREATE POLICY "artworks_update_own_or_admin"
ON artworks FOR UPDATE
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Suppression : admin uniquement
CREATE POLICY "artworks_delete_admin"
ON artworks FOR DELETE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 2. ARTISTS
-- ============================================================

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Lecture publique des profils artistes
CREATE POLICY "artists_read_public"
ON artists FOR SELECT
USING (true);

-- Insertion : utilisateur connecté (le backend vérifie le rôle)
CREATE POLICY "artists_insert_auth"
ON artists FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Mise à jour : propriétaire ou admin
CREATE POLICY "artists_update_own_or_admin"
ON artists FOR UPDATE
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Suppression : admin uniquement
CREATE POLICY "artists_delete_admin"
ON artists FOR DELETE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 3. PROFILES (collector / professional)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Lecture : soi-même ou admin
CREATE POLICY "profiles_read_own_or_admin"
ON profiles FOR SELECT
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Insertion : soi-même
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Mise à jour : soi-même ou admin
CREATE POLICY "profiles_update_own_or_admin"
ON profiles FOR UPDATE
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Suppression : admin uniquement
CREATE POLICY "profiles_delete_admin"
ON profiles FOR DELETE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 4. BLOG_POSTS
-- ============================================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Lecture publique des articles publiés
CREATE POLICY "blog_posts_read_published"
ON blog_posts FOR SELECT
USING (published = true);

-- Lecture de ses propres brouillons
CREATE POLICY "blog_posts_read_own"
ON blog_posts FOR SELECT
USING (auth.uid() = user_id);

-- Admin lit tout
CREATE POLICY "blog_posts_read_admin"
ON blog_posts FOR SELECT
USING (kcb_user_role() = 'admin');

-- Insertion : professional ou admin
CREATE POLICY "blog_posts_insert_pro"
ON blog_posts FOR INSERT
WITH CHECK (kcb_user_role() IN ('professional', 'admin'));

-- Mise à jour : propriétaire ou admin
CREATE POLICY "blog_posts_update_own_or_admin"
ON blog_posts FOR UPDATE
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Suppression : admin uniquement
CREATE POLICY "blog_posts_delete_admin"
ON blog_posts FOR DELETE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 5. CATEGORIES
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "categories_read_public"
ON categories FOR SELECT
USING (true);

-- Écriture : admin uniquement
CREATE POLICY "categories_write_admin"
ON categories FOR INSERT
WITH CHECK (kcb_user_role() = 'admin');

CREATE POLICY "categories_update_admin"
ON categories FOR UPDATE
USING (kcb_user_role() = 'admin');

CREATE POLICY "categories_delete_admin"
ON categories FOR DELETE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 6. PLANS
-- ============================================================

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Lecture publique (plans actifs seulement)
CREATE POLICY "plans_read_public"
ON plans FOR SELECT
USING (is_active = true);

-- Admin peut lire tous les plans (y compris inactifs)
CREATE POLICY "plans_read_admin"
ON plans FOR SELECT
USING (kcb_user_role() = 'admin');

-- Écriture : admin uniquement
CREATE POLICY "plans_insert_admin"
ON plans FOR INSERT
WITH CHECK (kcb_user_role() = 'admin');

CREATE POLICY "plans_update_admin"
ON plans FOR UPDATE
USING (kcb_user_role() = 'admin');

CREATE POLICY "plans_delete_admin"
ON plans FOR DELETE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 7. DELIVERY_REQUESTS
-- ============================================================

ALTER TABLE delivery_requests ENABLE ROW LEVEL SECURITY;

-- Lecture : propriétaire ou admin
CREATE POLICY "delivery_requests_read_own_or_admin"
ON delivery_requests FOR SELECT
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Lecture publique par tracking_id (pour la page de suivi)
-- Note : le backend expose cet endpoint publiquement, mais ici
-- on autorise uniquement si authentifié ou via service role.
-- Le tracking public passe par le service role (backend).

-- Insertion : utilisateur connecté
CREATE POLICY "delivery_requests_insert_auth"
ON delivery_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Mise à jour : admin uniquement (changement de statut)
CREATE POLICY "delivery_requests_update_admin"
ON delivery_requests FOR UPDATE
USING (kcb_user_role() = 'admin');

-- Suppression : admin uniquement
CREATE POLICY "delivery_requests_delete_admin"
ON delivery_requests FOR DELETE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 8. DELIVERY_EVENTS
-- ============================================================

ALTER TABLE delivery_events ENABLE ROW LEVEL SECURITY;

-- Lecture : admin uniquement (les events arrivent via le backend)
CREATE POLICY "delivery_events_read_admin"
ON delivery_events FOR SELECT
USING (kcb_user_role() = 'admin');

-- Insertion : admin (ou service role via backend)
CREATE POLICY "delivery_events_insert_admin"
ON delivery_events FOR INSERT
WITH CHECK (kcb_user_role() = 'admin');

-- ============================================================
-- 9. DELIVERY_ARTWORK_IDS
-- ============================================================

ALTER TABLE delivery_artwork_ids ENABLE ROW LEVEL SECURITY;

-- Lecture : admin
CREATE POLICY "delivery_artwork_ids_read_admin"
ON delivery_artwork_ids FOR SELECT
USING (kcb_user_role() = 'admin');

-- Insertion : service role uniquement (backend)
-- La politique INSERT n'est pas nécessaire si seul le service role écrit.
-- On l'ajoute pour cohérence :
CREATE POLICY "delivery_artwork_ids_insert_admin"
ON delivery_artwork_ids FOR INSERT
WITH CHECK (kcb_user_role() = 'admin');

-- ============================================================
-- 10. TRANSACTIONS
-- ============================================================

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Lecture : acheteur, vendeur, ou admin
CREATE POLICY "transactions_read_parties_or_admin"
ON transactions FOR SELECT
USING (
  auth.uid() = buyer_id
  OR auth.uid() = seller_id
  OR kcb_user_role() = 'admin'
);

-- Insertion : service role uniquement (webhook PayDunya via backend)
-- Pas de politique INSERT explicite — seul le service role peut insérer.

-- Mise à jour : admin
CREATE POLICY "transactions_update_admin"
ON transactions FOR UPDATE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 11. SUBSCRIPTIONS
-- ============================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Lecture : soi-même ou admin
CREATE POLICY "subscriptions_read_own_or_admin"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Insertion : service role uniquement (webhook PayDunya via backend)
-- Pas de politique INSERT explicite.

-- Mise à jour : admin
CREATE POLICY "subscriptions_update_admin"
ON subscriptions FOR UPDATE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 12. SOURCING_INQUIRIES
-- ============================================================

ALTER TABLE sourcing_inquiries ENABLE ROW LEVEL SECURITY;

-- Lecture : demandeur ou admin
CREATE POLICY "sourcing_inquiries_read_own_or_admin"
ON sourcing_inquiries FOR SELECT
USING (auth.uid() = requested_by OR kcb_user_role() = 'admin');

-- Insertion : utilisateur connecté
CREATE POLICY "sourcing_inquiries_insert_auth"
ON sourcing_inquiries FOR INSERT
WITH CHECK (auth.uid() = requested_by);

-- Mise à jour du statut : admin uniquement
CREATE POLICY "sourcing_inquiries_update_admin"
ON sourcing_inquiries FOR UPDATE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- 13. CAMPAIGNS
-- ============================================================

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Lecture : propriétaire ou admin
CREATE POLICY "campaigns_read_own_or_admin"
ON campaigns FOR SELECT
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Insertion : professional ou admin
CREATE POLICY "campaigns_insert_pro"
ON campaigns FOR INSERT
WITH CHECK (kcb_user_role() IN ('professional', 'admin'));

-- Mise à jour : propriétaire ou admin
CREATE POLICY "campaigns_update_own_or_admin"
ON campaigns FOR UPDATE
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Suppression : propriétaire ou admin
CREATE POLICY "campaigns_delete_own_or_admin"
ON campaigns FOR DELETE
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- ============================================================
-- 14. CONTACTS
-- ============================================================

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Toutes opérations : soi-même uniquement
CREATE POLICY "contacts_all_own"
ON contacts FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 15. LOGS
-- ============================================================

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Lecture : admin uniquement
CREATE POLICY "logs_read_admin"
ON logs FOR SELECT
USING (kcb_user_role() = 'admin');

-- Insertion : utilisateur connecté (logge sa propre activité)
CREATE POLICY "logs_insert_auth"
ON logs FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- ============================================================
-- 16. DOCUMENTS (certificats PDF)
-- ============================================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Lecture : propriétaire ou admin
CREATE POLICY "documents_read_own_or_admin"
ON documents FOR SELECT
USING (auth.uid() = user_id OR kcb_user_role() = 'admin');

-- Insertion : utilisateur connecté (le backend vérifie l'ownership)
CREATE POLICY "documents_insert_auth"
ON documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Mise à jour : admin uniquement
CREATE POLICY "documents_update_admin"
ON documents FOR UPDATE
USING (kcb_user_role() = 'admin');

-- ============================================================
-- VÉRIFICATION FINALE
-- Affiche les tables avec RLS activé et le nombre de policies
-- ============================================================

SELECT
  schemaname,
  tablename,
  rowsecurity                                           AS rls_enabled,
  (
    SELECT COUNT(*)
    FROM pg_policies p
    WHERE p.schemaname = t.schemaname
      AND p.tablename  = t.tablename
  )                                                     AS policy_count
FROM pg_tables t
WHERE schemaname = 'public'
  AND tablename IN (
    'artworks', 'artists', 'profiles', 'blog_posts',
    'categories', 'plans',
    'delivery_requests', 'delivery_events', 'delivery_artwork_ids',
    'transactions', 'subscriptions',
    'sourcing_inquiries', 'campaigns', 'contacts',
    'logs', 'documents'
  )
ORDER BY tablename;
