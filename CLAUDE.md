# KUCIBOK — Claude Project Instructions

## Projet

Infrastructure digitale de standardisation et de circulation securisee de l'art africain.
2 portails (/africa gratuit, /global payant), Standard Kucibok (certification KCB-XXXXXXXX), logistique transfrontaliere AF Ouest <-> Europe.

## Stack

- **Frontend** : React 18 + Vite 6 + TailwindCSS 4 + React Router 7 + Framer Motion
- **Backend** : Vercel Functions (catch-all unique `api/[...path].js`)
- **Database** : Supabase PostgreSQL (36 tables + RLS + triggers)
- **Auth** : Supabase Auth (email + Google OAuth)
- **Storage** : Supabase Storage (buckets: artworks, profiles, blogs, certificates)
- **Paiements** : PayDunya (AF), Stripe (EU — Phase 2)
- **Emails** : Resend
- **Logistique** : Logidoo API
- **Monitoring** : Sentry React
- **Package manager** : yarn (yarn.lock commite)
- **Deploy** : Vercel

## Structure

```
api/[...path].js          Catch-all Vercel Function (toutes les routes API)
api/_lib/                 Auth, response helpers, Supabase admin client
src/App.jsx               Point d'entree (maintenance, RGPD, providers)
src/routes/Router.jsx     Routing central (~60 routes)
src/api/                  30 hooks API (useArtworks, useAuth, useDelivery...)
src/components/           Composants par domaine (admin, artist, artworks, delivery, ui...)
src/pages/                ~46 pages (dashboards, landings, auth, checkout...)
src/store/                12 Context providers (Auth, Artwork, Artist, Blog, Gallery...)
public/images/            Assets statiques (placeholder-artwork.svg)
src/lib/supabase.js       Client Supabase singleton
src/lib/storage.js        Helpers Supabase Storage
scripts/                  Migration MongoDB -> Supabase (4 scripts)
supabase/migrations/      Schema SQL + RLS policies (001-008)
src/test/                 12 fichiers tests Vitest (299 tests)
docs/                     PRD, TECH-SPEC, ROADMAP, DESIGN, RUNBOOK, MOCTAR
```

## Conventions

- **Pas de console.log** en production. Utiliser Sentry pour les erreurs.
- **Supabase service_role_key** uniquement dans les Vercel Functions (jamais prefixe VITE_).
- **API Key** partagee front/back via header `kcb-api-key`.
- **Auth** : `supabase.auth` cote front, `supabaseAdmin` (service_role) cote Function.
- **Identifiants oeuvres** : format `KCB-XXXXXXXX`, generes par trigger PostgreSQL.
- **Roles** : `buyer` (defaut), `artist`, `curator`, `admin`. Roles prevus Phase 1 : `gallery_africa`, `gallery_global`, `expert`.
- **Routes protegees** : 6 wrappers dans `src/utils/` (Guest, Auth, Artist, Buyer, Curator, Admin).
- **Dashboard buyer** : route `/account` (pas `/dashboard/buyer`). Les nav components gerent ce cas special.
- **Portails** : `/africa` et `/global` sont hors du Layout principal (standalone). Tout le reste est dans `<Layout />`.
- **Encheres** : module masque du nav public, accessible admin uniquement. Code conserve pour reactivation Phase 3.
- **CORS** : restreint a `CORS_ORIGIN` (kucibok.com). Jamais de wildcard.

## Commandes

```bash
yarn dev          # Dev (Vite, port 5173, proxy /api -> VITE_DEV_BACKEND_URL)
yarn build        # Build production (dist/)
yarn preview      # Preview build local
vercel dev        # Dev avec Vercel Functions locales (recommande pour tester l'API)
```

## Variables d'environnement

**Frontend (.env)**
```
VITE_API_URL=/api
VITE_API_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_CLIENT_ID=
VITE_DEV_BACKEND_URL=http://localhost:3000    # dev uniquement
VITE_MAINTENANCE_MODE=false
```

**Vercel Functions (dashboard Vercel)**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
API_KEY=
CORS_ORIGIN=https://kucibok.com
RESEND_API_KEY=
ADMIN_EMAIL=
PAYDUNYA_MASTER_KEY=
PAYDUNYA_PRIVATE_KEY=
PAYDUNYA_TOKEN=
```

## Architecture API

Toutes les routes passent par `api/[...path].js` (catch-all). Routing interne par segments d'URL.

Routes principales :
- `POST/GET /api/auth/*` — Auth Supabase
- `GET/POST/PUT/DELETE /api/artworks/*` — CRUD oeuvres
- `GET /api/artworks/verify/:kid` — Verification publique (sans auth)
- `GET/POST /api/delivery/*` — Logistique
- `GET /api/delivery/track/:tid` — Tracking public
- `GET/POST /api/sourcing/*` — Sourcing B2B
- `POST /api/payments/paydunya-*` — Paiements
- `POST /api/certificates/generate` — PDF certificat
- `POST /api/subscription/fail/:id` — Echec abonnement
- `POST /api/subscription/activate/:id` — Activation abonnement
- `POST /api/transaction/fail/:id` — Echec transaction
- `POST /api/contact` — Formulaire de contact (Resend)
- `POST /api/report-error` — Rapport erreur frontend
- `GET /api/health` — Healthcheck

## Base de donnees

36 tables PostgreSQL. Tables cles :
- `users` (extends auth.users), `artists`, `profiles`, `galleries`
- `artworks` (kucibok_id unique, certification, provenance)
- `delivery_requests`, `delivery_events`, `delivery_artwork_ids`
- `transactions`, `subscriptions`, `plans`
- `sourcing_inquiries`, `documents`

Triggers automatiques :
- `artworks_kucibok_id` : genere KCB-XXXXXXXX a l'insertion
- `on_auth_user_created` : cree l'enregistrement `users` a l'inscription

36 tables. RLS actif sur toutes les tables. Le service_role bypass RLS (utilise par les Functions).

## Dette technique connue

- ~~`dotenv` et `socket.io-client` dans package.json~~ — resolu (deps nettoyees Phase 0)
- ~~`setVisitTime` non importe dans App.jsx~~ — resolu Phase 0
- ~~`pdfkit` dans le package.json frontend~~ — resolu (deplace cote serveur Phase 0)
- ~~Pas de linting configure~~ — resolu (ESLint + Prettier configures Phase 0)
- ~~Pas de tests automatises~~ — resolu (Vitest : 12 fichiers, 299 tests)
- 12 Context providers imbriques : migration React Query prevue Phase 2
- `api/[...path].js` est un fichier volumineux : a decouper en modules Phase 2
- Rate limiting absent : a implementer Phase 1 (Upstash Redis ou Cloudflare)

## Migration en cours

Migration de VPS Hostinger + MongoDB + Cloudinary vers Supabase + Vercel.
M1-M3 terminees. **M4 (bascule production) en attente.**
Voir `docs/RUNBOOK_M4.md` pour la procedure.

## Audits (Mars 2026)

### Audit UX/UI — 80+ corrections (P0-P5)
- P0 : bugs fonctionnels (typos CSS, liens morts, IDs instables)
- P1 : couleurs bannies purgees (violet, orange, gradients) → tokens KCB
- P2 : typographie (font-playfair), border-radius (rounded-[4px]), liens morts
- P3 : accessibilite (ARIA, focus-visible, clavier, contraste)
- P4 : SEO (Helmet sur Africa/Global, og:image, canonicals)
- P5 : polish UX (skeletons, null guards, dead code, animations)

### Audit securite — 10 correctifs appliques
- XSS : DOMPurify client + sanitisation serveur (blog comments)
- IDOR : ownership checks transactions/abonnements
- Escalade role : suppression fallback user_metadata dans requireRole
- Oeuvres non-approuvees : cachees aux non-proprietaires
- GET → POST : endpoints mutation (fail/activate)
- DoS : remplacement listUsers() par requete ciblee
- SQL injection : echappement wildcards ilike
- Mot de passe : validation min 8 caracteres

### Refactor roles — collector→buyer, professional→curator
- Migrations SQL : 007 (donnees) + 008 (fonction RLS)
- Frontend : PortalNav, UserLinks, admin views, profils, CRM
- Backend : VALID_ROLES, requireCurator, email templates, ownership checks
- Voir `docs/MOCTAR.md` pour les actions manuelles restantes

## Documentation

- `docs/PRD.md` — Produit, utilisateurs, modules, KPIs
- `docs/TECH_SPEC.md` — Stack, API, schema, architecture
- `docs/ROADMAP.md` — Phases 0-4, scorecards, dette technique
- `docs/DESIGN_SYSTEM.md` — Design system (noir/ivoire/or, tokens, composants, accessibilite)
- `docs/RUNBOOK_M4.md` — Procedure bascule production
- `docs/MOCTAR.md` — Configuration manuelle restante (migrations, Supabase, Vercel, securite)
