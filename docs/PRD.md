# KUCIBOK — Product Requirements Document

**Version** 2.1 — Mars 2026
**Auteur** Moctar Sidibe
**Statut** Actif
**Horizon** 24 mois (Mars 2026 → Mars 2028)

---

## 1. POSITIONNEMENT

### Definition

> **Kucibok est l'infrastructure digitale de standardisation et de circulation securisee de l'art africain.**

Kucibok est trois choses :

1. Le **standard de tracabilite** de l'oeuvre africaine (certification, provenance, identifiant unique KCB-XXXXXXXX)
2. L'**operateur logistique certifie** du corridor Afrique de l'Ouest <-> Europe
3. La **couche de confiance** entre acteurs africains et marche international

### Ce que Kucibok n'est PAS

- Une marketplace grand public
- Un SaaS generaliste de gestion d'art
- Une plateforme NFT / Web3 visible
- Un outil CRM complexe

### Principe central

La valeur reside dans la **qualite du standard** et la **fiabilite de la circulation**, pas dans le volume de transactions. Un nombre limite d'oeuvres certifiees et bien circulees vaut mieux que des milliers d'oeuvres non verifiees.

---

## 2. PROBLEME & OPPORTUNITE

### Chaine de valeur brisee

| Acteur | Douleur | Impact |
|--------|---------|--------|
| **Artiste africain** | Pas de documentation standardisee | Invisibilite internationale, contrefacon |
| **Galerie africaine** | 10-15h/semaine en admin | Cout operationnel, blocage export |
| **Curateur international** | Sourcing opaque, provenance non verifiable | Refus institutionnel, risque juridique |
| **Galerie internationale** | Pas de partenaire logistique fiable en Afrique | Deals non conclus, oeuvres bloquees |
| **Assureur / Institution** | Pas de standard reconnu | Impossibilite d'assurer ou d'exposer |

### Opportunite

- Marche art africain : **EUR 1.7B**, croissance +6.2%/an
- Interet institutionnel international en hausse
- Aucun acteur ne couvre certification + logistique transcontinentale
- **Traction prouvee** : EUR 300K GMV, 1 721 artistes, EUR 2.2K MRR, LTV:CAC 8.9:1

### Experience utilisateur — Landing pages

| Page | Audience | Objectif |
|------|----------|----------|
| **Gateway** (`/`) | Tout visiteur | Orienter vers le bon portail (Africa ou Global) |
| **Portail Afrique** (`/africa`) | Artistes, galeries AF | Convaincre de certifier + creer un compte |
| **Portail Global** (`/global`) | Collectionneurs, galeries EU | Montrer le catalogue + pricing + logistique |

---

## 3. ARCHITECTURE PRODUIT

### Core unique, 2 interfaces

Un seul backend, une seule base de donnees, deux experiences utilisateur.

```
KUCIBOK CORE
├── Standard Layer                 Orchestration Layer
│   ├── Certification              ├── Logistique internationale
│   ├── Documentation              ├── Assurance integree
│   ├── Provenance                 ├── Suivi des mouvements
│   ├── Passeport oeuvre           ├── Documentation douaniere
│   └── Blockchain (invisible)     └── Partenaires valides
│
├── / — Gateway                    Point d'entree split-screen
│   ├── Vers /africa               (or, Kuzi, FR)
│   └── Vers /global               (argent, carte, EN)
│
├── /africa — Portail Afrique      /global — Portail International
│   ├── Artistes                   ├── Curateurs
│   ├── Galeries locales           ├── Galeries internationales
│   ├── Acces gratuit              ├── Acces payant
│   └── FR prioritaire             └── EN/FR
```

### Decisions d'architecture

| Decision | Choix | Justification |
|----------|-------|---------------|
| Backend | Supabase (PostgreSQL + Auth + Storage) | Migration depuis Express/MongoDB — cout reduit, RLS natif, auth integree |
| API | Vercel Functions (catch-all) | Serverless, 1 fonction unique (limite Hobby plan), meme domaine que le front |
| Interfaces | Routes /africa et /global | UX adaptee par audience, sans gestion de sous-domaines |
| Blockchain | Backend invisible | L'utilisateur voit un certificat, pas une technologie |
| Auth | Supabase Auth (email + Google OAuth) | SSO unifie, un compte = acces aux deux portails |
| Encheres | Masquees (code conserve) | Non prioritaire — reactivation Phase 3 |
| Paiements | PayDunya (AF) + Stripe (EU, Phase 2) | Double corridor monetaire |

---

## 4. UTILISATEURS PRIORITAIRES

### Portail Afrique (/africa)

**Galeries structurees** — client principal
- Galeries etablies 3+ ans, 50-300 oeuvres
- Pays : Senegal, Cote d'Ivoire, Benin, Nigeria
- Valeur : catalogue certifie + acces corridor international

**Artistes professionnels valides** — supply critique
- Production reguliere, ambition internationale
- Validation manuelle a l'onboarding
- Valeur : passeport oeuvre + visibilite sourcing global

**Curateurs africains**
- Intermediaires cles entre artistes et marche international
- Valeur : outil de gestion + mise en relation structuree

### Portail Global (/global)

**Curateurs independants** — client prioritaire
- Bases en France, UK, Belgique
- 2-5 expositions/an, recherchent art africain contemporain
- Valeur : catalogue certifie + logistique cle en main

**Galeries afro-contemporaines** (France prioritaire)
- Galeries specialisees ou avec programme Afrique
- Valeur : reseau galeries africaines certifiees + operateur logistique

**Collectionneurs serieux**
- Budget >EUR 5K par acquisition
- Acces sur invitation ou validation

> **Principe** : chaque utilisateur est valide a l'onboarding. Pas de grand public.

---

## 5. MODULES FONCTIONNELS

### F1 — Standard Kucibok (priorite absolue)

**Objectif** : creer le passeport universel de l'oeuvre africaine.

| Fonctionnalite | Statut |
|----------------|--------|
| Fiche oeuvre standardisee (titre, artiste, medium, dimensions, provenance, photos HD) | Existant |
| Identifiant unique KCB-XXXXXXXX (genere par trigger PostgreSQL) | Existant |
| Certificat PDF securise + QR code de verification | Existant |
| Page publique /verify/:kubicokId (sans auth) | Existant |
| Historique de propriete | Existant |
| Blockchain Ethereum invisible (hash + NFT) | Existant |
| Export assureurs / maisons de vente | Phase 1 |
| Passeport NFC physique | Phase 2 |
| Validation par expert certifie | Phase 3 |

**Critere de succes** : 1 assureur majeur accepte le certificat Kucibok comme reference.

### F2 — Logistique transfrontaliere (priorite 2)

**Corridor prioritaire** : Senegal / Cote d'Ivoire / Benin / Nigeria <-> France

| Fonctionnalite | Statut |
|----------------|--------|
| Demande d'expedition depuis fiche oeuvre | Existant |
| Workflow 9 statuts (draft -> delivered + incident) | Existant |
| Tracking public par lien unique (/tracking/:trackingId) | Existant |
| Partenaire logistique Logidoo API | Existant |
| Simulateur cout logistique | Existant |
| Generation documents douaniers automatique | Phase 1 |
| Assurance integree a la valeur certifiee | Phase 1 |
| Notifications email par statut (Resend) | Phase 1 |
| Suivi GPS avance (>EUR 10K) | Phase 2 |
| Extension corridors Belgique, UK | Phase 3 |

**Critere de succes** : 50 expeditions transcontinentales sans incident majeur.

### F3 — Catalogue certifie / Sourcing B2B (priorite 3)

**Ce n'est pas** une marketplace publique. C'est un outil de sourcing professionnel.

| Fonctionnalite | Statut |
|----------------|--------|
| Catalogue filtrable (pays, artiste, style, prix) | Existant (/catalogue) |
| Acces restreint (validation requise) | Existant (ProfessionalProtectedRoute) |
| Demande de sourcing privee | Existant |
| Mise en relation orchestree | Phase 1 |
| Import CSV batch galeries | Phase 1 |

**Critere de succes** : 10 mises en relation ayant abouti.

---

## 6. MODELE DE REVENUS

### Portail Afrique — Gratuit

Acces gratuit pendant la phase de construction du catalogue certifie. L'objectif est de construire le catalogue qui alimente le portail Global.

### Portail Global — Payant

| Source | Modele | Montant |
|--------|--------|---------|
| Abonnement Starter | Mensuel | EUR 79/mois |
| Abonnement Pro | Mensuel | EUR 149/mois |
| Abonnement Institution | Mensuel | EUR 299/mois |
| Frais logistique | Par expedition | Variable |
| Certification premium | Par oeuvre (expert) | EUR 25-75 |
| Commission transaction | Sur ventes structurees | 5-10% |

### Trajectoire

```
Mois 0-6    : Investissement (structuration Afrique)
Mois 6-12   : Premiers abonnements Global + frais logistique
Mois 12-18  : MRR cible EUR 10K
Mois 18-24  : MRR cible EUR 25K + commissions
```

---

## 7. CORRIDOR STRATEGIQUE

### Phase 1 — AF Ouest → Monde

- Senegal, Cote d'Ivoire, Benin, Nigeria → Europe (Paris, Lyon, Bordeaux, Bruxelles, Londres)

### Phase 2 (Mois 12-24)

- Extension Belgique (Bruxelles) et Royaume-Uni (Londres)

### Hors perimetre 24 mois

- Pas d'Asie, pas d'Afrique de l'Est/Nord, pas d'USA/UAE

---

## 8. KPIs & CRITERES DE SUCCES

### Indicateurs primaires (infrastructure)

| Metrique | Cible 24 mois |
|----------|---------------|
| Valeur oeuvres certifiees | EUR 5M+ |
| Oeuvres circulees via corridor | 200+ |
| Partenaires logistiques valides | 5+ |
| Institutions utilisant le standard | 3+ |

### Indicateurs secondaires (adoption)

| Metrique | 12 mois | 24 mois |
|----------|---------|---------|
| Galeries africaines actives | 20 | 50+ |
| Artistes valides | 200 | 500+ |
| Partenaires France actifs | 5 | 15+ |
| Oeuvres certifiees | 500 | 2 000+ |

### Indicateurs financiers

| Metrique | 12 mois | 24 mois |
|----------|---------|---------|
| MRR | EUR 5K | EUR 25K |
| ARR | EUR 60K | EUR 300K |
| Expeditions realisees | 50 | 200+ |

### Milestone decisif

> 1 assureur majeur ou 1 maison de vente internationale reconnait le certificat Kucibok comme document de reference.

---

## 9. PERIMETRE EXCLU (24 mois)

| Exclu | Raison |
|-------|--------|
| Encheres publiques | Module masque, reactivation Phase 3 |
| Analytics avance / valorisation | Necessite masse critique de donnees |
| CRM complexe | Hors scope infrastructure |
| Expansion multi-pays simultanee | Concentration corridor AF Ouest <-> France |
| Hub physique | Apres validation du standard digital |
| Marketplace grand public | Dilue le positionnement institutionnel |

> Regle : toute fonctionnalite qui n'est pas au service du standard ou de la logistique est reportee.

---

## 10. RISQUES

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Adoption lente du standard | Moyenne | Eleve | Pilotes galeries de reference, validation assureur rapide |
| Complexite douaniere sous-estimee | Elevee | Moyen | Partenariat expert douanier des Phase 1 |
| Besoin credibilite elevee des le depart | Elevee | Eleve | Branding institutionnel, board advisory |
| Concurrence acteur etabli (Christie's, Artsy) | Faible | Moyen | Focus Afrique — terrain non couvert |
| Qualite insuffisante du catalogue initial | Moyenne | Eleve | Validation manuelle stricte a l'onboarding |
| Expiration VPS Hostinger (19 mars 2026) | Critique | Critique | Migration M4 en cours — bascule Supabase/Vercel |

---

## 11. DOCUMENTS ASSOCIES

| Document | Contenu |
|----------|---------|
| `docs/TECH-SPEC.md` | Stack, architecture, modeles de donnees, API |
| `docs/ROADMAP.md` | Phasage detaille, milestones, checklist |
| `docs/DESIGN.md` | Direction visuelle Phase 3 (noir/ivoire/or) |
| `docs/RUNBOOK_M4.md` | Procedure de bascule production |
| `docs/MIGRATION_SUPABASE.md` | Detail technique migration MongoDB -> Supabase |

---

*Kucibok PRD V2.1 — Mars 2026 — Confidentiel*
