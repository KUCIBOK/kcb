# KUCIBOK — Roadmap

**Version** 2.2 — Mars 2026
**Horizon** 24 mois (Mars 2026 -> Mars 2028)
**Aligne sur** PRD V2.2 · TECH_SPEC V2.1

---

## PRINCIPES

- **Focus > Volume** : chaque phase a un objectif unique et mesurable
- **Standard d'abord** : pas de feature de liquidite avant validation du standard
- **Corridor unique** : AF Ouest <-> France avant toute extension
- **Pas de sprints fixes** : milestones par phase, iterations libres

---

## VUE MACRO

```
PHASE 0       PHASE 1        PHASE 2           PHASE 3            PHASE 4
Mar 2026      Avr-Sep 2026   Oct 2026-Mar 2027 Avr-Sep 2027       Oct 2027-Mar 2028
──────────    ────────────   ─────────────────  ─────────────────  ─────────────────
Migration &   Standard       Corridor           Reconnaissance     Scale &
Nettoyage     Minimal        Operationnel       Institutionnelle   Extension
              Viable
```

---

## PHASE 0 — MIGRATION & NETTOYAGE (Mars 2026)

> Bascule production depuis VPS Hostinger/MongoDB vers Supabase/Vercel. Deadline : **19 mars 2026** (expiration VPS).

### Migration Supabase (M1-M4)

| Etape | Description | Statut |
|-------|-------------|--------|
| M1 — Auth + Storage | Supabase Auth configure, buckets Storage crees | Done |
| M2 — Schema PostgreSQL | 34 tables + RLS + triggers + index | Done |
| M3 — Vercel Functions | API catch-all deployee et testee | Done |
| M4 — Bascule production | Migration donnees + images + coupure VPS | En attente |

### Procedure M4 (voir `docs/RUNBOOK_M4.md`)

- [ ] Backup MongoDB Atlas + Cloudinary
- [ ] Migration utilisateurs (`scripts/migrate_users_auth.js`)
- [ ] Migration donnees par collection (`scripts/migrate_mongodb.js`)
- [ ] Migration images (`scripts/migrate_cloudinary.js`)
- [ ] Deploiement Vercel Functions en production
- [ ] Tests fonctionnels manuels (auth, oeuvres, paiements, tracking)
- [ ] Emails reinitialisation mot de passe aux utilisateurs
- [ ] Surveillance 1 semaine
- [ ] Coupure VPS + Atlas + Cloudinary

### Nettoyage technique

- [x] ~~Supprimer `socket.io-client`~~ — garde (utilise par encheres Phase 3)
- [x] Supprimer deps inutiles du package.json (dotenv, classnames, react-countdown, qrcode, react-intersection-observer, resend)
- [x] Corriger import `setVisitTime` manquant dans App.jsx
- [x] Configurer ESLint + Prettier
- [x] Supprimer `pdfkit` et `resend` du frontend (deps serveur uniquement)
- [x] Vitest + Testing Library : setup initial (smoke test)
- [ ] Repo nettoye : backend/, frontend/ supprimes, structure plate

### Refonte frontend (design system landing)

- [x] Refonte pages portail : Gateway, Africa, Global (PortalLayout, RevealOnScroll, SectionLabel, GeoLine)
- [x] Refonte About, Contact, Faq avec PortalLayout theme or
- [x] Refonte 4 pages legales (PrivacyPolicy, TermsAndConditions, SalesConditions, EthicChart) avec PortalLayout
- [x] Polish pages browsing : Marketplace, Blog, Artists, BlogPostDetails, Artist, Artwork (RevealOnScroll + SectionLabel)
- [x] Polish pages transactionnelles : checkout, success/failed, tracking (RevealOnScroll)
- [x] Polish pages auth : SignIn, SignUp, ForgotPassword, VerifyEmail, CheckEmail, GoogleRoleSelection (RevealOnScroll + font-playfair)
- [x] Explore : RevealOnScroll + SectionLabel header
- [x] Routes standalone hors Layout : About, Contact, Faq, 4 legales (PortalLayout avec propre nav/footer)

### Audit UX/UI complet (Mars 2026)

- [x] P0 — Bugs fonctionnels (7 items) : typos CSS (`pp-2`, double opacite), `Link to={-1}` → `navigate(-1)`, liens morts `/explore` → `/africa/catalogue`, `useId()` pour inputs
- [x] P1 — Couleurs bannies purgees (18 items) : violet, orange, gradients → tokens KCB (or, bronze, ardoise)
- [x] P2 — Typographie + radius (20 items) : `font-serif` → `font-playfair`, `rounded-md/lg` → `rounded-[4px]`, liens morts `/dashboard/buyer`
- [x] P3 — Accessibilite (11 items) : ARIA `role="dialog"`, `aria-expanded`, focus trap Modal, keyboard nav Select/Tabs, `focus-visible:ring` sidebar, Card keyboard support
- [x] P4 — SEO (6 items) : Helmet sur Africa/Global landing, `og:image`, `og:type`, canonicals portal-prefixes
- [x] P5 — Polish UX (17 items) : skeletons loading, null guards dates, dead code cleanup, chart colors on-palette, contact form API route, placeholder artwork image

### Refactor roles (collector→buyer, professional→curator)

- [x] Migration `007_role_refactor.sql` : renommage donnees + trigger
- [x] Migration `008_rls_role_refactor.sql` : correction fonction RLS `is_professional()`
- [x] Protected routes : `BuyerProtectedRoute`, `CuratorProtectedRoute`
- [x] Dashboard buyer a `/account`
- [x] Page catalogue Africa : `/africa/catalogue`
- [x] Code frontend : PortalNav, UserLinks, GuestProtectedRoute, admin views, CRM, profils
- [x] Code backend : VALID_ROLES, requireCurator, email templates, IDOR, XSS, ownership checks

### Audit securite (Mars 2026)

- [x] XSS : DOMPurify client + sanitisation serveur (blog comments)
- [x] IDOR : ownership checks transactions et abonnements
- [x] Escalade role : suppression fallback user_metadata dans requireRole
- [x] Oeuvres non-approuvees : cachees aux non-proprietaires/non-admins
- [x] GET → POST : endpoints mutation convertis (fail/activate)
- [x] DoS : remplacement listUsers() par requete ciblee
- [x] SQL injection : echappement wildcards ilike
- [x] Mot de passe : validation longueur minimum 8 caracteres
- [ ] Rate limiting : a implementer (Upstash Redis ou Cloudflare)
- [ ] CSRF tokens : a implementer

### Scorecard Phase 0

| Critere | Cible | Statut |
|---------|-------|--------|
| VPS eteint, Supabase operationnel | 19 mars 2026 | En cours |
| Zero erreur Sentry post-migration | 1 semaine sans incident | Pas commence |
| Repo propre (plus de legacy) | Aucun fichier backend/ ou frontend/ | Done |
| Audit UX/UI (80+ items) | 0 violations design system | Done |
| Accessibilite (ARIA, clavier, contraste) | Composants UI conformes | Done |
| SEO (Helmet, OG tags, canonicals) | Pages publiques couvertes | Done |
| Audit securite (10 correctifs) | 0 vulnerabilite critique | Done |
| Refactor roles (4 roles finaux) | collector→buyer, professional→curator | Done |
| Tests unitaires (Vitest) | 12 fichiers, 299 tests | Done |

---

## PHASE 1 — STANDARD MINIMAL VIABLE (Avr → Sep 2026)

> Lancer le Standard Kucibok. Recruter 20 galeries pilotes. Ouvrir le corridor logistique.

### M1 — Avril 2026 : Standard Kucibok V1

**Backend**
- [ ] Enrichir la table `artworks` : champs Standard obligatoires (provenance detaillee, photos HD min 3, condition)
- [ ] Ameliorer generation certificat PDF (layout institutionnel, QR, numero unique KCB)
- [ ] Endpoint `GET /api/artworks/verify/:kid` : enrichir la reponse publique (images, provenance, historique)
- [ ] Blockchain : validation silencieuse hash ETH a la certification

**Frontend**
- [ ] Refaire `SubmitArtwork.jsx` : formulaire standardise en etapes (donnees -> photos -> provenance -> validation)
- [ ] Enrichir page `/verify/:kuciobkId` : affichage premium du certificat
- [ ] Dashboard Artiste : affichage certificat + QR telechargeables

### M2 — Mai 2026 : Portail Africa V1

**Backend**
- [ ] Nouveau role `gallery_africa` (ajout CHECK constraint + dashboard)
- [ ] Onboarding galeries : validation manuelle admin
- [ ] Endpoint import CSV oeuvres batch

**Frontend**
- [x] Refonte `AfricaLanding.jsx` : positionnement institutionnel
- [ ] Flow onboarding galeries (4 etapes : profil -> catalogue -> validation -> activation)
- [ ] Dashboard galerie : inventaire + statuts certification

### M3 — Juin 2026 : Logistique V1

**Backend**
- [ ] Workflow standardise delivery_requests : 9 statuts
- [ ] Generation documents douaniers export (PDF)
- [ ] Assurance integree : calcul prime selon valeur certifiee
- [ ] Notifications email Resend a chaque changement de statut

**Frontend**
- [ ] Refonte `DeliveryTab` : timeline visuelle des statuts
- [ ] `TrackingPage.jsx` : tracking enrichi sans compte
- [ ] Checklist emballage museal interactive
- [ ] Simulateur cout logistique enrichi

### M4 — Juillet 2026 : Portail Global V1

**Backend**
- [ ] Nouveaux roles `gallery_global` (curator existe deja)
- [ ] Onboarding international : validation + abonnement payant
- [ ] Catalogue certifie : endpoint filtrable (acces restreint)
- [ ] Systeme demande sourcing privee (anonymisee)
- [ ] Paiements Global via PayDunya (abonnements internationaux)

**Frontend**
- [x] Refonte `GlobalPage.jsx` : landing institutionnelle EN
- [ ] Page catalogue certifie (acces sur approbation)
- [ ] Flow sourcing : demande -> mise en relation -> suivi
- [ ] Page pricing Global (Starter EUR 79 / Pro EUR 149 / Institution EUR 299)

### M5-M6 — Aout/Sep 2026 : Pilotes & Validation

- [ ] Onboarding 20 galeries pilotes (SN + CI)
- [ ] 5 partenaires France actifs
- [ ] 100 premieres oeuvres certifiees
- [ ] 10 premieres expeditions AF <-> France
- [ ] Collecte feedback pilotes -> iterations

### Scorecard Phase 1

| Critere | Cible | Statut |
|---------|-------|--------|
| Galeries africaines actives | 20 | — |
| Oeuvres certifiees | 100 | — |
| Expeditions realisees | 10 | — |
| Partenaires France actifs | 5 | — |
| MRR | EUR 2K+ | — |
| Tests automatises (Vitest) | Couverture business logic | — |

---

## PHASE 2 — CORRIDOR OPERATIONNEL (Oct 2026 → Mar 2027)

> Prouver que le corridor fonctionne a l'echelle. Premieres transactions structurees.

### Oct-Nov 2026 : Extension Afrique

- [ ] Onboarding Benin + Nigeria (galeries structurees)
- [ ] Adaptation documents douaniers Nigeria
- [ ] Portail Africa bilingue FR/EN complet
- [ ] Passeport NFC V1 : lecture/ecriture puce NFC oeuvres haute valeur

### Dec 2026 - Jan 2027 : Catalogue & Sourcing

- [ ] 500+ oeuvres certifiees
- [ ] Moteur de recherche catalogue ameliore (filtres avances)
- [ ] Profils artistes publics premium
- [ ] Mise en relation structuree (Kucibok orchestre)
- [ ] Dashboard analytics galeries : vues, demandes sourcing, expeditions

### Fev-Mar 2027 : Transactions structurees

- [ ] 5 galeries France sur abonnement payant
- [ ] Module transaction privee B2B
- [ ] Commission automatique sur transactions (5-10%)
- [ ] Contrats de vente generes automatiquement (PDF signable)
- [ ] 50 expeditions cumulees

### Refactoring technique Phase 2

- [ ] Migrer Context providers lourds vers React Query
- [ ] Decouper `api/[...path].js` en modules internes
- [ ] Ajouter tests d'integration API (Vitest)
- [ ] Evaluer Zustand pour state UI globale

### Scorecard Phase 2

| Critere | Cible | Statut |
|---------|-------|--------|
| Oeuvres certifiees | 500 | — |
| Expeditions cumulees | 50 | — |
| Clients Global payants | 10 | — |
| MRR | EUR 8K | — |
| 1ere transaction structuree >EUR 5K | Oui | — |
| React Query migre (3 contexts) | Oui | — |

---

## PHASE 3 — RECONNAISSANCE INSTITUTIONNELLE (Avr → Sep 2027)

> Faire reconnaitre le Standard Kucibok par le marche institutionnel.

### Avr-Mai 2027 : Dossier institutionnel

- [ ] Export certificats format assureurs (Allianz Art, AXA Art)
- [ ] Validation experte integree : circuit expert certifie Kucibok
- [ ] Rapport patrimonial exportable (PDF assureurs, banques, heritiers)
- [ ] Audit securite complet (pentest externe)
- [ ] RGPD compliance complete + DPA clients UE

### Juin-Juil 2027 : Extension Europe

- [ ] Corridor Belgique actif (Bruxelles)
- [ ] Documents douaniers UE standardises
- [ ] 2-3 galeries belges partenaires
- [ ] Preparation corridor UK (post-Brexit)

### Aout-Sep 2027 : Partenariats

- [ ] Signature partenariat assureur (1 acteur majeur)
- [ ] Integration catalogue dans 1 maison de vente
- [ ] Refonte design institutionnel (palette noir/ivoire/or — `docs/DESIGN_SYSTEM.md`)
- [ ] Migration routing vers sous-domaines (africa.kucibok.com / global.kucibok.com)
- [ ] Reactivation encheres (si pertinent)

### Scorecard Phase 3

| Critere | Cible | Statut |
|---------|-------|--------|
| 1 assureur partenaire officiel | Oui | — |
| 1 maison de vente partenaire | Oui | — |
| Oeuvres certifiees | 2 000 | — |
| Expeditions cumulees | 200 | — |
| MRR | EUR 20K | — |
| Corridors actifs | 2 (France + Belgique) | — |

---

## PHASE 4 — SCALE & EXTENSION (Oct 2027 → Mar 2028)

> Consolider, etendre, preparer le hub physique.

### Oct-Dec 2027

- [ ] Corridor UK operationnel
- [ ] Analytics avance : valorisation collection, tendances marche
- [ ] API publique Kucibok (integrations galeries tierces)
- [ ] Application mobile native (React Native)

### Jan-Mar 2028

- [ ] 5 000 oeuvres certifiees
- [ ] 500+ expeditions cumulees
- [ ] Etude de faisabilite hub physique (Dakar / Abidjan)
- [ ] Preparation levee de fonds Serie A

### Scorecard Phase 4

| Critere | Cible | Statut |
|---------|-------|--------|
| Standard reconnu internationalement | Oui | — |
| Corridors EU actifs | 3 (France + Belgique + UK) | — |
| MRR | EUR 25K+ | — |
| Hub physique : etude faisabilite | Complete | — |
| Serie A : dossier pret | Oui | — |

---

## DETTE TECHNIQUE — SUIVI

| Item | Phase cible | Statut |
|------|-------------|--------|
| Supprimer deps inutiles (dotenv, classnames, etc.) | 0 | Done |
| Configurer ESLint + Prettier | 0 | Done |
| Corriger `setVisitTime` non importe | 0 | Done |
| Supprimer `pdfkit` + `resend` du frontend | 0 | Done |
| Vitest + Testing Library : setup initial | 0 | Done |
| Audit UX/UI complet (80+ corrections) | 0 | Done |
| Accessibilite composants UI (ARIA, clavier) | 0 | Done |
| SEO pages publiques (Helmet, OG tags) | 0 | Done |
| Route `/api/contact` (formulaire → Resend) | 0 | Done |
| Roles buyer + curator + protected routes | 0 | Done |
| Audit securite (XSS, IDOR, escalade) | 0 | Done |
| Migration 007 + 008 (roles SQL) | 0 | A appliquer en production |
| ~~Ecrire tests unitaires : hooks API, utils, stores~~ | 0 | Done (12 fichiers, 299 tests) |
| Ecrire tests composants : pages critiques (auth, checkout) | 1 | A faire |
| Migrer Context providers -> React Query | 2 | A faire |
| Decouper `api/[...path].js` en modules | 2 | A faire |
| Evaluer Zustand pour state UI | 2 | A faire |

---

*Kucibok ROADMAP V2.2 — Mars 2026 — Confidentiel*
