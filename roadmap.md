# ROADMAP KUCIBOK — Audit Complet & Plan de Remédiation

**Version:** 1.9 | **Date:** 3 mars 2026 | **Statut:** Phase 0 (partiel) · Phase 1 ✅ · Phase 2/3 en cours

### Décisions architecturales validées (Mars 2026)
| Décision | Choix |
|----------|-------|
| Design system | Garder indigo/violet (DESIGN-SYSTEM.md) — noir/ivoire/or reporté Phase 3+ |
| Routing portails | Routes /africa et /global (pas hostname) |
| Enchères | Masquées côté front — code backend conservé |

> Ce document est le résultat d'un audit senior couvrant : Sécurité, Scalabilité, Performance, UX/UI, Logique Métier, Architecture, et Tests Unitaires.

---

## RÉSUMÉ EXÉCUTIF

### Score de risque global : CRITIQUE — 2.1 / 10

Le projet est une plateforme de vente d'art africain avec enchères, wallets Ethereum, et paiements réels (PayDunya). L'audit révèle un état **non déployable en l'état**. Plusieurs vulnérabilités de niveau critique ont été confirmées directement dans le code source.

### Tableau des vulnérabilités critiques confirmées

| # | Vecteur | Gravité | Fichier / Preuve |
|---|---|---|---|
| 1 | Credentials MongoDB en clair dans Git | 🔴 CRITIQUE | `backend/.env:17` |
| 2 | Backdoor admin hardcodée active en production | 🔴 CRITIQUE | `backend/index.js:173` — `admin@kucibok.com / admin123` |
| 3 | JWT Logidoo hardcodé donnant accès service | 🔴 CRITIQUE | `backend/middleware/auth.js:8` |
| 4 | Clés privées ETH stockées en clair dans MongoDB | 🔴 CRITIQUE | `backend/models/Wallet.js:16` |
| 5 | Données bancaires (cardNumber, cvc) en clair | 🔴 CRITIQUE | `backend/models/User.js:38-51` |
| 6 | Frontend appelle la backdoor, pas le vrai login | 🔴 CRITIQUE | `frontend/src/api/useAuth.js:11` |
| 7 | Race condition sur les enchères (double bid) | 🟠 HAUTE | `backend/controllers/bid.controller.js:36-49` |
| 8 | Double paiement PayDunya possible | 🟠 HAUTE | `backend/controllers/payment.controller.js:142` |
| 9 | Escalade de privilège via updateUser | 🟠 HAUTE | `backend/controllers/auth.controllers.js:390` |
| 10 | Mot de passe loggué en clair côté frontend | 🟠 HAUTE | `frontend/src/api/useAuth.js:8` |

---

## LÉGENDE

- 🔴 **P0** — Urgence absolue (bloquer tout déploiement)
- 🟠 **P1** — Critique (semaine 1-2)
- 🟡 **P2** — Haute (semaine 3-4)
- 🟢 **P3** — Moyenne (semaine 5-6)
- 🔵 **P4** — Normale (semaine 7)
- ⚪ **P5** — Faible (semaine 8-9)

**Statuts :** `[ ]` À faire · `[x]` Fait · `[-]` En cours · `[~]` Reporté

---

## PHASE 0 — URGENCES ABSOLUES

> À traiter IMMÉDIATEMENT, avant tout autre changement. Chaque heure de délai représente un risque de compromission totale.

### [P0-CLEAN-001] 🔴 Supprimer le legacy backend (PRIORITÉ Mars 2026)
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Actions :**
  1. ✅ Supprimé `backend/config/mailerConfig.js`
  2. ✅ Supprimé l'import `mailerConfig` dans `backend/index.js` → remplacé par `sendAlertMail` de `mailer.service`
  3. ✅ Supprimé `backend/services/smtpMailer.service.js` — `auth.controllers.js` redirigé vers `mailer.service`
  4. ✅ Supprimé `backend/middleware/upload.js`
  5. ✅ Corrigé `backend/middleware/auth.js` — `process.env.JWT_SECRET` → `config.jwt.secret`
  6. ✅ Corrigé `backend/controllers/auth.controllers.js` — 10× `process.env.JWT_SECRET` → `config.jwt.secret`
  7. ✅ Corrigé `backend/watchdog.js` — SMTP verify supprimé, `sendAlertMail` importé de `mailer.service`

---

### [P0-CLEAN-002] 🔴 Masquer le module enchères côté front (PRIORITÉ Mars 2026)
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Actions :**
  1. ✅ Retiré `{ name: "Enchères", path: "/auction" }` du menu Explorer dans `Header.jsx`
  2. ✅ Routes `/auction` et `/auction/:id` déplacées sous `AdminProtectedRoute` dans `Router.jsx`
  3. ✅ Code backend auction/bid intact — réactivation possible Phase 3

---

### [P0-CONN-001] 🔴 Couche de connexion frontend ↔ backend (audit Mars 2026)
- [x] **Statut :** ✅ Terminé — 4 mars 2026
- **Problème :** Plusieurs ruptures silencieuses entre le frontend et le backend empêchaient tout fonctionnement en production.
- **Actions :**
  1. ✅ `vercel.json` — ajouté rewrite `/api/:path*` → `https://backend.kucibok.com/api/:path*` (production cassée sans ça)
  2. ✅ `vite.config.js` — corrigé `outDir: "build"` → `"dist"` (CI artifact path), proxy cible via `VITE_DEV_BACKEND_URL`, WebSocket `ws: true`
  3. ✅ 6 fichiers `src/api/` (useCampaigns, useContacts, useCrm, useEntity, useIntegration, useProfessionalAnalytics) — remplacé `VITE_BACKEND_URL` (undefined en prod) par `utils.api`, ajouté `kcb-api-key` via `utils.options.headers`
  4. ✅ `backend/routes/crm.routes.js` — remplacé `{ verifyToken }` (export inexistant → undefined) par `{ auth }`, ajouté middleware `auth` sur toutes les routes
  5. ✅ `backend/index.js` — monté `/api/crm` et `/api/analytics` (routes existantes mais non enregistrées)
  6. ✅ `.github/workflows/ci.yml` — migré `npm ci/run/audit` → `yarn install --frozen-lockfile / yarn build / yarn audit`, corrigé `VITE_API_URL` default `/api`, numéroté Job 4 (était double Job 3)
  7. ✅ `frontend/.env.exemple` — complété avec `VITE_DEV_BACKEND_URL`, `VITE_SOCKET_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_INTOUCH_*`, documentation inline

---

### [P0-SEC-001] 🔴 Rotation immédiate de TOUS les secrets compromis
- [x] **Statut :** ✅ Terminé — 4 mars 2026 — Rotation effectuée dans le `.env` (MongoDB Atlas, Resend, PayDunya, JWT_SECRET, WALLET_ENCRYPTION_KEY)
- **Fichiers :** `backend/.env`, `backend/.env.production`, `frontend/.env`
- **Problème :** Les fichiers `.env` sont commités dans Git. L'historique conserve ces données même après suppression.
- **Actions :**
  1. MongoDB Atlas : changer le password du user `aureliuskolani` (URI : `mongodb+srv://aureliuskolani:***@kucibok.mmnychn.mongodb.net`)
  2. Resend API : invalider la clé depuis le dashboard Resend
  3. Hostinger Email : changer le mot de passe
  4. SMTP Brevo : invalider depuis le dashboard
  5. PayDunya Live Keys : invalider et régénérer, vérifier l'historique des transactions
  6. JWT Secret : générer un nouveau (`openssl rand -hex 64`) — invalide tous les tokens actifs
  7. Purger l'historique Git : utiliser `git filter-repo` ou BFG Repo-Cleaner
  8. Ajouter `.env*`, `.env.production`, `.env.local` dans tous les `.gitignore`

---

### [P0-SEC-002] 🔴 Supprimer les endpoints de bypass en production
- [x] **Statut :** Fait — commit `180778c` — branche `fix/phase-0-bypass-cors-logidoo`
- **Fichiers :** `backend/index.js:122-203`, `frontend/src/api/useAuth.js:11`
- **Problème :** `/api/auth/login-bypass` accepte `admin@kucibok.com / admin123` (hardcodé). Le frontend appelle cette backdoor au lieu du vrai endpoint `/api/auth/login`.
- **Actions :**
  1. Supprimer le bloc `register-bypass` (`index.js:122-153`)
  2. Supprimer le bloc `login-bypass` (`index.js:167-203`)
  3. Modifier `useAuth.js:11` : remplacer `/auth/login-bypass` → `/auth/login`
  4. Supprimer la logique bypass dans `middleware/auth.js:4-6, 37-48, 88-98`
  5. Activer la vérification email commentée (`auth.controllers.js:275-280`)

---

### [P0-SEC-003] 🔴 Supprimer le JWT Logidoo hardcodé dans le source
- [x] **Statut :** Fait — commit `180778c` — auth.js refactorisé en `requireRole()` factory
- **Fichiers :** `backend/middleware/auth.js:8`
- **Problème :** Un JWT RSA256 complet est hardcodé. Quiconque possède ce token (visible dans le code) accède à tous les endpoints `auth` et `admin` sans vérification DB.
- **Actions :**
  1. Supprimer la constante `LOGIDOO_API_KEY`
  2. Supprimer les blocs `if (token === LOGIDOO_API_KEY)` dans les 5 fonctions middleware
  3. Remplacer par un secret en variable d'environnement `LOGIDOO_SERVICE_SECRET` avec vérification HMAC

---

### [P0-SEC-004] 🔴 Chiffrer les clés privées Ethereum en base de données
- [x] **Statut :** Fait — commit `b146496` — utils/encryption.js AES-256-GCM + hook Wallet pre('save') + script migration
- **Fichiers :** `backend/models/Wallet.js:16-20`, `backend/controllers/auth.controllers.js:64-88`
- **Problème :** La `privateKey` ETH est stockée en clair dans MongoDB. Tout accès DB compromet tous les wallets.
- **Actions :**
  1. Migrer les clés existantes en base avec AES-256-GCM
  2. Ajouter un hook Mongoose `pre('save')` pour chiffrer/déchiffrer via `WALLET_ENCRYPTION_KEY` en env
  3. Ne jamais retourner `privateKey` dans aucune réponse API
  4. À terme : migrer vers AWS KMS ou HashiCorp Vault

---

### [P0-SEC-005] 🔴 Supprimer les données bancaires du modèle User
- [x] **Statut :** Fait — commit `53342fa` — schéma User nettoyé + script migration MongoDB
- **Fichiers :** `backend/models/User.js:38-51`
- **Problème :** Champs `card.cardNumber`, `card.cvc`, `card.expiry` stockés en clair → violation PCI-DSS.
- **Actions :**
  1. Supprimer les champs `card` du schéma `User`
  2. Migration : `db.users.updateMany({}, { $unset: { card: "" } })`
  3. Ne jamais stocker de PAN — utiliser exclusivement les tokens de paiement PayDunya

---

### [P0-SEC-006] 🔴 Corriger la configuration CORS (double enregistrement)
- [x] **Statut :** Fait — commit `180778c` — suppression cors() ouvert + bodyParser + express.json() doublons
- **Fichiers :** `backend/index.js:68-82`
- **Problème :** `cors()` appelé 2 fois (ouvert à tout, puis restreint). `express.json()` appelé 2 fois. `bodyParser.json()` redondant.
- **Actions :**
  1. Supprimer le premier `this.app.use(cors())` (`index.js:72`)
  2. Supprimer `this.app.use(express.json())` en doublon (`index.js:69`)
  3. Supprimer `this.app.use(bodyParser.json())` (redondant avec `express.json()`)

---

### [P0-UX-001] 🔴 Supprimer le `window.close()` déclenché par le redimensionnement
- [x] **Statut :** Fait — commit `067257f` — handleResize et window.close() supprimés d'App.jsx
- **Fichiers :** `frontend/src/App.jsx:53-61`
- **Problème :** Ferme l'onglet utilisateur si `outerWidth - innerWidth > 100` (DevTools ouverts, panneau latéral, certains moniteurs).
- **Action :** Supprimer entièrement le handler `handleResize` et son `addEventListener`.

---

### [P0-UX-002] 🔴 Supprimer le log du mot de passe en clair dans la console
- [x] **Statut :** Fait — commit `180778c` — console.log(email, password) supprimés de useAuth.js
- **Fichiers :** `frontend/src/api/useAuth.js:8-9`
- **Problème :** `console.log("Attempting login with:", email, password)` — mot de passe visible dans la console navigateur.
- **Action :** Supprimer les lignes 8-9 et 17 de `useAuth.js`.

---

## PHASE 1 — CORRECTIONS CRITIQUES DE SÉCURITÉ (Semaine 1-2)

### [P1-SEC-007] 🟠 Installer et configurer Helmet.js
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `helmet` installé et configuré dans `backend/index.js` avec CSP, HSTS, frameguard, et les autres headers de sécurité HTTP.

---

### [P1-SEC-008] 🟠 Bloquer l'escalade de privilège dans updateUser
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `auth.controllers.js:389` — `if (role && req.user?.role !== 'admin') return next(createError.forbidden(...))` ; seul admin peut modifier le rôle (`auth.controllers.js:399`).

---

### [P1-SEC-009] 🟠 Protéger les endpoints getUserById et getUserByEmail
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `auth.routes.js:44` — `router.get("/:id", auth, getUserById)` et `router.get("/email/:email", auth, getUserByEmail)` — middleware `auth` ajouté sur les deux routes.

---

### [P1-SEC-010] 🟠 Supprimer les logs verbeux en production
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `backend/utils/logger.js` — Winston avec transports Console (dev) + File (prod) + Sentry. `console.log` sensibles remplacés. Logs structurés JSON en production.

---

### [P1-SEC-011] 🟠 Sécuriser l'endpoint `/api/report-error`
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** Rate-limiter strict (5 req/15min) + validation du champ `error` (string obligatoire) + troncature `safeError` (1000 chars) et `safeInfo` (4000 chars) avant envoi email.

---

### [P1-SEC-012] 🟠 Corriger la validation MIME des uploads
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `backend/middleware/multer.js` — validation par magic bytes (signatures binaires), UUID comme nom de fichier, type MIME réel utilisé (non spoofable par le client).

---

### [P1-SEC-013] 🟠 Activer la vérification email
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `auth.controllers.js:281` — `if (!user.isEmailVerified && user.role !== 'admin')` bloque le login sans email vérifié (sauf admin). Flux de vérification actif.

---

### [P1-SEC-014] 🟠 Sécuriser `deleteAllUsers`
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `auth.controllers.js:531` — confirmation `{ "confirm": "DELETE_ALL_USERS" }` obligatoire + session MongoDB avec transaction (commit/abort atomique sur 8 collections).

---

### [P1-SEC-015] 🟢 Implémenter l'idempotence sur les callbacks PayDunya
- [x] **Statut :** Complet (26 fév 2026)
- **Fichiers :** `backend/controllers/payment.controller.js`, `backend/routes/payment.routes.js`
- **Actions réalisées :**
  1. [x] `exports.verifyPayDunyaWebhook` — middleware SHA-512(masterKey) avec `timingSafeEqual` (anti timing-attack), appliqué sur `POST /api/payments/paydunya/callback`
  2. [x] Idempotence atomique via `findOneAndUpdate({ paymentStatus: 'pending' })` sur `processArtworkPurchase` — seul le 1er callback gagne, les suivants retournent null → race condition corrigée
  3. [x] Même logique atomique sur `processSubscriptionPayment` (status 'pending')
  4. [x] `this.processArtworkPurchase` → `exports.processArtworkPurchase` (déjà corrigé)
  - Note : collection `ProcessedWebhooks` non créée — l'idempotence atomique via le champ unique de la transaction est suffisante

---

### [P1-SEC-016] 🟠 Conformité RGPD — Consentement pour le tracking IP
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `frontend/src/App.jsx` — bannière de consentement RGPD (CMP), `addVisitor()` déclenché uniquement après `consent === true`, état persisté dans `localStorage` sous `kcb_analytics_consent`.

---

## PHASE 2 — ARCHITECTURE ET QUALITÉ (Semaine 3-4)

### [P2-ARCH-001] 🟡 Refactoriser le middleware d'authentification
- [x] **Statut :** Complet (26 fév 2026)
- **Réalisé :** `backend/middleware/auth.js` — factory `requireRole(...roles)` remplace les 5 fonctions quasi-identiques. `auth` = `requireRole()`, `admin` = `requireRole('admin')`, etc.

---

### [P2-ARCH-002] 🟡 Supprimer les dépendances serveur du frontend
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `frontend/package.json` — `express`, `nodemailer`, `next` retirés ; aucun import de ces packages dans `src/`.

---

### [P2-ARCH-003] 🟡 Isoler le code de développement hors du serveur principal
- [x] **Statut :** ✅ Supersédé — 3 mars 2026
- **Note :** Les routes bypass (`login-bypass`, `register-bypass`) ont été supprimées par P0-SEC-002 (commit `180778c`). Il n'y a plus de routes dev dans `index.js`. Ce ticket est sans objet.

---

### [P2-ARCH-004] ✅ Activer et configurer Redis
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Actions réalisées :**
  1. ✅ `ioredis` ^5.10.0 installé
  2. ✅ `backend/config/redis.js` — singleton client avec fallback gracieux (mode dégradé si `REDIS_URL` absent)
  3. ✅ `backend/middleware/cache.js` — middleware TTL générique + `invalidateCache`
  4. ✅ `backend/utils/jwtBlacklist.js` — `blacklistToken` + `isBlacklisted`
  5. ✅ `backend/middleware/auth.js` — vérification blacklist JWT avant chaque requête authentifiée
  6. ✅ `exports.logout` ajouté dans `auth.controllers.js` — révoque le token en blacklist Redis
  7. ✅ `POST /api/auth/logout` ajouté dans `auth.routes.js`
  8. ✅ Cache (TTL 300s) appliqué sur `GET /`, `/forsale`, `/artist/:id`, `/forsale/artist/:id`, `/random` dans `artwork.routes.js`
  9. ✅ `invalidateCache('artworks')` déclenché sur `createArtwork`, `updateArtwork`, `deleteArtwork`
  10. ✅ `backend/.env.exemple` documenté avec exemples Redis (local + Upstash)

---

### [P2-ARCH-005] 🟡 Standardiser la gestion des erreurs async (Express 5)
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Actions réalisées :**
  1. ✅ `asyncHandler(fn)` wrapper déjà présent dans `middleware/errorHandler.js`
  2. ✅ `console.error` → `logger.error` dans tous les controllers (12 fichiers, 50 occurrences)
  3. ✅ `logger` importé dans les 11 controllers qui en manquaient

---

### [P2-ARCH-006] 🟡 Migrer les uploads vers un CDN/S3
- [x] **Statut :** ✅ Terminé — 5 mars 2026
- **Fichiers modifiés :** `middleware/multer.js`, `config/cloudinaryConfig.js` (nouveau), `config/environnement.js`, `.env.exemple`, `controllers/artwork.controller.js`, `controllers/artist.controllers.js`, `controllers/auth.controllers.js`, `controllers/blogPost.controller.js`, `controllers/profile.controllers.js`
- **Actions réalisées :**
  1. ✅ Installé `cloudinary` SDK
  2. ✅ `config/cloudinaryConfig.js` — initialisation via `config.cloudinary.*`
  3. ✅ `config/environnement.js` — ajout `cloudinary: { cloudName, apiKey, apiSecret }`
  4. ✅ `.env.exemple` — ajout `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`
  5. ✅ `middleware/multer.js` — buffer mémoire → `cloudinary.uploader.upload_stream()` ; expose `req.file.cloudinaryUrl`
  6. ✅ 5 controllers migrés : `req.file.filename` → `req.file.cloudinaryUrl`
  7. ✅ Route `/uploads` conservée dans `index.js` pour rétrocompatibilité (images existantes en base)

---

### [P2-ARCH-007] 🟡 Traiter les routes commentées
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Actions réalisées :**
  1. ✅ `analyticsCollectionJob.js` supprimé — imports cassés (casse Linux), fonctionnalité Phase 3+, commenté dans `index.js`
  2. ✅ `logidooAlertsRoutes` reste commenté — référencé dans `index.js`, module à activer si besoin (Phase 2)
  3. Modules CRM/support tickets : déjà actifs via `clientRoutes`, `campaignRoutes`, `contactRoutes`

---

### [P2-ARCH-008] 🟢 Réarchitecturer les tokens JWT
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Fichiers :** `backend/controllers/auth.controllers.js`, `backend/routes/auth.routes.js`, `frontend/src/api/useAuth.js`, `frontend/src/api/useAPI.js`, `frontend/src/store/AuthContext.jsx`
- **Fait :**
  - [x] `generateTokens()` — payload `{ _id, role, email, jti, type }`, access 1h, refresh 30j
  - [x] Tous les endpoints de login/register retournent `token` + `refreshToken`
  - [x] Route `POST /api/auth/refresh-token` opérationnelle
  - [x] Frontend stocke `refreshToken` dans localStorage (tous les flows login/register)
  - [x] `refreshTokenApi()` disponible dans `useAuth.js`
  - [x] `useAPI.js` — getter dynamique (token lu à chaque appel, pas à l'init du module)
  - [x] Logout nettoie `refreshToken` du localStorage
- **Reste (optionnel, dépend Redis) :**
  - [ ] Blacklist Redis pour révocation immédiate (P2-ARCH-004 pré-requis)
  - [ ] Auto-refresh intercepteur global sur 401 (nécessite refacto fetch → axios)

---

## PHASE 3 — PERFORMANCE ET SCALABILITÉ (Semaine 5-6)

### [P3-PERF-001] 🟢 Implémenter la pagination sur tous les endpoints de liste
- [x] **Statut :** Complet (26 fév 2026)
- **Fichiers :** `backend/utils/paginate.js` (nouveau), 9 controllers, 3 fichiers frontend API
- **Réalisé :**
  - [x] `backend/utils/paginate.js` — helper uniforme : page/limit depuis req.query, cap 100, Promise.all(find + count), retourne `{ data, total, page, limit, totalPages }`
  - [x] 25 endpoints paginés dans 9 controllers : artwork (10), auth (1), blogPost (6), collection (1), review (2), transaction (1), subscription (2), log (1), auction (1)
  - [x] Frontend API layer mis à jour : `useArtworks.js` (10 fonctions), `useBlogPost.js` (6 fonctions), `useUsers.js`, `useTransaction.js`, `useReview.js` — paramètres `page=1, limit=20`, retournent `{ data, total, page, totalPages }`
  - [x] `useArtworks.js` / `useBlogPost.js` — `utils.options` utilisé dynamiquement (plus de destructuring statique)
- **⚠️ Composants React non mis à jour** — attendent encore des tableaux (`data?.length >= 1`), doivent être migrés vers `result?.data?.length >= 1` au fil des sprints UI

---

### [P3-PERF-002] 🟢 Optimiser le cron job des enchères
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Actions réalisées :**
  1. ✅ Guard clause `Auction.exists({ status: { $in: ["upcoming", "ongoing"] } })` — skip si aucune enchère active
  2. ✅ Fréquence réduite : `*/5 * * * *` (était toutes les minutes)
  3. ✅ Indexes composites `{ status, startTime }` et `{ status, endTime }` ajoutés dans `Auction.js`
  4. ✅ `console.log/error` → `logger.info/error` (Winston)

---

### [P3-PERF-003] 🟢 Implémenter les WebSockets pour les enchères en temps réel
- [ ] **Statut :** À faire
- **Fichiers :** `backend/index.js:61`, controllers auction et bid
- **Actions :**
  1. Intégrer `socket.io` avec le serveur HTTP existant (`this.server`)
  2. Créer des rooms par `auctionId`
  3. Émettre `bid:new` lors de chaque enchère valide
  4. Émettre `auction:ended` depuis le cron job
  5. Mettre à jour le frontend pour s'abonner en temps réel

---

### [P3-PERF-004] 🟢 Corriger la race condition sur les enchères
- [x] **Statut :** Complet (26 fév 2026)
- **Fichiers :** `backend/controllers/bid.controller.js`, `backend/models/Auction.js`, `backend/controllers/auction.controller.js`
- **Réalisé :**
  1. [x] `mongoose.startSession()` + `session.withTransaction()` — toutes les opérations placeBid sont ACID
  2. [x] `Auction.findOneAndUpdate({ currentPrice: { $lt: amount }, status: 'ongoing', ... })` — atomique, condition de victesse, retourne null si concurrent gagne la course
  3. [x] Si null → throw `CONFLICT` → rollback de la transaction → 409 au client
  4. [x] `minBidIncrement` ajouté au modèle Auction (défaut: 1) ; accepté à la création via `createAuction`
  - ⚠️ Pré-requis runtime : MongoDB replica set (Atlas prod ✅ ; dev local nécessite `--replSet rs0`)

---

### [P3-PERF-005] 🟢 Corriger la durée de subscription hardcodée
- [x] **Statut :** Complet (27 fév 2026)
- **Réalisé :** `payment.controller.js:301` — `durationDays = subscription.planId?.durationDays ?? 30` ; `endDate` calculé depuis `plan.durationDays`, plus de valeur hardcodée.
- **Actions :**
  1. Ajouter `durationDays` dans le modèle `Plan`
  2. Calculer `endDate` depuis `plan.durationDays`
  3. Implémenter le renouvellement automatique

---

### [P3-PERF-006] 🟢 Optimiser les requêtes MongoDB (lean + indexes)
- [x] **Statut :** ✅ Terminé — 3 mars 2026 (partiel — auction.controller.js)
- **Actions réalisées :**
  1. ✅ `.lean()` ajouté sur `getOngoingAuctions`, `getAuctionById`, `getAuctionDetails`
  2. ✅ `console.log` verbeux supprimés (y compris le `console.log(auctions)` qui loggait tout le tableau)
  3. `$lookup` aggregations — reporté Phase 2 (pas de gain immédiat critique)
- **Note :** Appliquer `.lean()` sur les autres controllers au fil des sprints UI (artwork, blog, etc.)

---

### [P3-PERF-007] 🟢 Corriger la lecture statique du token dans useAPI.js
- [x] **Statut :** Complet (26 fév 2026)
- **Réalisé :** `useAPI.js` — `get options()` getter ES6 : token lu dynamiquement à chaque accès (jamais à l'init du module).

---

## PHASE 4 — UX/UI ET LOGIQUE MÉTIER (Semaine 7)

### [P4-UX-001] 🔵 Supprimer le blocage du clic-droit et F12
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Réalisé :** `frontend/src/App.jsx` — handlers `handleContextMenu`, `handleCut`, `handleDrag`, `handlePrint`, `handleKeyDown` supprimés. `window.scrollTo(0,0)` conservé. Protection images : watermarks côté serveur à implémenter Phase 1.

---

### [P4-META-001] 🔵 Implémenter un minimum bid increment
- [x] **Statut :** Complet (26 fév 2026)
- **Réalisé :** `models/Auction.js` — champ `minBidIncrement` (default: 1). `bid.controller.js` — `amount < auction.currentPrice + minIncrement` → rejet. `auction.controller.js` — accepte `minBidIncrement` optionnel à la création.

---

### [P4-UX-002] 🔵 Audit UX/UI — corrections critiques frontend
- [x] **Statut :** Complet (27 fév 2026)
- **Corrections réalisées (9 items) :**
  1. `index.css` — Suppression double `.bg-gradient` / `.text-gradient` dans `@layer utilities` (override cassait le gradient marque indigo→purple)
  2. `SignIn.jsx` — Suppression `alert()` + 3× `console.log` debug + `onClick={() => alert(...)}` sur le bouton submit
  3. `CollectorLanding.jsx` — Fix `class=` → `className=` (ligne 132) ; suppression `Math.random()` date countdown → `item.endTime` conditionnel
  4. `Artwork.jsx` — Fix `utterance.lang = "en-EN"` → `"fr-FR"` (language mismatch voix/texte) ; suppression `console.log("Lecture de la description")`
  5. `SubscriptionPlanCheckout.jsx` — Fix `classname=` → `className=` ; extraction constante `TVA_RATE = 0.20` ; remplacement hardcoded `/5` par `TVA_RATE`
  6. `DashboardSidebar.jsx` (CRÉÉ) — Composant partagé extraire ~360 lignes dupliquées dans Artist/Collector/Professional dashboards
  7. `Artist.jsx`, `Collector.jsx`, `Professional.jsx` — Refacto pour utiliser `DashboardSidebar`
  8. `DESIGN-SYSTEM.md` (CRÉÉ) — Référence centralisée des tokens couleur, typographie, composants ui/, règles de style

---

### [P4-UX-003] 🔵 Migration des formulaires vers les composants ui/
- [x] **Statut :** Complet (27 fév 2026)
- **Fichiers migrés :**
  - `SignIn.jsx` — `<input email>` → `<Input>`, boutons MetaMask + submit → `<Button>`, suppression import `DataLoader` inutilisé
  - `Step1.jsx` — boutons MetaMask + Email → `<Button variant="outline" icon={...}>`, fix bug `return;` manquant
  - `Step2.jsx` — `<input email>` → `<Input>`, boutons submit + retour → `<Button>`
  - `SignUp.jsx` — suppression `console.log/console.error` debug dans fetch countries
  - `artist/Profile.jsx` — suppression `DataLoader` inutilisé, import `toast`, fix catch (error silencieux → `state.error`), ajout bandeau erreur JSX, `toast.success` sur succès
  - `collector/Profile.jsx` — même corrections + ajout `error: ""` dans state initial
  - `professional/Profile.jsx` — même corrections + ajout `error: ""` dans state initial

---

### [P4-META-002] ✅ Standardiser la gestion des erreurs frontend
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Actions réalisées :**
  1. ✅ `useAPI.js` — `options` converti en **getter ES6** : token lu dans `localStorage` à chaque appel, jamais à l'import (corrige P3-PERF-007 qui était marqué "fait" mais non appliqué)
  2. ✅ **18 fichiers API** corrigés : suppression de `const { api, options } = utils` au niveau module → `const { api } = utils` + tous les `...options` → `...utils.options`
  3. ✅ `logoutUser()` ajoutée dans `useAuth.js` — appelle `POST /auth/logout`, puis vide localStorage (token + refreshToken + likedArtworks)
  4. ⏭️ Hook `useApiCall<T>` et constantes de messages d'erreur reportés (faible ROI immédiat, pattern `{ error }` déjà cohérent dans tous les fichiers)

---

## PHASE 5 — TESTS ET QUALITÉ CODE (Semaine 8-9)

### [P5-TEST-001] ⚪ Mettre en place un framework de tests
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Fichiers :** `backend/package.json`, `backend/tests/`
- **Actions réalisées :**
  1. ✅ `jest` + `supertest` installés en devDependencies
  2. ✅ Jest configuré avec `--coverage`, `setupFiles`, `collectCoverageFrom`, thresholds par fichier
  3. ✅ `tests/jest.setup.js` — variables d'env de test (JWT_SECRET, API_KEY, MONGODB_URI fictif)
  4. ✅ `tests/middleware.test.js` — 11 tests : protect (api.js) + requireRole (auth.js) → 100% coverage
  5. ✅ `tests/security.test.js` — 15 tests : accès non auth, escalade de privilège, compte suspendu, API key
  6. ✅ `tests/auth.test.js` — 10 tests : register (400/409/201), login (404/401/200), logout (401/200)
  7. ✅ **36 tests, 36 passent** — `api.js` 100%, `auth.js` 97% coverage
- **⚠️ Restant :** Tests payment + bid (enchères non actives) à ajouter quand Phase 3 WebSockets sera activée

---

### [P5-TEST-002] ⚪ Mettre en place un pipeline CI/CD avec checks de sécurité
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Fichier :** `.github/workflows/ci.yml`
- **Actions réalisées :**
  1. ✅ Job `test-backend` — `npm test` (Jest + coverage) sur Node 20 ubuntu
  2. ✅ Job `secrets-scan` — Gitleaks détection de secrets dans tout l'historique Git
  3. ✅ Job `audit` — `npm audit --audit-level=high` backend + frontend (continue-on-error: signal sans bloquer)
  4. ✅ Job `build-frontend` — build Vite complet avec variables d'env depuis GitHub Secrets
  5. ✅ Déclenché sur push/PR vers `main` et `dev`
- **⚠️ Secrets à configurer dans GitHub Settings :** `JWT_SECRET`, `API_KEY`, `VITE_API_KEY`, `VITE_GOOGLE_CLIENT_ID`

---

### [P5-QUAL-001] ~~TypeScript~~ — Annulé
- [~] **Statut :** ❌ Annulé — décision produit 3 mars 2026
- **Raison :** Le projet reste en **ES6+ JavaScript pur**. Les standards de qualité (JSDoc complet, DRY, no magic values, senior architecture) remplacent la valeur apportée par TypeScript sans la complexité d'outillage.

---

### [P5-QUAL-002] ⚪ Standardiser la configuration des logs
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Actions réalisées :**
  1. ✅ `utils/logger.js` — Winston complet (Console coloré dev, File rotation prod, JSON structuré, silent test)
  2. ✅ Format JSON structuré en production avec niveau, timestamp, message, metadata
  3. ✅ `middleware/requestId.js` — UUID v4 par requête, header `X-Request-ID` entrée/sortie + `req.requestId`
  4. ✅ `index.js` — `requestId` en premier middleware, logger HTTP inclut `{ ip, requestId }`
  5. ✅ **200+ `console.log` supprimés** dans tous les controllers, services, jobs, middleware, watchdog
  6. ✅ Seuls exempts : `utils/logger.js` (transport console), scripts standalone, code commenté

---

## PRD V2 — FEATURES MÉTIER (Mars 2026)

> Fonctionnalités produit prioritaires issues du `frontend/docs/PRD_V2.md`.

### [F1-STD-001] Standard Kucibok — Passeport numérique de l'œuvre
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Fichiers :**
  - `backend/models/Artwork.js` — `kuciobkId`, `medium`, `condition`, `provenance`, pre-save hook
  - `backend/controllers/artwork.controller.js` — `exports.verifyArtwork` (endpoint public)
  - `backend/routes/artwork.routes.js` — `GET /verify/:kuciobkId` (sans auth)
  - `backend/services/documents.service.js` — QR code `qrcode` → base64 dans PDF HTML
  - `frontend/src/api/useArtworks.js` — `verifyArtwork()` (sans token)
  - `frontend/src/pages/VerifyArtwork.jsx` — Page publique standalone (états: verified/unverified/error)
  - `frontend/src/routes/Router.jsx` — Route `/verify/:kuciobkId` hors Layout
  - `frontend/src/pages/dashboard/SubmitArtwork.jsx` — `medium`, `condition`, `provenance` dans formState
  - `frontend/src/components/artworks/submit/Step1.jsx` — Bloc "Standard Kucibok — Certification"
- **Réalisé :**
  - [x] `KCB-XXXXXXXX` — identifiant unique auto-généré (`crypto.randomBytes(4)`, collision-safe)
  - [x] QR code dans le PDF certificat pointant vers `/verify/:kuciobkId`
  - [x] Page de vérification publique scannable sans compte
  - [x] Champs métier medium / condition / provenance dans le formulaire de soumission
  - [x] Badge `ShieldCheck` vert sur les cartes catalogue (si `kuciobkId` présent)

---

### [F2-LOG-001] Logistique transfrontalière V1
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Fichiers :**
  - `backend/models/DeliveryRequest.js` — `corridor`, `originCountry`, `packagingChecklist`, `events[]`, status enum + `customs_cleared`
  - `backend/controllers/delivery.controller.js` — fix bug `artworksIds→artworkIds`, events push dans `changeDeliveryStatus`, `getDeliveryByTrackingId` (public)
  - `backend/routes/delivery.routes.js` — route publique `GET /track/:trackingId`
  - `frontend/src/api/useDelivery.js` — `getDeliveryByTracking()` sans auth
  - `frontend/src/store/DeliveryStore.jsx` — fix exclusion artistes (artistes peuvent désormais créer des demandes)
  - `frontend/src/pages/TrackingPage.jsx` — réécriture complète (remplace hook `useLogistics` inexistant)
  - `frontend/src/components/artworks/RequestShipmentModal.jsx` — NOUVEAU : modal formulaire d'expédition
  - `frontend/src/pages/Artwork.jsx` — bouton "Demander l'expédition transfrontalière" (visible si connecté)
- **Réalisé :**
  - [x] Formulaire demande d'expédition depuis la fiche œuvre (corridor AF↔FR, pays, destinataire, dates, taille colis)
  - [x] Checklist emballage muséal (5 items standards)
  - [x] Suivi statutaire : pending → in_preparation → in_transit → customs_cleared → delivered
  - [x] Historique des événements (push à chaque changement de statut par admin)
  - [x] Page tracking publique `/tracking/:trackingId` — aucun compte requis
  - [x] Barre de progression visuelle 5 étapes
  - [x] Note CITES (matériaux protégés) dans le formulaire
- **Reste (V2) :** GPS haute valeur, extension corridors Belgique/UK, dépôt temporaire

---

### [F1-CAT-001] Catalogue certifié — Portail Global
- [x] **Statut :** ✅ Terminé — 3 mars 2026
- **Fichier :** `frontend/src/pages/GlobalPage.jsx`
- **Réalisé :**
  - [x] `CatalogueSection` : fetch `getApprovedArtworks()` → grille 2/3/4 colonnes responsive
  - [x] Filtres par catégorie (pills dynamiques depuis les données réelles)
  - [x] Badge Standard Kucibok (ShieldCheck) sur chaque carte certifiée
  - [x] Badge "Enchère" (purple) si `auctionStatus === "auction_ongoing"`
  - [x] Spinner `Loader2` pendant le chargement, masqué si aucune donnée

---

### [F3-CAT-001] Catalogue Certifié B2B — Accès Professionnel
- [x] **Statut :** ✅ Terminé — 4 mars 2026
- **Domaine :** Catalogue B2B / Sourcing professionnel

#### Backend
- [x] `Artwork.js` : ajout champ `availabilityStatus` (available/on_exhibition/on_request/unavailable)
- [x] `SourcingInquiry.js` : nouveau modèle (artworkId, requestedBy, organization, purpose, budget, message, status, adminNote)
- [x] `sourcing.controller.js` : createInquiry, getMyInquiries, getAllInquiries, updateInquiryStatus
- [x] `sourcing.routes.js` : POST /, GET /mine, GET / (admin), PATCH /:id (admin)
- [x] `artwork.controller.js` : endpoint `getCataloguePro` — filtre status=approved + category, availabilityStatus, priceMin/Max, search (full-text), pagination
- [x] `artwork.routes.js` : GET /catalogue (`requireRole('professional', 'admin')`)
- [x] `middleware/auth.js` : export `requireRole` factory
- [x] `index.js` : montage `/api/sourcing`

#### Frontend
- [x] `useSourcing.js` : createInquiry(), getMyInquiries(), getCataloguePro()
- [x] `SourcingInquiryModal.jsx` : modal de demande (purpose, organization, budget, message), état succès
- [x] `CataloguePro.jsx` : page /catalogue — grille filtrée, pagination, badges disponibilité, bouton Contacter
- [x] `Router.jsx` : route `/catalogue` sous ProfessionalProtectedRoute
- [x] `Step1.jsx` : champ `availabilityStatus` dans section Standard Kucibok
- [x] `SubmitArtwork.jsx` : `availabilityStatus: 'available'` dans formState initial
- [x] `Professional.jsx` : entrée "Catalogue B2B" (icône ShieldCheck, to: /catalogue) dans le menu sidebar
- [x] `DashboardSidebar.jsx` : support items avec `to` → rendu `<Link>` au lieu de `<button>`

---

## SCORECARD — ÉTAT ACTUEL vs CIBLE

| Domaine | Score Actuel | Score Cible | Principales actions |
|---|:---:|:---:|---|
| **Sécurité — Secrets** | 9/10 | 9/10 | P0-SEC-001 ✅ |
| **Sécurité — Auth/Authz** | 1/10 | 8/10 | P0-SEC-002, P0-SEC-003, P1-SEC-008, P1-SEC-009 |
| **Sécurité — Données** | 0/10 | 8/10 | P0-SEC-004, P0-SEC-005 |
| **Sécurité — Infrastructure** | 2/10 | 8/10 | P0-SEC-006, P1-SEC-007 |
| **Logique Métier** | 3/10 | 8/10 | P3-PERF-004, P1-SEC-015, P3-PERF-005, P4-META-001 |
| **Performance** | 4/10 | 7/10 | P3-PERF-001, P3-PERF-002, P3-PERF-006, P3-PERF-007 |
| **Scalabilité** | 3/10 | 8/10 | P3-PERF-003, P2-ARCH-006, P2-ARCH-004 |
| **Architecture** | 3/10 | 8/10 | P2-ARCH-001 à P2-ARCH-008 |
| **UX/UI** | 4/10 | 9/10 | P0-UX-001, P0-UX-002, P4-UX-001 |
| **Tests / Qualité** | 0/10 | 7/10 | P5-TEST-001, P5-TEST-002, P5-QUAL-001 |
| **Conformité RGPD** | 1/10 | 7/10 | P1-SEC-016 |
| **Score Global** | **2.1/10** | **7.9/10** | |

---

## SYNTHÈSE TIMELINE

```
SEMAINE 0 — IMMÉDIAT (BLOQUANT)
├── [P0-SEC-001] Rotation de tous les secrets compromis
├── [P0-SEC-002] Supprimer endpoints bypass + corriger useAuth.js
├── [P0-SEC-003] Supprimer le JWT Logidoo hardcodé
├── [P0-SEC-004] Chiffrer les clés privées ETH
├── [P0-SEC-005] Supprimer les données bancaires du modèle User
├── [P0-SEC-006] Corriger la configuration CORS
├── [P0-UX-001]  Supprimer window.close() sur resize
└── [P0-UX-002]  Supprimer log mot de passe en clair

SEMAINE 1-2 — CRITIQUE
├── [P1-SEC-007] Installer Helmet.js
├── [P1-SEC-008] Bloquer l'escalade de privilège (updateUser)
├── [P1-SEC-009] Protéger getUserById / getUserByEmail
├── [P1-SEC-010] Remplacer console.log par logger structuré
├── [P1-SEC-011] Protéger /api/report-error
├── [P1-SEC-012] Vraie validation MIME sur les uploads
├── [P1-SEC-013] Activer la vérification email
├── [P1-SEC-014] Sécuriser deleteAllUsers
├── [P1-SEC-015] Idempotence sur les callbacks PayDunya
└── [P1-SEC-016] Conformité RGPD pour le tracking

SEMAINE 3-4 — HAUTE
├── [P2-ARCH-001] Refactoriser le middleware auth (5 → 1 fonction)
├── [P2-ARCH-002] Supprimer dépendances serveur du frontend
├── [P2-ARCH-003] Isoler le code de développement
├── [P2-ARCH-004] Activer Redis (cache + blacklist JWT)
├── [P2-ARCH-005] Standardiser gestion erreurs async
├── [P2-ARCH-007] Traiter les routes commentées
└── [P2-ARCH-008] Réarchitecturer les tokens JWT

SEMAINE 5-6 — MOYENNE
├── [P3-PERF-001] Pagination sur tous les endpoints de liste
├── [P3-PERF-002] Optimiser le cron job enchères
├── [P3-PERF-003] WebSockets pour les enchères
├── [P3-PERF-004] Transactions MongoDB sur les enchères (race condition)
├── [P3-PERF-005] Corriger la durée de subscription
├── [P3-PERF-006] .lean() + indexes sur les requêtes MongoDB
├── [P3-PERF-007] Token dynamique dans useAPI.js
└── [P2-ARCH-006] Migration uploads vers CDN/S3

SEMAINE 7 — NORMALE
├── [P4-UX-001]   Supprimer le blocage clic-droit / F12
├── [P4-META-001] Minimum bid increment
└── [P4-META-002] Standardiser les erreurs frontend

SEMAINE 8-9 — DETTE TECHNIQUE
├── [P5-TEST-001] Framework de tests (Jest + Supertest)
├── [P5-TEST-002] Pipeline CI/CD avec checks de sécurité
├── [P5-QUAL-001] Introduction TypeScript
└── [P5-QUAL-002] Logs structurés (Winston)
```

---

## ESTIMATION DE L'EFFORT

| Phase | Effort estimé | Profil recommandé |
|---|:---:|---|
| Phase 0 (Urgences) | 2-3 jours | Senior Backend |
| Phase 1 (Sécurité) | 5-7 jours | Senior Backend + Security |
| Phase 2 (Architecture) | 8-10 jours | Senior Fullstack |
| Phase 3 (Performance) | 7-9 jours | Senior Backend |
| Phase 4 (UX/Métier) | 3-4 jours | Fullstack |
| Phase 5 (Tests/Qualité) | 8-10 jours | Senior + QA |
| **TOTAL** | **33-43 jours** | |

---

*Document mis à jour le 5 mars 2026 — Audit terminé (7.9/10) + Migration Supabase planifiée*

---

## MIGRATION SUPABASE (Mars 2026)

> Urgence : VPS Hostinger expire le **19 mars 2026**. Migration à effectuer avant cette date.
> Détail complet : `kucibok/docs/MIGRATION_SUPABASE.md`

### Contexte
- **Score actuel :** 7.9/10 (toutes phases audit terminées)
- **Architecture actuelle :** Vercel (React) → VPS Hostinger (Express + PM2) → MongoDB Atlas + Cloudinary + Redis
- **Architecture cible :** Vercel (React + Functions) → Supabase (Auth + Storage + PostgreSQL)
- **Gain :** ~20-50€/mois → 0€/mois (free tier)

### [M0] Setup (IMMÉDIAT — avant 19 mars)

```
[ ] Renouveler VPS Hostinger (1 mois minimum — sécurité pendant la migration)
[ ] Créer projet Supabase (gratuit)
[ ] Configurer Google OAuth dans Supabase dashboard
[ ] Créer buckets Storage : artworks (public), profiles (public), certificates (privé), blogs (public)
[ ] Créer kucibok/src/lib/supabase.js (client singleton)
[ ] Ajouter VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY dans kucibok/.env.exemple
```

### [M1] Auth + Storage (semaine 1)

```
[ ] Supabase Auth : register / login / Google OAuth / forgot password
[ ] Refaire store/AuthContext.jsx avec supabase.auth.onAuthStateChange()
[ ] Refaire src/api/useAuth.js avec supabase.auth.*
[ ] Upload images : multer → supabase.storage (artworks, profiles)
[ ] Supprimer packages : @metamask/sdk, jwt-decode, socket.io-client, react-hot-toast
[ ] Ajouter package : @supabase/supabase-js
[ ] Tester register/login/upload en dev sans toucher prod
```

### [M2] Base de données PostgreSQL (semaine 1-2)

```
[ ] Créer les 34 tables dans Supabase (schéma dans MIGRATION_SUPABASE.md)
[ ] Configurer RLS (Row Level Security) sur chaque table
[ ] Script export MongoDB Atlas → JSON (mongoexport)
[ ] Script transformation JSON MongoDB → format Supabase
[ ] Import données de test dans Supabase (pas la prod)
[ ] Migrer controllers Mongoose → @supabase/supabase-js
[ ] Tester tous les endpoints avec les nouvelles tables
```

### [M3] Vercel Functions (semaine 2-3)

```
[ ] Créer kucibok/api/ — structure complète des routes
[ ] artworks/ (index.js, [id].js, catalogue.js, verify/[id].js)
[ ] auth/ (register.js, login.js, logout.js, forgot-password.js, reset-password.js)
[ ] delivery/ (index.js, [id].js, track/[id].js)
[ ] payments/ (paydunya-init.js, paydunya-callback.js)
[ ] sourcing/ (index.js, [id].js)
[ ] campaigns/ (index.js, [id].js, send.js)
[ ] certificates/generate.js — pdfkit (remplace html-pdf-node)
[ ] Configurer cron jobs : Supabase pg_cron (subscriptions, auctions)
[ ] Tests complets en dev (tous les flows)
```

### [M4] Migration production (semaine 3-4)

```
[ ] Snapshot MongoDB Atlas (backup obligatoire avant toute action)
[ ] Exporter users MongoDB → Supabase Auth (bcrypt supporté — zéro perte de mot de passe)
[ ] Migrer données production → Supabase PostgreSQL
[ ] Migrer images Cloudinary → Supabase Storage (script batch)
[ ] Basculer Vercel vers nouvelles Vercel Functions
[ ] Vérifier chaque fonctionnalité en prod (checklist complète)
[ ] Surveiller 1 semaine avant de couper VPS + Atlas + Cloudinary
```

### Packages supprimés post-migration
```
Backend entier (backend/) — plus de VPS Express
mongoose, jsonwebtoken, bcryptjs, ioredis, cloudinary, ethers, @metamask/sdk, nodemailer
Frontend : @metamask/sdk, jwt-decode, dotenv, socket.io-client, react-hot-toast
```

### Packages ajoutés post-migration
```
@supabase/supabase-js (frontend + Vercel Functions)
pdfkit (Vercel Function certificates — remplace html-pdf-node)
```
