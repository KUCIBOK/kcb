# MIGRATION SUPABASE — Roadmap complète Kucibok

> Document de référence pour la migration complète vers Supabase + Vercel.
> Décision validée : 5 mars 2026
> Urgence : Renouveler le VPS Hostinger avant le 19 mars 2026.

---

## CONTEXTE ET DÉCISION

### Pourquoi cette migration

- VPS Hostinger (KVM 2, 100 GB, Paris) expire le **19 mars 2026**
- MongoDB Atlas = coût mensuel + complexité de gestion
- Cloudinary = coût supplémentaire pour le storage
- Objectif : stack simplifiée, coûts réduits, zéro infrastructure à maintenir

### Architecture actuelle (à supprimer)

```
Vercel (React)  →  VPS Hostinger (Express.js + PM2)  →  MongoDB Atlas
                                                      →  Cloudinary (images)
                                                      →  Redis (JWT blacklist)
```

### Architecture cible

```
Vercel (React + Serverless Functions)  →  Supabase (Auth + Storage + PostgreSQL)
```

**Plus de VPS. Plus d'Atlas. Plus de Cloudinary. Plus de Redis.**

---

## ETAT ACTUEL DU PROJET (5 mars 2026)

### Phases roadmap completees

| Phase | Domaine | Statut |
|---|---|---|
| Phase 0 | Urgences (8 items) | COMPLETE |
| Phase 1 | Securite (10 items) | COMPLETE |
| Phase 2 | Architecture (8 items) | COMPLETE |
| Phase 3 | Performance (6/7 items) | COMPLETE — WebSockets seul manquant |
| Phase 4 | UX/Metier (3 items) | COMPLETE |
| Phase 5 | Tests/Qualite (4 items) | COMPLETE |
| F1 | Standard Kucibok | COMPLETE |
| F2 | Logistique transfrontaliere | COMPLETE |
| F3 | Catalogue certifie B2B | COMPLETE |

### Score actuel : ~7.9/10 (contre 2.1/10 au depart)

### Routes backend actives (34 endpoints)

```
/api/artworks          /api/auth              /api/artist
/api/profile           /api/blog              /api/collection
/api/review            /api/transaction       /api/auction
/api/bid               /api/wallet (SUPPRIME) /api/category
/api/plan              /api/log               /api/visitor
/api/subscription      /api/delivery          /api/logistics
/api/numerisation      /api/clients           /api/galleries
/api/payments          /api/entities          /api/integrations
/api/professional-analytics                   /api/email-marketing
/api/contacts          /api/campaigns         /api/sourcing
/api/crm               /api/analytics         /api/support-tickets
/api/health            /api/report-error
```

---

## CE QUI DISPARAIT

### Backend (a supprimer entierement)

```
Packages supprimes :
- jsonwebtoken          — remplace par Supabase Auth JWT
- bcryptjs / bcrypt     — remplace par Supabase Auth
- ioredis               — Redis supprime (plus de blacklist JWT)
- cloudinary            — remplace par Supabase Storage
- mongoose              — remplace par Supabase JS client (@supabase/supabase-js)
- ethers                — wallet ETH abandonne
- @metamask/sdk         — MetaMask abandonne
- nodemailer            — emails via Supabase Auth + Resend conserve pour campagnes

Fichiers supprimes :
- backend/ entier apres migration complete
- models/Wallet.js
- controllers/wallet.controller.js
- utils/jwtBlacklist.js
- config/redis.js
- middleware/cache.js (Redis)
- config/cloudinaryConfig.js
- middleware/logidooAuth.js (si Logidoo abandonne)
```

### Frontend (a supprimer)

```
Packages supprimes :
- @metamask/sdk
- jwt-decode            — Supabase gere les tokens
- dotenv               — inutile dans Vite (utiliser import.meta.env)
- socket.io-client     — WebSockets non implementes (encheres masquees)
- react-hot-toast      — garder sonner uniquement

Composants a supprimer :
- components/auth/Step3.jsx          — si etape MetaMask
- components/artworks/UpdateEtherscan.jsx — si etherscan abandonne
- pages/auth/SignIn.jsx              — refaire avec Supabase Auth
- pages/auth/SignUp.jsx              — refaire avec Supabase Auth

Stores a nettoyer :
- store/AuthContext.jsx              — refaire avec supabase.auth
- 12 context providers → reduire via Zustand ou React Query (Phase 2 migration)
```

---

## SCHEMA POSTGRESQL — 34 tables Supabase

> Correspondance MongoDB models → tables PostgreSQL

### Table : users (etendu depuis Supabase Auth)

```sql
-- Supabase Auth gere : id, email, password, email_verified, created_at
-- Table publique users etendue :
CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  username    TEXT UNIQUE,
  role        TEXT CHECK (role IN ('collector', 'artist', 'professional', 'admin')) DEFAULT 'collector',
  country     TEXT,
  telephone   TEXT,
  auth_provider TEXT DEFAULT 'email',       -- 'email' | 'google'
  profile_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : artworks

```sql
CREATE TABLE artworks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kucibok_id          TEXT UNIQUE,                          -- KCB-XXXXXXXX
  user_id             UUID REFERENCES users(id),
  artist_id           UUID REFERENCES artists(id),
  owner_id            UUID REFERENCES users(id),
  collection_id       UUID REFERENCES collections(id),
  title               TEXT NOT NULL,
  description         TEXT,
  image               TEXT,                                 -- URL Supabase Storage
  medium              TEXT,
  condition           TEXT CHECK (condition IN ('excellent','very_good','good','fair')),
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
  availability_status TEXT DEFAULT 'available',             -- F3
  status              TEXT DEFAULT 'pending',               -- pending|approved|rejected|sold
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
```

### Table : liked_artworks (relation many-to-many)

```sql
CREATE TABLE liked_artworks (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, artwork_id)
);
```

### Table : artists

```sql
CREATE TABLE artists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  name       TEXT,
  username   TEXT,
  image      TEXT,
  country    TEXT,
  biography  TEXT,
  portfolio  TEXT,
  facebook   TEXT,
  twitter    TEXT,
  instagram  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : profiles

```sql
CREATE TABLE profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id),
  username       TEXT,
  name           TEXT,
  country        TEXT,
  interests      TEXT,
  institution    TEXT,
  qualifications TEXT,
  image          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : blog_posts

```sql
CREATE TABLE blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  title       TEXT NOT NULL,
  content     TEXT,
  image       TEXT,
  category    TEXT,
  tags        TEXT[],
  published   BOOLEAN DEFAULT FALSE,
  views       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : categories

```sql
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  image      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : collections

```sql
CREATE TABLE collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  name        TEXT NOT NULL,
  description TEXT,
  image       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : reviews

```sql
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id      UUID REFERENCES artworks(id),
  professional_id UUID REFERENCES users(id),
  rating          INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : transactions

```sql
CREATE TABLE transactions (
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
```

### Table : auctions

```sql
CREATE TABLE auctions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id        UUID REFERENCES artworks(id),
  seller_id         UUID REFERENCES users(id),
  start_time        TIMESTAMPTZ,
  end_time          TIMESTAMPTZ,
  starting_price    NUMERIC,
  current_price     NUMERIC,
  min_bid_increment NUMERIC DEFAULT 1,
  status            TEXT DEFAULT 'upcoming',  -- upcoming|ongoing|ended|cancelled
  winner_id         UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : bids

```sql
CREATE TABLE bids (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id),
  bidder_id  UUID REFERENCES users(id),
  amount     NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : subscriptions

```sql
CREATE TABLE subscriptions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  plan_id    UUID REFERENCES plans(id),
  status     TEXT DEFAULT 'active',  -- active|expired|cancelled
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date   TIMESTAMPTZ,
  payment_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : plans

```sql
CREATE TABLE plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT,
  price         NUMERIC,
  currency      TEXT DEFAULT 'XOF',
  duration_days INTEGER DEFAULT 30,
  features      TEXT[],
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : delivery_requests

```sql
CREATE TABLE delivery_requests (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID REFERENCES users(id),
  tracking_id             TEXT UNIQUE,
  status                  TEXT DEFAULT 'pending',
  corridor                TEXT DEFAULT 'AF_TO_FR',
  origin_country          TEXT,
  delivery_address        TEXT,
  delivery_date           TIMESTAMPTZ,
  collect_date            TIMESTAMPTZ,
  delivery_time           TEXT,
  recipient_name          TEXT,
  recipient_phone         TEXT,
  special_instructions    TEXT,
  estimated_delivery_time INTEGER,
  delivery_notes          TEXT,
  insurance_required      BOOLEAN DEFAULT FALSE,
  package_size            TEXT,
  package_weight          NUMERIC,
  delivery_priority       TEXT DEFAULT 'standard',
  reason                  TEXT,
  payment_status          TEXT DEFAULT 'pending',
  price                   NUMERIC,
  currency                TEXT DEFAULT 'XOF',
  -- checklist emballage
  museum_wrap             BOOLEAN DEFAULT FALSE,
  bubble_wrap             BOOLEAN DEFAULT FALSE,
  crate                   BOOLEAN DEFAULT FALSE,
  fragile_label           BOOLEAN DEFAULT FALSE,
  humidity_control        BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Artwork IDs lies a une livraison
CREATE TABLE delivery_artwork_ids (
  delivery_id UUID REFERENCES delivery_requests(id) ON DELETE CASCADE,
  artwork_id  UUID REFERENCES artworks(id),
  PRIMARY KEY (delivery_id, artwork_id)
);

-- Evenements/historique de livraison
CREATE TABLE delivery_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID REFERENCES delivery_requests(id) ON DELETE CASCADE,
  status      TEXT,
  note        TEXT DEFAULT '',
  date        TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : sourcing_inquiries (F3)

```sql
CREATE TABLE sourcing_inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id   UUID REFERENCES artworks(id),
  requested_by UUID REFERENCES users(id),
  organization TEXT,
  purpose      TEXT,
  budget       NUMERIC,
  message      TEXT,
  status       TEXT DEFAULT 'pending',  -- pending|reviewed|accepted|rejected
  admin_note   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : numerisation_requests

```sql
CREATE TABLE numerisation_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  artwork_id   UUID REFERENCES artworks(id),
  status       TEXT DEFAULT 'pending',
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : logs

```sql
CREATE TABLE logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  action     TEXT,
  entity     TEXT,
  entity_id  TEXT,
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : visitors

```sql
CREATE TABLE visitors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip         TEXT,
  country    TEXT,
  page       TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : analytics

```sql
CREATE TABLE analytics (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event      TEXT,
  entity     TEXT,
  entity_id  TEXT,
  user_id    UUID REFERENCES users(id),
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : professional_analytics

```sql
CREATE TABLE professional_analytics (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  metadata   JSONB,
  period     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : clients

```sql
CREATE TABLE clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  name       TEXT,
  email      TEXT,
  telephone  TEXT,
  country    TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : galleries

```sql
CREATE TABLE galleries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  name        TEXT,
  description TEXT,
  image       TEXT,
  location    TEXT,
  website     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : entities

```sql
CREATE TABLE entities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  name        TEXT,
  type        TEXT,
  description TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : integrations

```sql
CREATE TABLE integrations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  name       TEXT,
  type       TEXT,
  config     JSONB,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : contacts

```sql
CREATE TABLE contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  name       TEXT,
  email      TEXT,
  telephone  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : contact_lists

```sql
CREATE TABLE contact_lists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  name       TEXT,
  contact_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : campaigns

```sql
CREATE TABLE campaigns (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  name         TEXT,
  subject      TEXT,
  content      TEXT,
  status       TEXT DEFAULT 'draft',
  sent_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : email_templates

```sql
CREATE TABLE email_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  name       TEXT,
  subject    TEXT,
  content    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : email_drafts

```sql
CREATE TABLE email_drafts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  subject    TEXT,
  content    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : crm_clients

```sql
CREATE TABLE crm_clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  name       TEXT,
  email      TEXT,
  status     TEXT,
  notes      TEXT,
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : support_tickets

```sql
CREATE TABLE support_tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  subject     TEXT,
  description TEXT,
  status      TEXT DEFAULT 'open',
  priority    TEXT DEFAULT 'normal',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : documents

```sql
CREATE TABLE documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  artwork_id  UUID REFERENCES artworks(id),
  type        TEXT,              -- 'certificate' | 'invoice' | 'customs'
  url         TEXT,              -- URL Supabase Storage
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : logidoo_alerts

```sql
CREATE TABLE logidoo_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT,
  message     TEXT,
  metadata    JSONB,
  resolved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## VERCEL FUNCTIONS — API serverless

> Chaque route backend Express devient une Vercel Function dans `/api/`

### Structure des fichiers

```
frontend/
  api/
    artworks/
      index.js          — GET /api/artworks, POST /api/artworks
      [id].js           — GET/PUT/DELETE /api/artworks/:id
      catalogue.js      — GET /api/artworks/catalogue (F3)
      verify/[id].js    — GET /api/artworks/verify/:kuciobkId (public)
    auth/
      register.js
      login.js
      logout.js
      refresh-token.js
      forgot-password.js
      reset-password.js
      verify-email.js
    artist/
      index.js
      [id].js
    profile/
      index.js
      [id].js
    blog/
      index.js
      [id].js
    payments/
      paydunya-init.js
      paydunya-callback.js  — webhook PayDunya
    delivery/
      index.js
      [id].js
      track/[id].js         — public tracking
    sourcing/
      index.js
      [id].js
    subscription/
      index.js
      [id].js
    campaigns/
      index.js
      [id].js
      send.js
    ...
    certificates/
      generate.js           — PDF pdfkit (remplace html-pdf-node)
    report-error.js         — alerte email admin
    health.js               — healthcheck
```

### Particularites Vercel Functions

```
Timeout : 10s (free) / 60s (pro) — attention aux operations longues
Stateless : pas de connexion persistante MongoDB/Supabase
Connexion DB : utiliser @supabase/supabase-js (connexion par requete)
PDF : pdfkit (pas html-pdf-node — pas de Chrome sur Vercel)
Cron jobs : Vercel Cron (pro) ou Supabase pg_cron
```

---

## FRONTEND — CHANGEMENTS REQUIS

### 1. Supprimer les packages

```bash
yarn remove @metamask/sdk jwt-decode dotenv socket.io-client react-hot-toast
```

### 2. Ajouter les packages

```bash
yarn add @supabase/supabase-js
```

### 3. Variables d'environnement (frontend/.env)

```env
# Supabase (remplace VITE_API_URL pour l'auth et le storage)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# API Vercel Functions (reste identique)
VITE_API_URL=/api
VITE_API_KEY=kcb-xxx

# Google OAuth (configure dans Supabase dashboard)
VITE_GOOGLE_CLIENT_ID=xxx
```

### 4. Client Supabase a creer

```
frontend/src/lib/supabase.js   — client singleton Supabase
```

### 5. Refonte AuthContext

```
store/AuthContext.jsx :
- Supprimer : fetch /api/auth/login, JWT decode, localStorage token
- Ajouter    : supabase.auth.signIn(), supabase.auth.onAuthStateChange()
- Conserver  : role, user metadata, profile/artist data
```

### 6. Refonte des fichiers API src/api/

```
useAuth.js        — utiliser supabase.auth.*
useArtworks.js    — fetch vers /api/artworks (Vercel Function)
useDelivery.js    — fetch vers /api/delivery (Vercel Function)
useSourcing.js    — fetch vers /api/sourcing (Vercel Function)
[tous les autres] — fetch vers /api/* (Vercel Functions, meme pattern)
```

### 7. Storage images

```
Avant : cloudinary.com/kucibok/...
Apres : xxxx.supabase.co/storage/v1/object/public/artworks/...

Bucket Supabase a creer :
- artworks     (public)
- profiles     (public)
- certificates (private — acces signe)
- blogs        (public)
```

### 8. Composants a modifier

```
components/auth/SignIn.jsx           — supabase.auth.signInWithPassword()
components/auth/SignUp.jsx           — supabase.auth.signUp()
components/auth/GoogleRoleSelection  — supabase.auth.signInWithOAuth({provider:'google'})
pages/ForgotPassword.jsx             — supabase.auth.resetPasswordForEmail()
pages/auth/VerifyEmail.jsx           — supabase.auth.verifyOtp()
middleware/multer.js (backend)       — upload vers Supabase Storage
```

### 9. Reduction des 12 context providers

```
Probleme actuel : 12 providers imbriques = 12 fetch au chargement
Solution phase 2 migration : React Query (@tanstack/react-query)
- Remplace tous les Context Providers par des hooks
- Cache automatique, deduplication des requetes, pagination
- yarn add @tanstack/react-query
```

---

## PLAN DE MIGRATION — 4 PHASES

### PHASE 0 — Immediat (avant 19 mars)

```
[ ] Renouveler VPS Hostinger (1 mois minimum)
[ ] Creer projet Supabase (gratuit)
[ ] Configurer Google OAuth dans Supabase dashboard
[ ] Creer les buckets Storage (artworks, profiles, certificates, blogs)
[ ] Creer frontend/src/lib/supabase.js
```

### PHASE 1 — Dev : Auth + Storage (semaine 1)

```
[ ] Supabase Auth : register / login / Google OAuth / forgot password
[ ] Refaire store/AuthContext.jsx avec supabase.auth
[ ] Refaire useAuth.js avec supabase.auth
[ ] Supabase Storage : upload images depuis multer → supabase.storage
[ ] Tester register/login/upload en dev sans toucher prod
[ ] Supprimer @metamask/sdk, jwt-decode, dotenv, socket.io-client, react-hot-toast
```

### PHASE 2 — Dev : Base de donnees PostgreSQL (semaine 1-2)

```
[ ] Creer les 34 tables dans Supabase (schema ci-dessus)
[ ] Configurer RLS (Row Level Security) sur chaque table
[ ] Script migration : exporter Atlas → importer Supabase
[ ] Tester avec copie des vraies donnees (pas la prod)
[ ] Migrer controllers Mongoose → Supabase JS client
```

### PHASE 3 — Dev : Vercel Functions (semaine 2-3)

```
[ ] Creer frontend/api/ avec toutes les routes
[ ] Remplacer html-pdf-node par pdfkit pour les certificats
[ ] Configurer les cron jobs (Supabase pg_cron ou Vercel Cron)
[ ] Migrer PayDunya webhook → Vercel Function
[ ] Migrer email campaigns (Resend) → Vercel Function
[ ] Tests complets en dev
```

### PHASE 4 — Migration production (semaine 3-4)

```
[ ] Snapshot MongoDB Atlas avant tout (backup obligatoire)
[ ] Exporter les vrais users MongoDB vers Supabase Auth
    (bcrypt supporte par Supabase — zero perte de mot de passe)
[ ] Migrer les donnees production vers Supabase PostgreSQL
[ ] Migrer les images Cloudinary → Supabase Storage (script)
[ ] Basculer DNS + Vercel vers nouvelles Vercel Functions
[ ] Verifier chaque fonctionnalite en prod
[ ] Couper VPS + Atlas + Cloudinary quand stable (minimum 1 semaine de surveillance)
```

---

## MIGRATION USERS — DETAIL

> Zero perte de donnees utilisateurs garantie

### Comment Supabase importe les mots de passe bcrypt

```bash
# Export Atlas users vers JSON
mongoexport --uri "mongodb+srv://..." --collection users --out users.json

# Transformer au format Supabase
# Supabase accepte bcrypt hash directement via admin API

# Import via Supabase Admin API
supabase admin import-users users_supabase.json
```

### Donnees utilisateur a migrer

```
MongoDB User → Supabase Auth (id, email, password_hash, created_at)
MongoDB User → users table (name, username, role, country, telephone, ...)
MongoDB Artist → artists table
MongoDB Profile → profiles table
MongoDB liked_artworks (array) → liked_artworks table
```

---

## FONCTIONNALITES CONSERVEES INTACTES

```
Standard Kucibok (F1)      — kucibok_id, QR code, certificat PDF (pdfkit)
Logistique (F2)            — DeliveryRequest, tracking public, events[]
Catalogue B2B (F3)         — availability_status, SourcingInquiry, CataloguePro
PayDunya                   — paiements Afrique de l'Ouest (Vercel Function)
Emails Resend              — verification, reset, campagnes (Vercel Function)
Cron subscriptions         — Supabase pg_cron ou Vercel Cron
Encheres (masquees)        — code conserve, reactiver Phase 3+
CRM complet                — campaigns, contacts, email marketing
```

---

## RISQUES ET MITIGATION

| Risque | Probabilite | Mitigation |
|---|---|---|
| Perte de users | Faible | Backup Atlas avant migration + bcrypt supporte |
| Timeout Vercel (PDF) | Moyen | Remplacer html-pdf-node par pdfkit |
| Cron jobs (subscriptions) | Moyen | Supabase pg_cron ou Vercel Pro Cron |
| Downtime prod | Moyen | Migration en dehors des heures de pointe, rollback possible |
| Images Cloudinary perdues | Faible | Script migration images avant de couper Cloudinary |

---

## STACK FINALE

```
Frontend React 18    → Vercel (inchange)
API serverless       → Vercel Functions (remplace Express VPS)
Auth                 → Supabase Auth (remplace JWT + bcrypt + Redis)
Storage              → Supabase Storage (remplace Cloudinary)
Base de donnees      → Supabase PostgreSQL (remplace MongoDB Atlas)
Emails               → Resend (inchange, via Vercel Function)
Paiements            → PayDunya (inchange, via Vercel Function)
Monitoring           → Sentry (inchange)
PDF                  → pdfkit (remplace html-pdf-node)
```

### Cout mensuel apres migration

```
Avant : VPS (~10€) + Atlas (~10-25€) + Cloudinary (~0-15€) = ~20-50€/mois
Apres : Supabase Free tier + Vercel Free tier = 0€/mois (jusqu'a scaling)
```

---

*Document cree le 5 mars 2026 — A mettre a jour au fil de la migration*
