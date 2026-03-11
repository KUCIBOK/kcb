-- =============================================================================
-- Kucibok — Schema PostgreSQL initial (Migration M2)
-- À exécuter dans le SQL Editor du dashboard Supabase
-- Ordre strict : dépendances respectées
-- =============================================================================

-- Extension pour UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. TABLES SANS DÉPENDANCES
-- =============================================================================

CREATE TABLE IF NOT EXISTS categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  image      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  price         NUMERIC CHECK (price >= 0),
  currency      TEXT DEFAULT 'XOF',
  duration_days INTEGER DEFAULT 30,
  features      TEXT[],
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visitors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip         TEXT,
  country    TEXT,
  page       TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logidoo_alerts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type       TEXT,
  message    TEXT,
  metadata   JSONB,
  resolved   BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. USERS — étendu depuis Supabase Auth
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                 TEXT,
  username             TEXT UNIQUE,
  role                 TEXT CHECK (role IN ('collector', 'artist', 'professional', 'admin')) DEFAULT 'collector',
  country              TEXT,
  telephone            TEXT,
  auth_provider        TEXT DEFAULT 'email',
  profile_completed    BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_active            BOOLEAN DEFAULT TRUE,
  last_login           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. PROFILS PAR RÔLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS artists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT,
  username   TEXT,
  image      TEXT,
  country    TEXT,
  biography  TEXT,
  portfolio  TEXT,
  facebook   TEXT,
  twitter    TEXT,
  instagram  TEXT,
  artwork_count INTEGER DEFAULT 0,
  visited    INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  username       TEXT,
  name           TEXT,
  country        TEXT,
  interests      TEXT,
  institution    TEXT,
  qualifications TEXT,
  image          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS galleries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT,
  description TEXT,
  image       TEXT,
  location    TEXT,
  website     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT,
  type        TEXT,
  description TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integrations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT,
  type       TEXT,
  config     JSONB,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. COLLECTIONS & ŒUVRES
-- =============================================================================

CREATE TABLE IF NOT EXISTS collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  image       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artworks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kucibok_id          TEXT UNIQUE,
  user_id             UUID REFERENCES users(id),
  artist_id           UUID REFERENCES artists(id),
  owner_id            UUID REFERENCES users(id),
  collection_id       UUID REFERENCES collections(id),
  title               TEXT NOT NULL,
  description         TEXT,
  image               TEXT,
  medium              TEXT,
  condition           TEXT CHECK (condition IN ('excellent', 'very_good', 'good', 'fair')),
  provenance          TEXT,
  height              NUMERIC,
  width               NUMERIC,
  weight              NUMERIC,
  price               NUMERIC CHECK (price >= 0),
  currency            TEXT DEFAULT 'XOF',
  category            TEXT,
  category_id         UUID REFERENCES categories(id),
  tags                TEXT[],
  for_sale            BOOLEAN DEFAULT FALSE,
  sold                BOOLEAN DEFAULT FALSE,
  sold_at             TIMESTAMPTZ,
  sold_price          NUMERIC,
  sold_currency       TEXT DEFAULT 'XOF',
  for_bid             BOOLEAN DEFAULT FALSE,
  auction_status      TEXT DEFAULT 'not_for_auction',
  availability_status TEXT DEFAULT 'available',
  status              TEXT DEFAULT 'pending',
  featured            BOOLEAN DEFAULT FALSE,
  visited             INTEGER DEFAULT 0,
  likes_count         INTEGER DEFAULT 0,
  certificate_path    TEXT,
  etherscan           TEXT,
  edition_number      INTEGER DEFAULT 1,
  edition_total       INTEGER DEFAULT 1,
  delivery_details    TEXT,
  is_delivered        TEXT,
  average_rating      NUMERIC DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Relation many-to-many likes
CREATE TABLE IF NOT EXISTS liked_artworks (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, artwork_id)
);

-- =============================================================================
-- 5. TRANSACTIONS & ENCHÈRES
-- =============================================================================

CREATE TABLE IF NOT EXISTS transactions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id     UUID REFERENCES artworks(id),
  buyer_id       UUID REFERENCES users(id),
  seller_id      UUID REFERENCES users(id),
  amount         NUMERIC,
  currency       TEXT DEFAULT 'XOF',
  status         TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_ref    TEXT UNIQUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auctions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id        UUID REFERENCES artworks(id),
  seller_id         UUID REFERENCES users(id),
  start_time        TIMESTAMPTZ,
  end_time          TIMESTAMPTZ,
  starting_price    NUMERIC,
  current_price     NUMERIC,
  min_bid_increment NUMERIC DEFAULT 1,
  status            TEXT DEFAULT 'upcoming',
  winner_id         UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bids (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id  UUID REFERENCES users(id),
  amount     NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. ABONNEMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id         UUID REFERENCES plans(id),
  status          TEXT DEFAULT 'active',
  start_date      TIMESTAMPTZ DEFAULT NOW(),
  end_date        TIMESTAMPTZ,
  next_payment_date TIMESTAMPTZ,
  amount          NUMERIC,
  currency        TEXT DEFAULT 'XOF',
  payment_ref     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. LOGISTIQUE (F2)
-- =============================================================================

CREATE TABLE IF NOT EXISTS delivery_requests (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES users(id),
  tracking_id          TEXT UNIQUE,
  status               TEXT DEFAULT 'pending',
  corridor             TEXT DEFAULT 'AF_TO_FR',
  origin_country       TEXT,
  delivery_address     TEXT,
  delivery_date        TIMESTAMPTZ,
  collect_date         TIMESTAMPTZ,
  delivery_time        TEXT,
  recipient_name       TEXT,
  recipient_phone      TEXT,
  special_instructions TEXT,
  estimated_delivery_time INTEGER,
  delivery_notes       TEXT,
  insurance_required   BOOLEAN DEFAULT FALSE,
  package_size         TEXT,
  package_weight       NUMERIC,
  delivery_priority    TEXT DEFAULT 'standard',
  reason               TEXT,
  payment_status       TEXT DEFAULT 'pending',
  price                NUMERIC,
  currency             TEXT DEFAULT 'XOF',
  museum_wrap          BOOLEAN DEFAULT FALSE,
  bubble_wrap          BOOLEAN DEFAULT FALSE,
  crate                BOOLEAN DEFAULT FALSE,
  fragile_label        BOOLEAN DEFAULT FALSE,
  humidity_control     BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_artwork_ids (
  delivery_id UUID REFERENCES delivery_requests(id) ON DELETE CASCADE,
  artwork_id  UUID REFERENCES artworks(id) ON DELETE CASCADE,
  PRIMARY KEY (delivery_id, artwork_id)
);

CREATE TABLE IF NOT EXISTS delivery_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID REFERENCES delivery_requests(id) ON DELETE CASCADE,
  status      TEXT,
  note        TEXT DEFAULT '',
  date        TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. SOURCING & NUMÉRISATION (F3)
-- =============================================================================

CREATE TABLE IF NOT EXISTS sourcing_inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id   UUID REFERENCES artworks(id),
  requested_by UUID REFERENCES users(id),
  organization TEXT,
  purpose      TEXT,
  budget       NUMERIC,
  message      TEXT,
  status       TEXT DEFAULT 'pending',
  admin_note   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS numerisation_requests (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  artwork_id UUID REFERENCES artworks(id),
  status     TEXT DEFAULT 'pending',
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 9. DOCUMENTS & CERTIFICATS
-- =============================================================================

CREATE TABLE IF NOT EXISTS documents (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  artwork_id UUID REFERENCES artworks(id),
  type       TEXT,
  url        TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 10. CRM & MARKETING
-- =============================================================================

CREATE TABLE IF NOT EXISTS clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT,
  email      TEXT,
  telephone  TEXT,
  country    TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT,
  email      TEXT,
  telephone  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_lists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT,
  contact_ids UUID[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT,
  subject    TEXT,
  content    TEXT,
  status     TEXT DEFAULT 'draft',
  sent_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT,
  subject    TEXT,
  content    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_drafts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  subject    TEXT,
  content    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT,
  email      TEXT,
  status     TEXT,
  notes      TEXT,
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 11. BLOG & REVIEWS
-- =============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  title      TEXT NOT NULL,
  content    TEXT,
  image      TEXT,
  category   TEXT,
  tags       TEXT[],
  published  BOOLEAN DEFAULT FALSE,
  views      INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id      UUID REFERENCES artworks(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES users(id),
  rating          INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 12. SUPPORT & ANALYTICS
-- =============================================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  subject     TEXT,
  description TEXT,
  status      TEXT DEFAULT 'open',
  priority    TEXT DEFAULT 'normal',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  description TEXT,
  action      TEXT,
  entity      TEXT,
  entity_id   TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event      TEXT,
  entity     TEXT,
  entity_id  TEXT,
  user_id    UUID REFERENCES users(id),
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professional_analytics (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  metadata   JSONB,
  period     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 13. TRIGGERS & FONCTIONS
-- =============================================================================

-- Trigger : met à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artworks_updated_at
  BEFORE UPDATE ON artworks
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Trigger : crée automatiquement un enregistrement users à l'inscription Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, username, role, country, telephone, auth_provider)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NULL,
    COALESCE(NEW.raw_user_meta_data->>'role', 'collector'),
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'telephone',
    CASE WHEN NEW.app_metadata->>'provider' = 'google' THEN 'google' ELSE 'email' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Fonction : génère un kucibok_id unique (KCB-XXXXXXXX)
CREATE OR REPLACE FUNCTION generate_kucibok_id()
RETURNS TRIGGER AS $$
DECLARE
  new_id TEXT;
  attempts INTEGER := 0;
BEGIN
  LOOP
    new_id := 'KCB-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::TEXT) FROM 1 FOR 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM artworks WHERE kucibok_id = new_id);
    attempts := attempts + 1;
    IF attempts > 10 THEN
      RAISE EXCEPTION 'Impossible de générer un kucibok_id unique';
    END IF;
  END LOOP;
  NEW.kucibok_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artworks_kucibok_id
  BEFORE INSERT ON artworks
  FOR EACH ROW
  WHEN (NEW.kucibok_id IS NULL)
  EXECUTE FUNCTION generate_kucibok_id();

-- =============================================================================
-- 14. INDEX PERFORMANTS
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_artworks_status        ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_user_id       ON artworks(user_id);
CREATE INDEX IF NOT EXISTS idx_artworks_artist_id     ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artworks_kucibok_id    ON artworks(kucibok_id);
CREATE INDEX IF NOT EXISTS idx_artworks_for_sale      ON artworks(for_sale) WHERE for_sale = TRUE;
CREATE INDEX IF NOT EXISTS idx_artworks_featured      ON artworks(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_artists_user_id        ON artists(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id       ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_id   ON delivery_requests(tracking_id);
CREATE INDEX IF NOT EXISTS idx_delivery_user_id       ON delivery_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id  ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id  ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id           ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published   ON blog_posts(published) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_auctions_status        ON auctions(status);
