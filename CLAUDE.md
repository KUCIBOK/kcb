# CLAUDE.md — Guide de développement Kucibok

> Ce fichier est lu automatiquement par Claude Code à chaque session.
> Il définit le contexte du projet, les règles de développement, et le workflow Git à respecter.

---

## PRÉSENTATION DU PROJET

**Kucibok** est une plateforme de vente et d'enchères d'art africain.

- **URL production :** https://kucibok.com
- **Backend API :** https://backend.kucibok.com
- **Stack :** Node.js + Express 5 / MongoDB (Mongoose) / React 18 + Vite / TailwindCSS 4

### Rôles utilisateurs
- `collector` — achète des œuvres, participe aux enchères
- `artist` — publie et vend des œuvres
- `professional` — galeriste, critique d'art
- `admin` — gestion complète de la plateforme

---

## ARCHITECTURE

```
kucibok-main/
├── backend/                     # API Node.js / Express
│   ├── config/                  # database.js, environnement.js, mailerConfig.js
│   ├── controllers/             # Logique métier (40+ controllers)
│   ├── middleware/              # auth.js, multer.js, errorHandler.js, api.js
│   ├── models/                  # Schémas Mongoose (User, Artwork, Auction, Bid, Wallet…)
│   ├── routes/                  # Routes Express
│   ├── services/                # Services métier (paydunya, mailer, subscription…)
│   ├── jobs/                    # Cron jobs (auctionCronJob, subscriptions.job…)
│   └── index.js                 # Point d'entrée — classe App
├── frontend/                    # Application React / Vite
│   ├── src/
│   │   ├── api/                 # Fonctions d'appel API (useAuth.js, useAPI.js…)
│   │   ├── components/          # Composants React
│   │   ├── routes/              # Router React
│   │   └── store/               # Contextes React (auth, toast…)
│   └── index.html
├── roadmap.md                   # Audit complet + plan de remédiation (40 items)
└── CLAUDE.md                    # Ce fichier
```

### Patterns clés
- **Auth :** JWT Bearer dans `Authorization` header + API key `kcb-api-key` dans le header
- **Erreurs :** `createError` de `middleware/errorHandler.js` → `next(createError.xxx(...))`
- **Config :** toutes les variables d'env passent par `config/environnement.js` (ne jamais lire `process.env` directement dans les controllers)
- **Emails :** deux services coexistent — `smtpMailer.service.js` (Hostinger) et `resendMailer.service.js` (Resend)

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

### Backend
```bash
cd backend
cp .env.exemple .env          # Configurer les variables d'env
npm install
npm run dev                   # Démarre avec nodemon (port 3000)
npm start                     # Production
npm test                      # Tests (à configurer - voir roadmap P5-TEST-001)
```

### Frontend
```bash
cd frontend
cp .env.exemple .env          # Configurer les variables d'env
npm install
npm run dev                   # Vite dev server (port 5173)
npm run build                 # Build production
```

### Variables d'environnement requises (backend)
Voir `backend/.env.exemple` pour la liste complète. Variables critiques :
- `MONGODB_URI` — URI MongoDB Atlas
- `JWT_SECRET` — Secret JWT (min. 64 caractères aléatoires)
- `CORS_ORIGIN` — URL du frontend (`http://localhost:5173` en dev)
- `PAYDUNYA_*` — Clés PayDunya (utiliser sandbox en dev)
- `RESEND_API_KEY` ou `HOSTINGER_EMAIL_PASSWORD` — Pour les emails

---

## ROADMAP & SUIVI

Le fichier `roadmap.md` à la racine du projet contient l'audit complet (40 items) avec les priorités, descriptions et actions pour chaque correctif.

### Phases de l'audit
| Phase | Domaine | Semaine | Items |
|---|---|:---:|:---:|
| Phase 0 | Urgences absolues | 0 | 8 |
| Phase 1 | Sécurité critique | 1-2 | 10 |
| Phase 2 | Architecture & qualité | 3-4 | 8 |
| Phase 3 | Performance & scalabilité | 5-6 | 7 |
| Phase 4 | UX/UI & logique métier | 7 | 3 |
| Phase 5 | Tests & qualité code | 8-9 | 4 |

Marquer chaque item comme `[x]` dans `roadmap.md` une fois implémenté et testé.

---

## RÈGLES DE CODE

### Backend (Node.js)
- **Toujours utiliser `next(createError.xxx(...))` pour propager les erreurs** — ne jamais `res.status(500).json(...)` directement dans les controllers.
- **Toujours utiliser `config` de `config/environnement.js`** — jamais `process.env.VARIABLE` directement dans les controllers ou routes.
- **Toutes les fonctions async doivent être enveloppées dans `try/catch`** avec `next(error)` dans le catch.
- **Pagination obligatoire** sur tous les endpoints de liste (`page`, `limit` en query params).
- **`.lean()`** sur toutes les requêtes MongoDB en lecture seule.
- **Pas de `console.log`** en production — utiliser le logger structuré (Winston).

### Frontend (React)
- **Ne jamais lire `localStorage.getItem("token")` à l'initialisation d'un module** — toujours dynamiquement dans les fonctions.
- **Ne jamais logger de données sensibles** (email, password, token) dans `console.log`.
- **Toutes les erreurs API doivent retourner `{ error: string }`** — pattern uniforme.
- **Utiliser les hooks React** (`useCallback`, `useMemo`) pour les fonctions passées en props.

### Tests (à mettre en place — P5-TEST-001)
- **Minimum 60% de couverture** sur `auth`, `payment`, `bid` controllers.
- **Chaque correctif de sécurité doit avoir un test** qui prouve que la vulnérabilité est corrigée.
- **Tests d'intégration avec `supertest`** — pas de mocks pour les flows critiques (paiement, enchère).

---

## DÉPENDANCES CLÉS

### Backend
| Package | Usage | Version |
|---|---|---|
| `express` | Framework HTTP | ^5.1.0 |
| `mongoose` | ODM MongoDB | ^7.8.7 |
| `jsonwebtoken` | JWT auth | ^9.0.2 |
| `bcryptjs` | Hash passwords | ^3.0.2 |
| `multer` | Upload fichiers | ^1.4.5-lts.2 |
| `paydunya` | Paiements West Africa | ^1.0.12 |
| `node-cron` | Jobs planifiés | ^4.1.1 |
| `express-rate-limit` | Protection DoS | ^8.0.1 |
| `@sentry/node` | Monitoring erreurs | ^10.7.0 |

### Frontend
| Package | Usage | Version |
|---|---|---|
| `react` | UI | ^18.3.1 |
| `react-router-dom` | Routing | ^7.4.0 |
| `axios` | HTTP client | ^1.10.0 |
| `tailwindcss` | CSS utility | ^4.0.17 |
| `@metamask/sdk` | Auth blockchain | ^0.32.1 |
| `framer-motion` | Animations | ^12.23.12 |
| `@sentry/react` | Monitoring erreurs | ^10.7.0 |

---

## CONTACTS ET RESSOURCES

- **Repository GitHub :** https://github.com/Aurel667/kucibok
- **Dashboard MongoDB Atlas :** https://cloud.mongodb.com
- **Dashboard PayDunya :** https://app.paydunya.com
- **Dashboard Sentry :** https://sentry.io
- **Dashboard Resend :** https://resend.com

---

*Dernière mise à jour : 19 février 2026*
