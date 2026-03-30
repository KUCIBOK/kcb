# Kucibok

Infrastructure digitale de standardisation et de circulation securisee de l'art africain.

Standard Kucibok (certification KCB-XXXXXXXX), logistique transfrontaliere Afrique de l'Ouest <-> Europe, catalogue certifie B2B.

## Setup

### Prerequis

- Node.js 18+
- Yarn (package manager unique — pas de npm)
- Compte Supabase (PostgreSQL + Auth + Storage)
- Compte Vercel (deploy + Functions)

### Installation

```bash
git clone git@github.com:kucibok/kucibok.git
cd kucibok
yarn install
```

### Configuration

```bash
cp .env.exemple .env
```

Remplir les variables dans `.env` :

```
VITE_API_URL=/api
VITE_API_KEY=              # Cle API partagee front/back
VITE_SUPABASE_URL=         # URL projet Supabase
VITE_SUPABASE_ANON_KEY=    # Cle publique anon Supabase
VITE_GOOGLE_CLIENT_ID=     # OAuth Google
VITE_DEV_BACKEND_URL=http://localhost:3000
VITE_MAINTENANCE_MODE=false
```

Les variables serveur (Supabase service_role, Resend, PayDunya) sont configurees dans le dashboard Vercel. Voir `vercel.env.exemple`.

### Lancer en dev

```bash
yarn dev              # Frontend seul (Vite, port 5173)
vercel dev            # Frontend + Vercel Functions locales (recommande)
```

### Build

```bash
yarn build            # Build production -> dist/
yarn preview          # Preview du build local
```

## Structure

```
kucibok/
├── api/                        Vercel Functions (serverless)
│   ├── [...path].js            Catch-all router (toutes les routes API)
│   └── _lib/                   Auth, response helpers, Supabase admin client
│
├── src/
│   ├── App.jsx                 Point d'entree (maintenance, RGPD, providers)
│   ├── routes/Router.jsx       Routing central (~60 routes)
│   ├── api/                    30 hooks API (useArtworks, useAuth, useDelivery...)
│   ├── components/
│   │   ├── admin/              Dashboard admin
│   │   ├── artist/             Dashboard artiste
│   │   ├── artworks/           CRUD oeuvres + submit steps
│   │   ├── collector/          Dashboard collectionneur
│   │   ├── delivery/           Logistique
│   │   ├── landing/            Portails Africa + Global + Gateway
│   │   ├── professional/       Dashboard pro (CRM, sourcing)
│   │   └── ui/                 Design system (Button, Card, Modal, Tabs...)
│   ├── pages/                  ~48 pages
│   ├── store/                  12 Context providers
│   ├── lib/                    supabase.js, storage.js
│   └── utils/                  8 Protected Routes
│
├── supabase/migrations/        Schema SQL + RLS + triggers
├── postman/                    Collection API Postman
├── public/                     Assets statiques
└── docs/                       PRD, TECH_SPEC, DESIGN_SYSTEM, ROADMAP
```

### Architecture

```
FRONTEND               API                    DATABASE & STORAGE
────────               ───                    ──────────────────
Vercel                 Vercel Functions        Supabase
(React 18 + Vite 6)   (api/[...path].js)      ├── PostgreSQL (36 tables + RLS)
kucibok.com            kucibok.com/api/*       ├── Auth (email + Google OAuth)
                                               └── Storage (4 buckets)
```

Deux portails : `/africa` (gratuit, FR) et `/global` (payant, EN).

4 roles : `buyer`, `artist`, `curator`, `admin`.

## Tests

```bash
yarn test             # Vitest + Testing Library (unit/component)
yarn test --watch     # Mode watch

# Tests API (Newman — CLI Postman)
yarn test:api         # Run collection + generate HTML report (reports/)
yarn test:api:ci      # Run collection CLI only (CI/CD)
```

### Postman / Newman

La collection API est dans `postman/`. Pour l'utiliser :

1. **Postman GUI** : Importer `postman/kucibok.postman_collection.json` + `postman/kucibok.postman_environment.json`
2. **Newman CLI** : `yarn test:api` (necessite `vercel dev` en local sur port 3000)

Workflow :
- Configurer `api_key` dans l'environnement Postman
- Lancer `vercel dev` (port 3000)
- Executer le dossier "0. Setup" pour authentifier (sauvegarde `auth_token` automatiquement)
- Executer les autres dossiers

## Deploy

Le deploiement est automatique via Vercel sur chaque push vers `main`.

```bash
git push origin main  # Declenche le build + deploy Vercel
```

Configuration Vercel :
- Build command : `yarn build`
- Output directory : `dist`
- Functions : `api/`
- Variables d'environnement : voir `vercel.env.exemple`

## Documentation

| Document | Contenu |
|----------|---------|
| `docs/PRD.md` | Produit, utilisateurs, modules, KPIs |
| `docs/TECH_SPEC.md` | Stack, architecture, API, modele de donnees |
| `docs/DESIGN_SYSTEM.md` | Design system (palette, typo, composants, accessibilite) |
| `docs/ROADMAP.md` | Phases 0-4, scorecards, dette technique |
| `docs/RUNBOOK_M4.md` | Procedure bascule production |

---

*Kucibok — L'art africain merite un standard mondial.*
