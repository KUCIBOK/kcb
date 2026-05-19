-- 015_artist_rewards.sql
-- Rewards & Supplies : crédits, parrainages, boutique artiste

-- ── Credits (solde par artiste) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artist_credits (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id   uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance     integer     NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_earned integer    NOT NULL DEFAULT 0,
  total_spent  integer    NOT NULL DEFAULT 0,
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(artist_id)
);

-- ── Transactions de crédits (historique) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS artist_credit_transactions (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id    uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount       integer     NOT NULL,  -- positif = gagné, négatif = dépensé
  type         text        NOT NULL CHECK (type IN ('referral','artwork_sale','bonus','purchase','admin')),
  description  text,
  reference_id uuid,  -- artwork_id, order_id, etc.
  created_at   timestamptz DEFAULT now()
);

-- ── Parrainages ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artist_referrals (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id     uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id     uuid        REFERENCES users(id) ON DELETE SET NULL,
  referral_code   text        NOT NULL UNIQUE,
  status          text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','rewarded')),
  credits_awarded integer     NOT NULL DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  completed_at    timestamptz
);

-- ── Produits boutique (Supplies) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artist_products (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text        NOT NULL,
  description  text,
  credits_cost integer     NOT NULL CHECK (credits_cost > 0),
  category     text        NOT NULL DEFAULT 'supply',
  image_url    text,
  stock        integer     DEFAULT -1,  -- -1 = illimité
  is_active    boolean     DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

-- ── Commandes ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artist_orders (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id      uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id     uuid        NOT NULL REFERENCES artist_products(id),
  credits_spent  integer     NOT NULL,
  status         text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ── Index ─────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_artist_credits_artist     ON artist_credits(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_cred_tx_artist     ON artist_credit_transactions(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_cred_tx_created    ON artist_credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_artist_referrals_referrer ON artist_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_artist_referrals_code     ON artist_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_artist_orders_artist      ON artist_orders(artist_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE artist_credits             ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_referrals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_orders              ENABLE ROW LEVEL SECURITY;

-- artist_credits : lecture propre uniquement
CREATE POLICY "artist_credits_self_read" ON artist_credits
  FOR SELECT USING (artist_id = auth.uid());

-- artist_credit_transactions : lecture propre uniquement
CREATE POLICY "artist_cred_tx_self_read" ON artist_credit_transactions
  FOR SELECT USING (artist_id = auth.uid());

-- artist_referrals : lecture propre
CREATE POLICY "artist_referrals_self_read" ON artist_referrals
  FOR SELECT USING (referrer_id = auth.uid());

-- artist_products : tous les artistes authentifiés peuvent voir
CREATE POLICY "artist_products_auth_read" ON artist_products
  FOR SELECT TO authenticated USING (is_active = true);

-- artist_orders : lecture propre uniquement
CREATE POLICY "artist_orders_self_read" ON artist_orders
  FOR SELECT USING (artist_id = auth.uid());

-- ── Données initiales boutique ────────────────────────────────────────────────
INSERT INTO artist_products (name, description, credits_cost, category) VALUES
  ('Lot de 10 certificats KCB', 'Certificats d''authenticité Kucibok pour vos œuvres',        200, 'certification'),
  ('Mise en avant 7 jours',     'Votre profil mis en avant sur la marketplace Global',         150, 'visibilite'),
  ('Séance photo professionnelle', 'Prise en charge d''une séance photo de vos œuvres',        500, 'service'),
  ('Pack cadre standard',       '5 cadres standards pour présentation d''œuvres (livrés)',     300, 'supply'),
  ('Badge artiste vérifié',     'Badge de vérification premium sur votre profil Kucibok',      100, 'certification')
ON CONFLICT DO NOTHING;
