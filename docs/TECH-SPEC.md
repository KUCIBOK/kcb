# KUCIBOK — Technical Specification

**Version** 2.0 — Mars 2026
**Aligne sur** PRD V2.1
**Statut** Post-migration M1-M3 — M4 (bascule production) en attente

---

## 1. STACK

### Frontend

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| Framework | React | 18.3 | Ecosysteme mature, equipe formee |
| Bundler | Vite | 6.3 | Build rapide, HMR, proxy dev integre |
| Routing | React Router | 7.4 | Routing declaratif, lazy loading natif |
| Styling | TailwindCSS | 4.0 | Utility-first, purge automatique, design system coherent |
| Animations | Framer Motion | 12.x | Transitions fluides, staggered reveals |
| State | 12 Context providers | — | Fonctionnel, migration React Query prevue Phase 2 |
| Charts | Chart.js + react-chartjs-2 | 4.4 | Dashboards analytics |
| Editeur | React Quill | 2.0 | Blog posts (WYSIWYG) |
| Icons | Lucide React | 0.484 | Icones vectorielles coherentes |
| Typography | DM Sans + Playfair Display + JetBrains Mono | — | Body/Display/Mono — preview valide Mars 2026 |
| Monitoring | Sentry React | 10.7 | Error tracking production |
| Deploy | Vercel | — | Build automatique, meme domaine que les Functions |

### Backend (Vercel Functions + Supabase)

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| Runtime | Vercel Functions (Node.js) | Serverless, cout zero idle, scaling automatique |
| Architecture | Catch-all unique (`api/[...path].js`) | 1 fonction = contourne la limite 12 fonctions du plan Hobby |
| Base de donnees | Supabase PostgreSQL | ACID, RLS natif, triggers, 34 tables |
| Auth | Supabase Auth | Email + Google OAuth, sessions gerees, JWT automatique |
| Storage | Supabase Storage | Buckets : artworks, profiles, blogs, certificates |
| Emails | Resend SDK | Transactionnel + campagnes |
| Paiements AF | PayDunya | Mobile money + cartes AF |
| Paiements EU | Stripe (Phase 2) | Abonnements portail Global |
| Logistique | Logidoo API | Tracking, expeditions transcontinentales |
| Certificats | PDFKit + QRCode | Generation PDF cote serveur |

### Infrastructure

```
FRONTEND               API                    DATABASE & STORAGE
────────               ───                    ──────────────────
Vercel                 Vercel Functions        Supabase
(React/Vite build)     (api/[...path].js)      ├── PostgreSQL (34 tables + RLS)
kucibok.com            kucibok.com/api/*       ├── Auth (email + Google OAuth)
                                               └── Storage (4 buckets)

SERVICES EXTERNES
─────────────────
PayDunya       Resend        Logidoo       Sentry
(paiements AF) (emails)      (logistique)  (monitoring)
```

---

## 2. ARCHITECTURE API

### Catch-all Vercel Function

Toutes les requetes `/api/*` sont routees par une seule fonction (`api/[...path].js`). Le routing interne se fait par segments d'URL.

### Routes disponibles

**Auth**
```
POST /api/auth/signup              Inscription (email + metadata)
POST /api/auth/signin              Connexion email/password
POST /api/auth/signout             Deconnexion
GET  /api/auth/me                  Utilisateur courant (session Supabase)
POST /api/auth/forgot-password     Demande reset password
POST /api/auth/reset-password      Reset password avec token
POST /api/auth/change-password     Changement password (authentifie)
POST /api/auth/google-callback     Callback OAuth Google
```

**Artworks (Standard Kucibok)**
```
GET    /api/artworks               Liste (filtrable : status, category, for_sale)
POST   /api/artworks               Creation (genere kucibok_id via trigger)
GET    /api/artworks/:id           Detail
PUT    /api/artworks/:id           Mise a jour complete
PATCH  /api/artworks/:id           Mise a jour partielle
DELETE /api/artworks/:id           Suppression
GET    /api/artworks/verify/:kid   Verification publique (sans auth)
```

**Artists & Profiles**
```
GET  /api/artist                   Liste artistes
POST /api/artist                   Creation profil artiste
GET  /api/artist/:id               Detail artiste
PUT  /api/artist/:id               Mise a jour artiste
GET  /api/profile/:id              Profil utilisateur
PUT  /api/profile/:id              Mise a jour profil
```

**Logistique (F2)**
```
GET  /api/delivery                 Liste demandes
POST /api/delivery                 Creer demande expedition
GET  /api/delivery/track/:tid      Tracking public (sans auth)
```

**Sourcing (F3)**
```
GET  /api/sourcing                 Liste demandes sourcing
POST /api/sourcing                 Creer demande sourcing
```

**Paiements**
```
POST /api/payments/paydunya-init       Initier paiement PayDunya
POST /api/payments/paydunya-callback   Webhook PayDunya
```

**Autres**
```
GET  /api/health                   Healthcheck (statut Supabase)
POST /api/report-error             Rapport erreur frontend
GET  /api/blog                     Articles blog
POST /api/blog                     Creer article
GET  /api/categories               Categories oeuvres
GET  /api/plans                    Plans abonnement
GET  /api/subscription             Abonnements utilisateur
POST /api/subscription             Souscrire a un plan
GET  /api/log                      Logs activite
POST /api/log                      Creer log
POST /api/campaigns/send           Envoyer campagne email
POST /api/certificates/generate    Generer certificat PDF
```

### Securite API

| Mesure | Implementation |
|--------|----------------|
| CORS | Origin restreint a `CORS_ORIGIN` (kucibok.com) |
| API Key | Header `kcb-api-key` valide contre `API_KEY` env var |
| Auth | Token Supabase JWT dans header `Authorization: Bearer` |
| RLS | Row Level Security PostgreSQL — chaque table a ses policies |
| Validation | Verification des inputs cote serveur avant chaque operation |

---

## 3. MODELE DE DONNEES

### Schema PostgreSQL — 34 tables

```
TABLES INDEPENDANTES          LIEES A USERS              LIEES A ARTWORKS
────────────────────          ─────────────              ────────────────
categories                    users (-> auth.users)       artworks
plans                         artists                     liked_artworks
visitors                      profiles                    transactions
logidoo_alerts                galleries                   auctions
                              entities                    bids
                              integrations                reviews
                              collections                 documents
                              subscriptions               sourcing_inquiries
                              delivery_requests           numerisation_requests
                              clients
                              contacts                    BLOG & SUPPORT
                              contact_lists               ──────────────
                              campaigns                   blog_posts
                              email_templates             support_tickets
                              email_drafts                logs
                              crm_clients                 analytics
                              professional_analytics      delivery_events
                                                          delivery_artwork_ids
```

### Tables cles

**users** — Extension de `auth.users` Supabase
```sql
id                  UUID PK -> auth.users(id)
role                TEXT CHECK (collector | artist | professional | admin)
auth_provider       TEXT (email | google)
profile_completed   BOOLEAN
onboarding_completed BOOLEAN
```

**artworks** — Coeur du Standard Kucibok
```sql
id                  UUID PK
kucibok_id          TEXT UNIQUE (auto-genere : KCB-XXXXXXXX)
user_id             UUID -> users
artist_id           UUID -> artists
owner_id            UUID -> users
title, description, image, medium, condition, provenance
height, width, weight, price, currency
category_id         UUID -> categories
tags                TEXT[]
status              TEXT (pending | approved | rejected)
for_sale, sold, for_bid, auction_status, availability_status
certificate_path    TEXT (URL PDF)
etherscan           TEXT (hash blockchain)
```

**delivery_requests** — Logistique F2
```sql
id                  UUID PK
tracking_id         TEXT UNIQUE
status              TEXT (pending | confirmed | packaging | in_transit | ...)
corridor            TEXT (AF_TO_FR | FR_TO_AF)
origin_country      TEXT
insurance_required  BOOLEAN
museum_wrap, bubble_wrap, crate, fragile_label, humidity_control  BOOLEAN
```

### Triggers automatiques

| Trigger | Table | Action |
|---------|-------|--------|
| `artworks_kucibok_id` | artworks | Genere KCB-XXXXXXXX a l'insertion |
| `artworks_updated_at` | artworks | Met a jour `updated_at` |
| `blog_posts_updated_at` | blog_posts | Met a jour `updated_at` |
| `on_auth_user_created` | auth.users | Cree l'enregistrement `users` correspondant |

### Row Level Security (RLS)

Chaque table a des policies qui restreignent l'acces :
- Les utilisateurs ne voient que leurs propres donnees
- Les admins ont un acces elargi
- Les routes publiques (verify, tracking) passent par le `service_role_key` cote serveur

---

## 4. ROUTING FRONTEND

### Routes publiques (dans Layout)

```
/                           Gateway (split-screen entry → /africa ou /global)
/home                       Index (ancien homepage, backward compat)
/artist                     Landing artiste
/collector                  Landing collectionneur
/professional               Landing professionnel
/about                      A propos
/explore, /explore/:cat     Explorer les oeuvres
/marketplace                Marketplace
/artists                    Liste artistes
/artist/:id                 Detail artiste
/artwork/:id                Detail oeuvre
/blog, /blog/:id            Blog
/services                   Services
/how-it-works               Comment ca marche
/faq                        FAQ
/contact                    Contact
/tracking/:trackingId       Tracking expedition (public)
/collector/pricing           Tarifs collectionneur
/professional/pricing        Tarifs professionnel
```

### Routes standalone (hors Layout)

```
/                           Gateway (split-screen, point d'entree)
/africa                     Portail Afrique (landing)
/africa/features             Fonctionnalites Africa
/africa/pricing              Tarifs Africa
/africa/artists              Artistes Africa
/africa/galleries            Galeries Africa
/global                     Portail International (landing)
/global/services             Services Global
/global/logistics            Logistique Global
/global/enterprise           Enterprise Global
/verify/:kuciobkId          Verification publique (QR)
```

### Routes protegees

```
/dashboard/artist            ArtistProtectedRoute
/dashboard/artist/submit-artwork
/dashboard/collector         CollectorProtectedRoute
/dashboard/professional      ProfessionalProtectedRoute
/dashboard/professional/add-artwork
/dashboard/admin             AdminProtectedRoute
/auction, /auction/:id       AdminProtectedRoute (masque)
/catalogue                   ProfessionalProtectedRoute
```

### Routes auth

```
/sign-in                     GuestProtectedRoute
/sign-up                     GuestProtectedRoute
/forgot-password             GuestProtectedRoute
/reset-password/:token       GuestProtectedRoute
/verify-email/:token         GuestProtectedRoute
/check-email                 GuestProtectedRoute
/auth/callback               OAuth Google callback
/auth/role-selection         AuthProtectedRoute (post-OAuth)
```

### 4.1 Hierarchie composants Landing

```
src/components/landing/
├── RevealOnScroll.jsx          Wrapper Framer Motion (useInView)
├── SectionLabel.jsx            Label mono-font + ligne decorative
├── GeoLine.jsx                 Separateur losanges
├── PillarSection.jsx           Grille 3 colonnes
├── PortalHero.jsx              Hero structure (children slot droit)
├── PortalNav.jsx               Nav sticky adapte par portail
├── PortalFooter.jsx            Footer 4 colonnes adapte
├── PortalLayout.jsx            Wrapper: CSS vars + Nav + Footer + grain
├── Gateway.jsx                 Split-screen entry
├── svg/
│   ├── continentPaths.js       Path data continents
│   ├── CorridorMapSvg.jsx      Carte complete avec routes animees
│   └── GatewayMapSvg.jsx       Version mini (Africa+Europe)
├── africa/
│   ├── HeroKuzi.jsx            Kuzi.gif + particules fumee
│   ├── AfricaServicesSection.jsx
│   ├── AfricaTimelineSection.jsx
│   ├── AfricaTestimonialsSection.jsx
│   └── AfricaCtaSection.jsx
└── global/
    ├── HeroShowcase.jsx        Cadre artwork + stats flottantes
    ├── GlobalCatalogueSection.jsx
    ├── GlobalLogisticsSection.jsx
    ├── GlobalSourcingSection.jsx
    ├── GlobalPricingSection.jsx
    └── GlobalCtaSection.jsx
```

### SVG Maps — Specs

- Continents renders comme `<path>` inline React
- Coordonnees simplifiees (entieres) dans `continentPaths.js`
- Routes corridors: `stroke-dasharray="6 4"` + gradients lineaires
- Points mobiles: `<animateMotion>` SVG natif
- Villes: cercles pulses (`animate attributeName="r"`)
- ViewBox: `-120 -80 700 700` (centree Atlantique)

---

## 5. STATE MANAGEMENT

### Architecture actuelle — 12 Context Providers

```
AuthContextProvider          Authentification Supabase, session, profil
  ArtistContextProvider      CRUD artistes
    ArtworksContextProvider  CRUD oeuvres, filtres, recherche
      BlogContextProvider    Articles blog
        UserProvider         Gestion utilisateurs (admin)
          PlanProvider       Plans abonnement
            CategoryProvider Categories
              CollectionProvider Collections
                DeliveryContextProvider Demandes livraison
                  NumerisationProvider Numerisation
                    ClientProvider CRM clients
                      GalleryContextProvider Galeries
```

### Migration prevue (Phase 2)

Migrer les Context lourds vers **React Query** (@tanstack/react-query) :
- `ArtworksContextProvider` -> `useQuery` + `useMutation`
- `DeliveryContextProvider` -> `useQuery` + `useMutation`
- `ArtistContextProvider` -> `useQuery` + `useMutation`

Garder les Context legers (Auth, Toast) en l'etat.

---

## 6. SECURITE

### Authentification

| Methode | Implementation |
|---------|----------------|
| Email/Password | Supabase Auth (`signUp`, `signInWithPassword`) |
| Google OAuth | Supabase Auth (`signInWithOAuth`) -> `/auth/callback` -> `/auth/role-selection` |
| Sessions | Supabase gere les tokens JWT, refresh automatique |
| Protected routes | 6 wrappers React (Guest, Auth, Artist, Collector, Professional, Admin) |

### Roles

```
collector       Acces basique, achat, collection
artist          Soumission oeuvres, dashboard artiste
professional    Catalogue, CRM, sourcing, dashboard pro
admin           Acces total, gestion utilisateurs, encheres
```

Roles prevus Phase 1 : `gallery_africa`, `curator_global`, `gallery_global`, `expert`

### Mesures en place

- CORS restreint (pas de wildcard)
- API Key partagee front/back (`kcb-api-key`)
- RLS PostgreSQL sur chaque table
- Supabase `service_role_key` uniquement cote serveur (jamais prefixe `VITE_`)
- Consentement RGPD avant tracking visiteur (P1-SEC-016)
- Mode maintenance activable (`VITE_MAINTENANCE_MODE`)

---

## 7. VARIABLES D'ENVIRONNEMENT

### Frontend (prefixe VITE_)

```
VITE_API_URL                 /api (relatif — Vercel route vers les Functions)
VITE_API_KEY                 Cle API partagee avec les Functions
VITE_SUPABASE_URL            URL projet Supabase
VITE_SUPABASE_ANON_KEY       Cle publique anon Supabase
VITE_GOOGLE_CLIENT_ID        OAuth Google
VITE_SOCKET_URL              WebSocket (Phase 3)
VITE_DEV_BACKEND_URL         Proxy Vite en dev uniquement
VITE_MAINTENANCE_MODE        true = page maintenance
```

### Vercel Functions (serveur — jamais exposees au front)

```
SUPABASE_URL                 URL projet Supabase
SUPABASE_SERVICE_ROLE_KEY    Cle privee admin Supabase
API_KEY                      Cle API (doit correspondre a VITE_API_KEY)
CORS_ORIGIN                  https://kucibok.com
RESEND_API_KEY               Envoi emails
ADMIN_EMAIL                  Email admin pour notifications
PAYDUNYA_MASTER_KEY          Paiements PayDunya
PAYDUNYA_PRIVATE_KEY         Paiements PayDunya
PAYDUNYA_TOKEN               Paiements PayDunya
```

---

## 8. STRUCTURE DU PROJET

```
kucibok/
├── api/                        Vercel Functions
│   ├── [...path].js            Catch-all router (toutes les routes API)
│   └── _lib/                   Helpers partages
│       ├── auth.js             Verification auth / API key
│       ├── response.js         Helpers reponse (ok, error, CORS)
│       └── supabase.js         Client Supabase admin
│
├── src/                        Code source React
│   ├── App.jsx                 Point d'entree (maintenance, RGPD, providers)
│   ├── main.jsx                Bootstrap React
│   ├── index.css               Styles globaux + tokens TailwindCSS
│   ├── api/                    30 hooks API (useArtworks, useAuth, useDelivery...)
│   ├── components/             Composants par domaine
│   │   ├── admin/              Dashboard admin (Analytics, Blog, Clients, Support...)
│   │   ├── artist/             Dashboard artiste (Profile, Sales, Notifications...)
│   │   ├── artworks/           CRUD oeuvres (Card, List, Submit steps, Filters...)
│   │   ├── auction/            Encheres (masquees — Phase 3)
│   │   ├── auth/               Formulaires auth (Steps 1-4, ChangePassword)
│   │   ├── collector/          Dashboard collectionneur
│   │   ├── delivery/           Logistique (DeliveryTab, TrackingList, Customs...)
│   │   ├── landing/            Header, Footer, sections landing
│   │   ├── professional/       Dashboard pro (CRM, Sourcing, Multi-entite...)
│   │   ├── ui/                 Design system (Button, Card, Modal, Toast, Tabs...)
│   │   ├── universe/           Composants portails (Hero, Nav, Services, Stats...)
│   │   └── ...                 blog, category, client, decoratives, faq, etc.
│   ├── pages/                  ~46 pages
│   │   ├── africa/             AfricaFeatures, AfricaPricing, AfricaArtists, AfricaGalleries
│   │   ├── global/             GlobalServices, GlobalLogistics, GlobalEnterprise
│   │   ├── auth/               SignIn, SignUp, OAuthCallback, GoogleRoleSelection
│   │   ├── dashboard/          Admin, Artist, Collector, Professional, SubmitArtwork
│   │   └── ...                 Index, Explore, Blog, Contact, Marketplace, etc.
│   ├── store/                  12 Context providers
│   ├── hooks/                  usePayment, useLogistics, useSupportTickets
│   ├── services/               ApiService, PaymentService
│   ├── routes/Router.jsx       Routing central
│   ├── lib/                    supabase.js, storage.js
│   ├── config/                 api.js
│   ├── language/               translation.js (FR/EN)
│   └── utils/                  6 Protected Routes
│
├── scripts/                    Scripts de migration
│   ├── migrate_users_auth.js   MongoDB users -> Supabase Auth
│   ├── migrate_mongodb.js      Collections MongoDB -> tables PostgreSQL
│   ├── migrate_cloudinary.js   Images Cloudinary -> Supabase Storage
│   └── migrate_from_backup.js  Migration depuis backup BSON
│
├── supabase/migrations/        Schema SQL
│   ├── 001_initial_schema.sql  34 tables + triggers + index
│   ├── 002_rls_policies.sql    Row Level Security
│   └── 003_migration_additions.sql  Ajustements post-migration
│
├── docs/                       Documentation
├── public/                     Assets statiques
├── .env.exemple                Template variables frontend
├── .env.migration.exemple      Template variables migration
├── vercel.json                 Configuration Vercel (rewrites SPA)
├── vercel.env.exemple          Template variables Vercel Functions
├── vite.config.js              Config Vite (proxy dev, TailwindCSS)
├── package.json                Dependances
└── yarn.lock                   Lock file
```

---

## 9. DETTE TECHNIQUE IDENTIFIEE

| Item | Risque | Action | Phase |
|------|--------|--------|-------|
| 12 Context providers imbriques | Re-renders cascade, performance | Migrer vers React Query | 2 |
| `socket.io-client` dans package.json | Non utilise (encheres masquees) | Supprimer | 0 |
| `dotenv` dans package.json | Inutile avec Vite (import.meta.env) | Supprimer | 0 |
| `pdfkit` dans package.json frontend | Devrait etre cote serveur uniquement | Deplacer vers Functions | 1 |
| Pas de tests automatises | Regression possible | Ajouter Vitest + Testing Library | 1 |
| Pas de linting configure | Inconsistance code | ESLint + Prettier | 0 |
| `setVisitTime` non importe dans App.jsx | Erreur silencieuse a runtime | Corriger import ou supprimer | 0 |

---

## 10. DECISIONS D'ARCHITECTURE (ADR)

### ADR-001 : Supabase plutot que garder Express/MongoDB

**Contexte** : VPS Hostinger expire le 19 mars 2026. Le backend Express + MongoDB Atlas + Cloudinary coute cher et necessite une maintenance serveur continue.

**Decision** : Migrer vers Supabase (PostgreSQL + Auth + Storage) + Vercel Functions.

**Consequences** :
- Plus de serveur a maintenir (serverless)
- RLS natif remplace les middleware d'auth custom
- Cron jobs perdus (node-cron ne fonctionne pas en serverless) -> a compenser avec Supabase Edge Functions ou services tiers
- Migration de donnees necessaire (scripts/ crees)

### ADR-002 : Catch-all unique plutot que fonctions separees

**Contexte** : Le plan Hobby Vercel limite a 12 fonctions serverless.

**Decision** : Une seule fonction `api/[...path].js` qui route en interne par segments d'URL.

**Consequences** :
- Contourne la limite de 12 fonctions
- Cold start unique (pas 50+ fonctions a demarrer)
- Fichier volumineux (~80K lignes) -> a decouper en modules Phase 1

### ADR-003 : Routes /africa et /global plutot que sous-domaines

**Contexte** : Deux portails (Afrique et International) avec UX distinctes.

**Decision** : Routing par chemin (/africa, /global) plutot que par hostname (africa.kucibok.com).

**Consequences** :
- Dev local simplifie (pas de gestion DNS)
- Un seul deploiement Vercel
- Migration vers sous-domaines possible Phase 3

---

*Kucibok TECH-SPEC V2.0 — Mars 2026 — Confidentiel*
