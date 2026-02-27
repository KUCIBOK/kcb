# ROADMAP KUCIBOK — Audit Complet & Plan de Remédiation

**Version:** 1.8 | **Date:** 27 février 2026 | **Statut:** Phase 0 ✅ Phase 1 ✅ — Phase 2/3 en cours

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

### [P0-SEC-001] 🔴 Rotation immédiate de TOUS les secrets compromis
- [~] **Statut :** Partiel — `.gitignore` et `.env.exemple` nettoyés ✅ — Rotation dans les services externes à faire manuellement
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
- [ ] **Statut :** À faire
- **Fichiers :** `backend/index.js:122-203`
- **Actions :**
  1. Extraire en `backend/routes/dev.routes.js`
  2. Enregistrer uniquement si `config.nodeEnv === 'development'`
  3. Test CI : en production, `GET /api/auth/login-bypass` doit retourner 404

---

### [P2-ARCH-004] 🟡 Activer et configurer Redis
- [ ] **Statut :** À faire
- **Fichiers :** `backend/config/environnement.js:26-28`
- **Problème :** Redis configuré mais jamais utilisé.
- **Usages cibles :**
  - Cache `GET /api/artworks` (TTL 5 min)
  - Cache profils artistes
  - Blacklist JWT (tokens révoqués)
  - Rate-limiting distribué

---

### [P2-ARCH-005] 🟡 Standardiser la gestion des erreurs async (Express 5)
- [ ] **Statut :** À faire
- **Fichiers :** Tous les controllers
- **Note :** Express 5 gère nativement les rejets de promesses. Standardiser autour de `middleware/errorHandler.js` existant.
- **Actions :**
  1. Créer un wrapper `asyncHandler(fn)` ou utiliser directement Express 5 async
  2. Supprimer les `console.error` dans les catch (laisser l'error handler centralisé)

---

### [P2-ARCH-006] 🟡 Migrer les uploads vers un CDN/S3
- [ ] **Statut :** À faire
- **Fichiers :** `backend/middleware/multer.js`
- **Problème :** Stockage local non scalable, perte au redéploiement.
- **Actions :**
  1. Intégrer `multer-s3` ou Cloudflare R2
  2. Configurer un CDN devant le bucket
  3. Migrer les fichiers existants de `public/uploads/`

---

### [P2-ARCH-007] 🟡 Traiter les routes commentées
- [ ] **Statut :** À faire
- **Fichiers :** `backend/index.js:51-53` (CRM, support tickets, analytics)
- **Actions :**
  1. Auditer chaque module : utilisable ou non ?
  2. Si oui → activer et tester
  3. Si non → supprimer les fichiers (controller, model, routes)

---

### [P2-ARCH-008] 🟢 Réarchitecturer les tokens JWT
- [x] **Statut :** Partiellement complet (26 fév 2026) — access 1h + refresh 30j implémentés
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
- [ ] **Statut :** À faire
- **Fichiers :** `backend/jobs/auctionCronJob.js:43`
- **Problème :** Tourne toutes les minutes même sans enchères actives.
- **Actions :**
  1. Vérification rapide préalable : `const hasActive = await Auction.exists({ status: { $in: ['upcoming', 'ongoing'] } })`
  2. Réduire la fréquence à `*/5 * * * *`
  3. Ajouter des index sur `{ status: 1, startTime: 1 }` et `{ status: 1, endTime: 1 }` dans le modèle `Auction`

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
- [ ] **Statut :** À faire
- **Fichiers :** `backend/controllers/auction.controller.js:96-115`
- **Actions :**
  1. Ajouter `.lean()` sur toutes les requêtes de liste en lecture seule (gain x5-10)
  2. Remplacer les `.populate()` multiples par des aggregations `$lookup` quand possible
  3. Vérifier la présence des indexes sur les `ref` fields

---

### [P3-PERF-007] 🟢 Corriger la lecture statique du token dans useAPI.js
- [x] **Statut :** Complet (26 fév 2026)
- **Réalisé :** `useAPI.js` — `get options()` getter ES6 : token lu dynamiquement à chaque accès (jamais à l'init du module).

---

## PHASE 4 — UX/UI ET LOGIQUE MÉTIER (Semaine 7)

### [P4-UX-001] 🔵 Supprimer le blocage du clic-droit et F12
- [ ] **Statut :** À faire
- **Fichiers :** `frontend/src/App.jsx:13-50`
- **Problème :** Bloque les utilisateurs légitimes, casse l'accessibilité, hostile à l'UX. N'empêche pas la copie.
- **Action :** Supprimer les handlers `handleContextMenu` et `handleKeyDown`. Protéger les images avec des watermarks et URLs signées côté serveur.

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

### [P4-META-002] 🔵 Standardiser la gestion des erreurs frontend
- [ ] **Statut :** À faire
- **Fichiers :** `frontend/src/api/*.js`
- **Problème :** Mix de patterns : `{ error }`, exceptions, `null`.
- **Actions :**
  1. Définir un type uniforme : `{ data?, error?, status }`
  2. Créer un hook `useApiCall<T>` avec loading/error/data
  3. Centraliser les messages d'erreur dans des constantes

---

## PHASE 5 — TESTS ET QUALITÉ CODE (Semaine 8-9)

### [P5-TEST-001] ⚪ Mettre en place un framework de tests
- [ ] **Statut :** À faire
- **Fichiers :** `backend/package.json:18` — `"test": "echo \"Error: no test specified\""`, dossier `backend/tests/`
- **Actions :**
  1. Installer `jest` + `supertest` pour les tests d'intégration API
  2. Configurer `jest` avec couverture de code (`--coverage`)
  3. **Priorités de tests :**
     - Tests sécurité : endpoints bypass retournent 404 en production
     - Tests payment : flux complet achat/abonnement
     - Tests race condition : simuler deux enchères simultanées
     - Tests auth : accès non autorisé → 401/403
  4. Objectif minimum : **60% de couverture** sur `auth`, `payment`, `bid`

---

### [P5-TEST-002] ⚪ Mettre en place un pipeline CI/CD avec checks de sécurité
- [ ] **Statut :** À faire
- **Actions :**
  1. Créer `.github/workflows/ci.yml`
  2. Checks obligatoires à chaque PR :
     - `npm test`
     - `npm audit`
     - `eslint` avec `eslint-plugin-security`
     - Detection de secrets : `gitleaks` pour prévenir les futurs leaks
  3. Bloquer le merge si un check échoue

---

### [P5-QUAL-001] ⚪ Introduire TypeScript progressivement
- [ ] **Statut :** À faire
- **Plan d'adoption :**
  1. Commencer par les modèles Mongoose (`models/*.ts`) — ROI le plus élevé
  2. Typer les controllers par ordre de criticité : `auth`, `payment`, `bid`
  3. Configurer `tsconfig.json` avec `strict: true`

---

### [P5-QUAL-002] ⚪ Standardiser la configuration des logs
- [ ] **Statut :** À faire
- **Actions :**
  1. Installer `winston` avec transports Console (dev) + File (prod) + Sentry (déjà installé)
  2. Format JSON structuré en production
  3. Ajouter un `X-Request-ID` traçable dans tous les logs
  4. Supprimer les 200+ `console.log` identifiés dans le code

---

## SCORECARD — ÉTAT ACTUEL vs CIBLE

| Domaine | Score Actuel | Score Cible | Principales actions |
|---|:---:|:---:|---|
| **Sécurité — Secrets** | 0/10 | 9/10 | P0-SEC-001 |
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

*Document généré le 19 février 2026 — À mettre à jour au fil des corrections*
