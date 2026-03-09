# KUCIBOK — TECHSPEC.md
**Version** 1.0 — Mars 2026
**Aligne sur** PRD V2 · Codebase existante auditee
**Langue** FR/EN — Confidentiel

---

## 1. STACK ACTUEL — INVENTAIRE

### Frontend
| Composant | Technologie | Statut |
|-----------|-------------|--------|
| Framework | React 18 + Vite | Stable |
| Routing | React Router v7 | Stable |
| Styling | TailwindCSS 4 | Stable |
| State | 15 Context providers | A refactoriser |
| Build/Deploy | Vercel (pret) | Migration imminente |

### Backend
| Composant | Technologie | Statut |
|-----------|-------------|--------|
| Runtime | Node.js + Express | Stable |
| Base de donnees | MongoDB + Mongoose | Stable |
| Auth | JWT + Google OAuth + MetaMask | Stable |
| Emails | Resend SDK (+ legacy SMTP) | Nettoyer legacy |
| Paiements AF | PayDunya | Stable |
| Paiements EU | — | A integrer Phase 2 |
| Logistique | Logidoo API | Stable |
| Blockchain | Ethereum (wallets AES-256-GCM) | Stable |
| Storage | VPS local /public/uploads | Migrer Cloudinary |
| Cron jobs | node-cron (5 actifs) | Stable — garder VPS |
| Hebergement | VPS Hostinger | Garder pour backend |

---

## 2. DECISIONS D'INFRASTRUCTURE

### Frontend : Migration Vercel
Le vercel.json est deja present et configure. Migration directe.

Actions :
- Connecter repo GitHub a Vercel
- Configurer variables d'environnement (VITE_API_URL, etc.)
- Configurer domaines : africa.kucibok.com + global.kucibok.com

### Backend : Garder VPS Hostinger

Pourquoi NE PAS migrer sur Vercel :
- Vercel = serverless = process ephemere = cron impossible
- auctionCronJob.js s'execute chaque minute
- subscriptions.job.js s'execute a minuit
- generateCertificates.js : job continu
- logidooSyncJob.js : sync livraisons

Alternative future si scaling : Railway ou Render.

### Storage : Migration Cloudinary (Phase 1 prioritaire)

Probleme actuel : images sur /public/uploads du VPS = risque perte si crash.

Solution : Cloudinary
- Modifier multer.js pour uploader directement sur Cloudinary
- CDN automatique + transformations image a la volee
- Dossier structure : kucibok/artworks, kucibok/certificates, kucibok/profiles

---

## 3. ARCHITECTURE CORE UNIQUE — 2 INTERFACES

### Strategie de Routing Multi-Portail

Un seul deploiement Vercel, deux routes, deux experiences.

Routing par chemin dans Router.jsx (decision Mars 2026) :
  /africa   -> portail Afrique (AfricaLanding.jsx)
  /global   -> portail Global (GlobalPage.jsx)
  /         -> redirect /africa

Note : detection par hostname (africa./global.) reportee a Phase 3 quand les sous-domaines
       seront configures en production. Le routing par routes facilite le dev local.

### Structure de Routes

kucibok.com/africa             -> AfricaLanding.jsx
kucibok.com/africa/dashboard   -> Dashboard artiste/galerie_africa
kucibok.com/global             -> GlobalPage.jsx
kucibok.com/global/catalogue   -> CatalogueCertifie.jsx (nouveau)
kucibok.com/global/sourcing    -> SourcingRequest.jsx (nouveau)
kucibok.com/global/dashboard   -> Dashboard curator/gallery_global
kucibok.com/verify/:id         -> VerifyPage.jsx (public, sans auth)

### Encheres
Le module encheres (Auction, Bid controllers + routes + pages frontend) est conserve mais masque :
- Pages /auctions et /auction/:id absentes du nav public
- Code backend intact — reactivation possible Phase 3

---

## 4. MODELES DE DONNEES — PRIORITES V1

### Artwork.js — Champs Standard Kucibok a ajouter

Nouveaux champs obligatoires :
- kcbStandardVersion : String, default '1.0'
- kcbId : String unique (format KCB-XXXX-XXXX-XXXX)
- kcbCertifiedAt : Date
- kcbCertificateUrl : String (URL PDF)
- kcbQrCode : String (URL QR)
- kcbBlockchainTxHash : String (hash ETH — invisible front)
- kcbNftTokenId : String

Provenance (obligatoire pour certification) :
- acquisitionDate, acquisitionPlace
- previousOwners : Array
- exhibitionHistory : Array

Photos HD (min 3 requises) :
- url, angle (front/back/detail/signature/other), uploadedAt

Statut circulation :
- circulationStatus : available / in_transit / on_loan / sold / unavailable

Visibilite catalogue Global :
- visibleOnGlobal : Boolean, default false
- globalApprovedAt : Date

### DeliveryRequest.js — Workflow Standardise

Statuts (9 etats) :
draft -> confirmed -> packaging -> pickup_ready -> in_transit
-> customs_export -> customs_import -> out_for_delivery -> delivered
+ incident (etat special)

Nouveaux champs :
- documents : Array (customs_export, customs_import, proforma, cites, insurance)
- insurance : provider, policyNumber, coveredValue, currency
- corridor : originCountry, destinationCountry, isTranscontinental

---

## 5. NOUVELLES ROUTES API

### Standard et Certification
GET  /api/artwork/:id/verify          Public sans auth — donnees certificat
POST /api/artwork/:id/certify         Admin/Expert — declenche certification
GET  /api/artwork/:id/certificate     Telechargement PDF
POST /api/artwork/import              Import CSV batch galeries
GET  /api/artwork/catalogue/global    Catalogue certifie (auth curator_global)

### Logistique
POST /api/delivery                    Creer demande expedition
GET  /api/delivery/:id/track          Public tracking (token unique)
POST /api/delivery/:id/status         Mise a jour statut
GET  /api/delivery/:id/documents      Documents generes
POST /api/delivery/:id/generate-docs  Generer documents douaniers
GET  /api/delivery/simulate-cost      Simulateur cout (from, to, value)

### Sourcing Global
POST /api/sourcing/request            Demande sourcing privee
GET  /api/sourcing/requests           Lister ses demandes
PUT  /api/sourcing/:id/respond        Repondre a une demande

### Portail et Roles
POST /api/onboarding/gallery-africa   Candidature galerie africaine
POST /api/onboarding/global           Candidature portail global
GET  /api/admin/onboarding/pending    Candidatures en attente (admin)
PUT  /api/admin/onboarding/:id/approve Approuver candidature

---

## 6. SECURITE — POINTS CRITIQUES

### Existant a conserver
- JWT Auth + requireRole() dans middleware/auth.js : BON
- AES-256-GCM wallets ETH dans utils/encryption.js : BON
- Validation API key dans middleware/api.js : BON
- rateLimiter.service.js : ACTIVER sur toutes routes publiques

### Nouveaux roles JWT
Existants : admin, artist, collector, professional
Nouveaux : gallery_africa, curator_global, gallery_global, expert

### Actions securite Phase 0
1. Activer rate limiting sur /api/ dans index.js
2. Rate limit strict sur /verify/:id (100 req/min max)
3. Audit environnement.js — aucune var sensible avec prefix VITE_

---

## 7. REFACTORING STATE MANAGEMENT

Probleme : 15 Context providers = re-renders en cascade.

Migration progressive (ne pas casser l'existant) :
- Phase 0-1 : Garder les Contexts existants
- Phase 2 : Migrer Contexts lourds vers React Query (@tanstack/react-query)
  Priorite : useArtworks, useDelivery, useSubscriptions
- Phase 3 : Evaluer Zustand pour state UI globale

---

## 8. PAIEMENTS — PHASE 2 : STRIPE

Ajouter stripe.service.js pour abonnements portail Global.
PayDunya reste pour tout paiement Afrique.

Plans Stripe :
- starter_monthly : 79 EUR/mois
- pro_monthly : 149 EUR/mois
- institution_monthly : 299 EUR/mois

Webhook Stripe -> subscription.controller.js pour activer/desactiver.

---

## 9. MONITORING ET OBSERVABILITE

Existant :
- Winston logger avec fichiers rotatifs : BON
- Cron jobs sans monitoring externe : RISQUE

A ajouter Phase 1 :
- Wrapper try/catch sur chaque cron job avec alerte email Resend si echec
- Sentry pour erreurs frontend (Sentry React) et backend (Sentry Node)
- Variables : VITE_SENTRY_DSN (front) + SENTRY_DSN (back)

---

## 10. CHECKLIST TECHNIQUE PAR PHASE

### Phase 0 (Mars 2026)
- Supprimer legacy mailerConfig, smtpMailer, upload.js
- Desactiver proprement analyticsCollectionJob
- Activer rate limiting global
- Migrer frontend sur Vercel
- Configurer domaines africa. et global.
- Migrer uploads vers Cloudinary
- Ajouter monitoring cron jobs

### Phase 1 (Avr-Sep 2026)
- Champs Standard Kucibok dans Artwork.js
- Route GET /verify/:id publique
- Certificat PDF template institutionnel
- Nouveaux roles JWT (gallery_africa, curator_global)
- Workflow logistique 9 statuts
- Generation documents douaniers automatique
- Stripe integration abonnements Global

### Phase 2 (Oct 2026-Mar 2027)
- React Query migration (Contexts lourds)
- API publique catalogue certifie
- Passeport NFC backend
- Sourcing request system
- Commission automatique sur transactions

---

*Kucibok TECHSPEC.md V1 — Mars 2026 — Confidentiel*
