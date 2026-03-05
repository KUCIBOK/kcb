# CLAUDE.md — Guide de développement Kucibok

> Ce fichier est lu automatiquement par Claude Code à chaque session.
> Il définit le contexte du projet, les règles de développement, et le workflow Git à respecter.

---

## PRÉSENTATION DU PROJET

**Kucibok** est l'infrastructure digitale de standardisation et de circulation sécurisée de l'art africain.

- **URL production :** https://kucibok.com
- **Backend API :** https://backend.kucibok.com (VPS Hostinger — expire le 19 mars 2026)
- **Stack actuelle :** Node.js + Express 5 / MongoDB Atlas / React 18 + Vite / TailwindCSS 4
- **Stack cible (migration mars 2026) :** Vercel Functions + Supabase (Auth + Storage + PostgreSQL)
- **Roadmap migration :** `kucibok/docs/MIGRATION_SUPABASE.md`

### Rôles utilisateurs
- `collector` — achète des œuvres
- `artist` — publie et vend des œuvres
- `professional` — galeriste, critique d'art
- `admin` — gestion complète de la plateforme

### Portails
- `/africa` → `AfricaLanding.jsx` — artistes et galeries africaines (FR prioritaire)
- `/global` → `GlobalPage.jsx` — curateurs et galeries internationales (EN prioritaire)
- `/` → redirect vers `/africa`
- Les enchères (`/auctions`) sont **masquées du nav** — code conservé mais non exposé

### Design System actif
Référence : `DESIGN-SYSTEM.md` à la racine.
- CTA : `indigo-kcb` (#7072c5) / Accents : `purple-kcb` (#b132a7)
- Typo : Poppins (corps) + Playfair Display (titres œuvres)
- Composants UI : `kucibok/src/components/ui/`

---

## ARCHITECTURE

```
kucibok-main/
├── backend/                     # API Node.js / Express (DEPRECATED post-migration Supabase)
│   ├── config/                  # database.js, environnement.js
│   ├── controllers/             # Logique métier (32 controllers)
│   ├── middleware/              # auth.js, multer.js, errorHandler.js, api.js
│   ├── models/                  # Schémas Mongoose (35 modèles)
│   ├── routes/                  # Routes Express (34 endpoints)
│   ├── services/                # Services métier (paydunya, mailer, subscription…)
│   ├── jobs/                    # Cron jobs (auctionCronJob, generateCertificates, subscriptions)
│   └── index.js                 # Point d'entrée — classe App
├── kucibok/                     # Application React / Vite  [dossier renommé depuis frontend/]
│   ├── api/                     # Vercel Functions (post-migration — remplace backend/)
│   ├── docs/                    # Documents stratégiques (PRD_V2, ROADMAP, TECHSPEC, MIGRATION_SUPABASE)
│   ├── src/
│   │   ├── api/                 # Fonctions d'appel API (useAuth.js, useAPI.js…)
│   │   ├── components/          # Composants React (ui/ = design system)
│   │   ├── lib/                 # Clients tiers — supabase.js (à créer Phase 0)
│   │   ├── pages/               # Pages (AfricaLanding, GlobalPage, dashboards…)
│   │   ├── routes/              # Router React
│   │   └── store/               # Contextes React (15 providers)
│   └── index.html
├── DESIGN-SYSTEM.md             # Design system actif (indigo/violet — référence)
├── roadmap.md                   # Audit technique v1.8 + Migration Supabase
└── CLAUDE.md                    # Ce fichier
```

### Patterns clés — Stack actuelle (pré-migration)
- **Auth :** JWT Bearer dans `Authorization` header + API key `kcb-api-key` dans le header
- **Erreurs :** `createError` de `middleware/errorHandler.js` → `next(createError.xxx(...))`
- **Config :** toutes les variables d'env passent par `config/environnement.js` (ne jamais lire `process.env` directement dans les controllers)
- **Emails :** service actif — `mailer.service.js` (Resend SDK). Legacy SMTP supprimé.

### Patterns clés — Stack cible (post-migration Supabase)
- **Auth :** `supabase.auth` — plus de JWT/bcrypt/Redis custom
- **Storage :** `supabase.storage` — plus de Cloudinary
- **Base de données :** `@supabase/supabase-js` — plus de Mongoose
- **API :** Vercel Functions dans `kucibok/api/` — plus de VPS Express
- **Emails :** Resend (conservé, via Vercel Function)

---

## RÈGLES DE SÉCURITÉ — ABSOLUES

> ⚠️ Ces règles ne doivent jamais être violées, même en développement.

1. **Ne jamais commiter de secrets** — les fichiers `.env` sont dans `.gitignore`. Utiliser `.env.exemple` comme template sans valeurs réelles.
2. **Ne jamais hardcoder de credentials** dans le code source (clés API, mots de passe, JWT, tokens).
3. **Ne jamais stocker de clés privées ETH en clair** — chiffrement AES-256-GCM obligatoire.
4. **Ne jamais stocker de données bancaires** (cardNumber, CVC, expiry) en base de données.
5. **Ne jamais logger de mots de passe, tokens ou données sensibles** dans `console.log`.
6. **Toujours valider les entrées utilisateur** côté serveur, jamais seulement côté client.
7. **Toujours vérifier les permissions** avant de modifier des données (`req.user.role`).

---

## WORKFLOW GIT — À RESPECTER IMPÉRATIVEMENT

### Structure des branches

```
main          ← Production stable uniquement
  └── dev     ← Intégration — branche de base pour tout le travail
        ├── fix/phase-0-secrets          ← Phase 0 : urgences
        ├── fix/phase-0-bypass
        ├── fix/phase-1-helmet           ← Phase 1 : sécurité
        ├── fix/phase-1-auth-middleware
        ├── fix/phase-2-pagination       ← Phase 2 : architecture
        ├── fix/phase-3-websockets       ← Phase 3 : performance
        └── ...
```

### Règles de branche

1. **Toujours partir de `dev`** pour créer une nouvelle branche de correctif.
2. **Une branche par item du roadmap** (ou par groupe cohérent dans la même phase).
3. **Ne jamais commiter directement sur `main` ou `dev`** — toujours passer par une branche de travail.
4. **Merger dans `dev` une fois le correctif terminé et testé**.
5. **Merger `dev` → `main` uniquement** quand une phase complète est validée.

### Convention de nommage des branches

```
fix/phase-{N}-{description-courte}
feat/phase-{N}-{description-courte}
refactor/phase-{N}-{description-courte}

Exemples :
  fix/phase-0-secrets-rotation
  fix/phase-0-bypass-endpoints
  fix/phase-1-helmet-headers
  fix/phase-1-privilege-escalation
  fix/phase-2-auth-middleware-refactor
  fix/phase-3-bid-race-condition
  feat/phase-3-websockets-auction
```

### Workflow complet pour chaque correctif

```bash
# 1. Toujours partir de dev à jour
git checkout dev
git pull origin dev

# 2. Créer la branche de travail
git checkout -b fix/phase-X-description

# 3. Implémenter le correctif
# ... édition des fichiers ...

# 4. Commiter avec un message clair
git add <fichiers-spécifiques>
git commit -m "fix(phase-X): [ID] description du correctif"

# 5. Merger dans dev
git checkout dev
git merge --no-ff fix/phase-X-description

# 6. Supprimer la branche de travail (optionnel)
git branch -d fix/phase-X-description

# 7. Merger dev → main quand la phase est complète et validée
git checkout main
git merge --no-ff dev
git tag -a "phase-X-complete" -m "Phase X terminée"
```

### Convention de messages de commit

```
fix(phase-0): [P0-SEC-001] rotation des secrets exposés dans Git
fix(phase-1): [P1-SEC-007] installation et configuration de helmet.js
refactor(phase-2): [P2-ARCH-001] refactorisation du middleware auth en factory
feat(phase-3): [P3-PERF-003] implémentation WebSockets pour les enchères
test(phase-5): [P5-TEST-001] ajout tests intégration auth controller
```

---

## COMMANDES DE DÉVELOPPEMENT

> **Gestionnaire de paquets : `yarn` exclusivement.** Ne jamais utiliser `npm install` pour ajouter des dépendances.

### Backend
```bash
cd backend
cp .env.exemple .env          # Configurer les variables d'env
yarn install
yarn dev                      # Démarre avec nodemon (port 3000)
yarn start                    # Production
yarn test                     # Tests (voir roadmap P5-TEST-001)
```

### Frontend (React)
```bash
cd kucibok
cp .env.exemple .env          # Configurer les variables d'env
yarn install
yarn dev                      # Vite dev server (port 5173)
yarn build                    # Build production
```

### Variables d'environnement requises (backend — pré-migration)
Voir `backend/.env.exemple` pour la liste complète. Variables critiques :
- `MONGODB_URI` — URI MongoDB Atlas
- `JWT_SECRET` — Secret JWT (min. 64 caractères aléatoires)
- `CORS_ORIGIN` — URL du frontend (`http://localhost:5173` en dev)
- `PAYDUNYA_*` — Clés PayDunya (utiliser sandbox en dev)
- `RESEND_API_KEY` — Pour les emails (Resend SDK)

### Variables d'environnement (post-migration Supabase)
Voir `kucibok/.env.exemple` — variables VITE_ exposées dans le bundle :
- `VITE_SUPABASE_URL` — URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` — Clé publique Supabase
- `VITE_API_URL` — `/api` (Vercel Functions)
- `VITE_API_KEY` — Clé API interne (`kcb-xxx`)
- `VITE_GOOGLE_CLIENT_ID` — OAuth Google (configuré dans Supabase dashboard)

---

## ROADMAP & SUIVI

Le fichier `roadmap.md` à la racine du projet contient l'audit complet + le plan de migration Supabase.

### Audit technique (TERMINÉ — score 7.9/10)
| Phase | Domaine | Statut |
|---|---|---|
| Phase 0 | Urgences absolues | COMPLETE ✅ |
| Phase 1 | Sécurité critique | COMPLETE ✅ |
| Phase 2 | Architecture & qualité | COMPLETE ✅ |
| Phase 3 | Performance & scalabilité | COMPLETE ✅ |
| Phase 4 | UX/UI & logique métier | COMPLETE ✅ |
| Phase 5 | Tests & qualité code | COMPLETE ✅ |
| F1 | Standard Kucibok | COMPLETE ✅ |
| F2 | Logistique transfrontalière | COMPLETE ✅ |
| F3 | Catalogue certifié B2B | COMPLETE ✅ |

### Migration Supabase (EN COURS — urgence 19 mars 2026)
| Phase | Domaine | Statut |
|---|---|---|
| Phase M0 | Setup Supabase + VPS renouvelé | A FAIRE |
| Phase M1 | Auth + Storage | A FAIRE |
| Phase M2 | PostgreSQL + migration données | A FAIRE |
| Phase M3 | Vercel Functions | A FAIRE |
| Phase M4 | Bascule production | A FAIRE |

Détail complet : `kucibok/docs/MIGRATION_SUPABASE.md`

---

## STANDARDS DE CODE — NON NÉGOCIABLES

### Langage & style
- **ES6+ JavaScript pur** — pas de TypeScript, pas de CoffeeScript, pas de transpileurs expérimentaux.
- **Code propre, lisible, maintenable** — un développeur senior doit pouvoir comprendre n'importe quelle fonction en 30 secondes.
- **DRY (Don't Repeat Yourself)** — zéro duplication de logique. Extraire en utilitaire dès la 2e occurrence.
- **Pas de valeurs magiques** — toutes les constantes sont nommées et documentées (`const MAX_BID_ATTEMPTS = 3` et non `if (attempts > 3)`).
- **Pas de logique spaghetti** — pas de `if/else` imbriqués > 2 niveaux. Early return, guard clauses, composition.
- **Architecture senior** — séparation des responsabilités stricte : controllers ne connaissent pas la DB, services ne connaissent pas `req/res`.

### JSDoc — obligatoire sur tout
Chaque fonction exportée, chaque classe, chaque module doit avoir un bloc JSDoc complet :
```js
/**
 * Crée et sauvegarde une enchère, vérifie les permissions et invalide le cache.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
exports.createAuction = async (req, res, next) => { ... }

/**
 * Retourne les options de requête HTTP avec le token JWT courant.
 * Lecture dynamique à chaque appel — jamais mise en cache.
 *
 * @returns {{ method: string, headers: Record<string, string> }}
 */
get options() { ... }
```

### Gestionnaire de paquets
- **`yarn` exclusivement** — ne jamais utiliser `npm install` pour ajouter/modifier des dépendances.

### Backend (Node.js — pré-migration)
- **`next(createError.xxx(...))` pour toutes les erreurs** — jamais `res.status(500).json(...)` directement.
- **`config` de `config/environnement.js` partout** — jamais `process.env.VARIABLE` dans les controllers/routes.
- **`try/catch` sur toutes les fonctions async** — `next(error)` dans le catch, jamais silencieux.
- **Pagination obligatoire** sur tous les endpoints de liste (`page`, `limit` en query params).
- **`.lean()`** sur toutes les requêtes MongoDB en lecture seule.
- **`logger` (Winston) exclusivement** — zéro `console.log/error/warn` en dehors des scripts de migration.

### Vercel Functions (post-migration)
- **`@supabase/supabase-js`** — client Supabase pour toutes les requêtes DB et auth.
- **Stateless** — pas de connexion persistante, chaque Function est indépendante.
- **Timeout 10s** (Vercel Free) — éviter les opérations longues (PDF → pdfkit, pas html-pdf-node).
- **RLS Supabase** — Row Level Security sur chaque table remplace les vérifications `req.user.role`.

### Frontend (React — pré-migration)
- **`utils.options` (getter) pour tous les appels fetch** — jamais `localStorage.getItem("token")` à l'init d'un module.
- **Zéro données sensibles dans les logs** (email, password, token, clés).
- **`{ error: string }` comme retour d'erreur uniforme** dans tous les fichiers `src/api/*.js`.
- **`useCallback` / `useMemo`** pour les fonctions et valeurs dérivées passées en props.

### Frontend (React — post-migration Supabase)
- **`supabase.auth.getSession()`** pour récupérer le token — plus de `localStorage.getItem("token")`.
- **`supabase.auth.onAuthStateChange()`** dans `AuthContext` — remplace le polling JWT.
- **`src/lib/supabase.js`** — client singleton Supabase, importé partout.
- **`useAuth.js`** utilise `supabase.auth.*` — plus de fetch vers `/api/auth/*`.

### Sécurité
- **Validation côté serveur systématique** — la validation côté client est UX, pas sécurité.
- **Vérification des permissions avant chaque mutation** (`req.user.role` pré-migration / RLS Supabase post-migration).
- **Aucune donnée sensible en base** : pas de cardNumber/CVC/expiry.
- **Inputs sanitisés** avant tout usage dans une query DB ou une réponse HTTP.

### Tests
- **Minimum 60% de couverture** sur `auth`, `payment`, `bid` controllers.
- **Chaque correctif de sécurité doit avoir un test** prouvant que la vulnérabilité est corrigée.
- **Tests d'intégration `supertest`** — pas de mocks pour les flows critiques (paiement, enchère).

---

## DÉPENDANCES CLÉS

### Backend (pré-migration — à supprimer post-migration)
| Package | Usage | Statut |
|---|---|---|
| `express` | Framework HTTP | DEPRECATED post-migration |
| `mongoose` | ODM MongoDB | DEPRECATED → Supabase JS |
| `jsonwebtoken` | JWT auth | DEPRECATED → Supabase Auth |
| `bcryptjs` | Hash passwords | DEPRECATED → Supabase Auth |
| `ioredis` | Cache + blacklist JWT | DEPRECATED → supprimé |
| `multer` | Upload fichiers | DEPRECATED → Supabase Storage |
| `paydunya` | Paiements West Africa | CONSERVÉ (Vercel Function) |
| `node-cron` | Jobs planifiés | REMPLACÉ par Supabase pg_cron |
| `express-rate-limit` | Protection DoS | DEPRECATED |
| `@sentry/node` | Monitoring erreurs | CONSERVÉ |

### Frontend / Kucibok (actuel)
| Package | Usage | Statut |
|---|---|---|
| `react` | UI | CONSERVÉ |
| `react-router-dom` | Routing | CONSERVÉ |
| `axios` | HTTP client | CONSERVÉ |
| `tailwindcss` | CSS utility | CONSERVÉ |
| `@metamask/sdk` | Auth blockchain | SUPPRIMÉ (MetaMask abandonné) |
| `framer-motion` | Animations | CONSERVÉ |
| `@sentry/react` | Monitoring erreurs | CONSERVÉ |
| `@supabase/supabase-js` | Auth + Storage + DB | À AJOUTER (Phase M0) |

---

## CONTACTS ET RESSOURCES

- **Repository GitHub :** https://github.com/Aurel667/kucibok
- **Dashboard Supabase :** https://supabase.com/dashboard (à créer)
- **Dashboard MongoDB Atlas :** https://cloud.mongodb.com (actif — backup avant migration)
- **Dashboard PayDunya :** https://app.paydunya.com
- **Dashboard Sentry :** https://sentry.io
- **Dashboard Resend :** https://resend.com
- **VPS Hostinger :** expire le 19 mars 2026 — renouveler impérativement

---

*Dernière mise à jour : 5 mars 2026 — Migration Supabase planifiée*
