# KUCIBOK — Product Requirements Document V2
**Version** 2.0 — Mars 2026
**Statut** Draft stratégique
**Horizon** 24 mois
**Auteurs** Moctar Sidibé 
**Langue** FR/EN — Confidentiel

---

## TABLE DES MATIÈRES

1. [Positionnement Produit](#1-positionnement-produit)
2. [Problème & Opportunité](#2-problème--opportunité)
3. [Ce que Kucibok ne fait PAS](#3-ce-que-kucibok-ne-fait-pas)
4. [Architecture Produit](#4-architecture-produit)
5. [Utilisateurs Prioritaires](#5-utilisateurs-prioritaires)
6. [Modules Prioritaires](#6-modules-prioritaires)
7. [Modèle de Revenus](#7-modèle-de-revenus)
8. [Corridor Stratégique & Marchés](#8-corridor-stratégique--marchés)
9. [KPIs & Métriques de Succès](#9-kpis--métriques-de-succès)
10. [Roadmap 24 Mois](#10-roadmap-24-mois)
11. [Risques Identifiés](#11-risques-identifiés)
12. [Documents Associés](#12-documents-associés)

---

## 1. POSITIONNEMENT PRODUIT

### Définition
> **Kucibok est l'infrastructure digitale de standardisation et de circulation sécurisée de l'art africain.**

Kucibok n'est pas :
- Une marketplace grand public
- Un SaaS généraliste de gestion d'art
- Une plateforme NFT / Web3

Kucibok est :
- Le **standard de traçabilité** de l'œuvre africaine
- L'**opérateur logistique certifié** du corridor Afrique ↔ Monde
- La **couche de confiance** entre acteurs africains et marché international

### Principe Central
La valeur de Kucibok ne réside pas dans le volume de transactions.  
Elle réside dans la **qualité du standard** et la **fiabilité de la circulation**.

Un nombre limité d'œuvres certifiées et bien circulées vaut mieux que des milliers d'œuvres non vérifiées.

---

## 2. PROBLÈME & OPPORTUNITÉ

### Chaîne de Valeur Brisée

| Acteur | Douleur | Impact |
|--------|---------|--------|
| **Artiste africain** | Pas de documentation standardisée | Invisibilité internationale, risque contrefaçon |
| **Galerie africaine** | 10-15h/semaine perdues en admin | Coût opérationnel élevé, blocage à l'export |
| **Curateur international** | Sourcing opaque, provenance non vérifiable | Refus institutionnel, risque juridique |
| **Galerie internationale** | Pas de partenaire logistique fiable en Afrique | Deals non conclus, œuvres bloquées en douane |
| **Assureur / Institution** | Pas de standard reconnu | Impossibilité d'assurer ou d'exposer |

### Opportunité Structurelle
- Marché art africain : **€1.7B**, croissance +6.2%/an
- Intérêt institutionnel international en forte hausse
- Aucun acteur ne propose un standard de certification + logistique transcontinentale
- Traction prouvée : €300K GMV, 1,721 artistes, €2.2K MRR, LTV:CAC 8.9:1

---

## 3. CE QUE KUCIBOK NE FAIT PAS

Périmètre volontairement exclu sur 24 mois :

| ❌ Exclu | Raison |
|---------|--------|
| Enchères exposées publiquement | Module existant masqué côté front, code backend conservé — réactivation possible Phase 3 |
| Analytics avancé / valorisation | Phase 3 — nécessite masse critique de données |
| CRM complexe | Hors scope infrastructure, disponible via intégrations tierces |
| Expansion multi-pays simultanée | Concentration sur corridor AF Ouest ↔ France d'abord |
| Hub physique | Phase 3 — après validation du standard digital |
| Marketplace grand public | Dilue le positionnement institutionnel |
| Vente directe publique large | Hors modèle B2B structuré |

> **Règle** : Toute fonctionnalité qui n'est pas au service du standard ou de la logistique est reportée.

---

## 4. ARCHITECTURE PRODUIT

### Principe : Core Unique, 2 Interfaces Distinctes

Un seul backend, une seule base de données, deux expériences utilisateur séparées selon le marché et le profil.

```
┌─────────────────────────────────────────────────────────────┐
│                     KUCIBOK CORE                             │
│                                                              │
│   STANDARD LAYER              ORCHESTRATION LAYER            │
│   ─────────────               ──────────────────            │
│   • Certification             • Logistique internationale    │
│   • Documentation             • Assurance intégrée          │
│   • Provenance                • Suivi des mouvements        │
│   • Passeport œuvre           • Documentation douanière     │
│   • Blockchain (backend)      • Partenaires validés         │
│                                                              │
├──────────────────────┬──────────────────────────────────────┤
│   kucibok.com/africa │         kucibok.com/global           │
│                      │                                       │
│   PORTAIL AFRIQUE    │         PORTAIL GLOBAL               │
│   ───────────────    │         ─────────────                │
│   • Artistes         │         • Curateurs                  │
│   • Galeries locales │         • Galeries internationales   │
│   • Curateurs AF     │         • Institutions               │
│   • Accès gratuit    │         • Accès payant               │
│   • FR prioritaire   │         • EN/FR                      │
└──────────────────────┴──────────────────────────────────────┘
```

### Décisions d'Architecture

| Décision | Choix | Justification |
|----------|-------|---------------|
| Backend | Core unique partagé | Cohérence données, coût maintenance réduit |
| Interfaces | 2 routes distinctes (/africa · /global) | UX adaptée à chaque audience, routing simple sans gestion de subdomains en dev |
| Blockchain | Backend invisible | L'utilisateur voit un certificat, pas une technologie |
| Langue | FR/EN natif | Afrique francophone + marché international anglophone |
| Authentification | SSO unifié | Un compte Kucibok, accès aux deux portails selon rôle |
| Design | Indigo/violet (DESIGN-SYSTEM.md) | Design actif en production — noir/ivoire/or reporté Phase 3+ |
| Enchères | Masquées (code conservé) | Non prioritaire sur 24 mois — réactivation possible Phase 3 |

---

## 5. UTILISATEURS PRIORITAIRES

### Côté Afrique — Portail africa.kucibok.com

**Galeries structurées** (client principal)
- Galeries établies de 3+ ans, 50-300 œuvres en stock
- Pays : Sénégal, Côte d'Ivoire, Bénin, Nigeria
- Douleur #1 : documentation et logistique d'export
- Valeur Kucibok : catalogue certifié + accès corridor international

**Artistes professionnels validés** (supply critique)
- Artistes avec production régulière et ambition internationale
- Validation manuelle à l'onboarding (pas de masse non qualifiée)
- Valeur Kucibok : passeport œuvre + visibilité sourcing global

**Curateurs africains**
- Intermédiaires clés entre artistes locaux et marché international
- Valeur Kucibok : outil de gestion + mise en relation structurée

---

### Côté International — Portail global.kucibok.com

**Curateurs indépendants** (client prioritaire)
- Basés en France, UK, Belgique
- Organisent 2-5 expositions/an, cherchent art africain contemporain
- Douleur #1 : sourcing fiable, provenance vérifiable, logistique maîtrisée
- Valeur Kucibok : catalogue certifié + logistique clé en main

**Galeries afro-contemporaines** (France prioritaire)
- Galeries spécialisées ou avec programme Afrique
- Besoin : partenaires locaux fiables, œuvres documentées, transport sécurisé
- Valeur Kucibok : réseau galeries africaines certifiées + opérateur logistique

**Collectionneurs sérieux**
- Acheteurs réguliers, budget >€5K par acquisition
- Besoin : confiance provenance, certificat reconnu, livraison assurée
- Accès : sur invitation ou validation (pas grand public)

> **Principe** : Kucibok ne sert pas le grand public. Chaque utilisateur est validé à l'onboarding.

---

## 6. MODULES PRIORITAIRES

### F1 — STANDARD KUCIBOK ⭐ PRIORITÉ ABSOLUE

**Objectif** : Créer le passeport universel de l'œuvre africaine — le document de référence reconnu par assureurs, maisons de vente et institutions.

**Ce que l'utilisateur voit** : Un certificat propre, professionnel, vérifiable.  
**Ce qui tourne en backend** : Blockchain Ethereum (invisible).

#### Fonctionnalités V1 (0-6 mois)

| Fonctionnalité | Description |
|----------------|-------------|
| Fiche œuvre standardisée | Titre, artiste, date, médium, dimensions, état, provenance, photos HD |
| Identifiant unique Kucibok | Numéro de référence universel par œuvre |
| Certificat PDF sécurisé | Généré automatiquement, horodaté, signé Kucibok |
| QR code de vérification | Vérifiable publiquement sans compte |
| Historique de propriété | Traçabilité des transferts successifs |
| Export assureurs | Format compatible avec exigences des assureurs partenaires |
| Export maisons de vente | Format compatible avec catalogues de vente |

#### Fonctionnalités V2 (6-12 mois)

| Fonctionnalité | Description |
|----------------|-------------|
| Passeport NFC physique | Puce associable à l'œuvre physique |
| Validation experte | Circuit de validation par expert certifié Kucibok |
| Multi-propriétaires | Gestion des œuvres en copropriété ou en dépôt |

**Critère de succès F1** : Au moins 1 assureur majeur accepte le certificat Kucibok comme document de référence.

---

### F2 — LOGISTIQUE TRANSFRONTALIÈRE ⭐ PRIORITÉ 2

**Objectif** : Faire circuler une œuvre entre l'Afrique de l'Ouest et la France sans friction — de la demande d'expédition à la livraison muséale.

**Corridor prioritaire** : Sénégal / Côte d'Ivoire / Bénin / Nigeria ↔ France  
**Extension Phase 2** : France ↔ Belgique / Royaume-Uni

#### Fonctionnalités V1 (0-9 mois)

| Fonctionnalité | Description |
|----------------|-------------|
| Demande d'expédition | Formulaire simplifié depuis la fiche œuvre |
| Checklist emballage muséal | Protocole standardisé par type d'œuvre |
| Partenaires logistiques validés | Réseau de transporteurs certifiés par Kucibok |
| Suivi statutaire | États : en préparation / en transit / dédouané / livré |
| Génération documents export | Déclaration douanière, facture pro forma, CITES si nécessaire |
| Génération documents import | Documents requis à l'entrée France / UE |
| Assurance intégrée | Couverture automatique à la valeur certifiée |
| Notifications | Alertes email/SMS à chaque changement de statut |

> **Note** : Pas de GPS temps réel en V1. Le suivi statutaire est suffisant et fiable.

#### Fonctionnalités V2 (9-18 mois)

| Fonctionnalité | Description |
|----------------|-------------|
| Suivi GPS avancé | Pour expéditions haute valeur (>€10K) |
| Extension corridors | Ajout Belgique, UK |
| Dépôt temporaire | Gestion des œuvres en prêt ou en exposition |

**Critère de succès F2** : 50 expéditions transcontinentales réalisées sans incident majeur.

---

### F3 — CATALOGUE CERTIFIÉ (SOURCING) ⭐ PRIORITÉ 3

**Objectif** : Donner aux acteurs internationaux un accès structuré et privé à un catalogue d'œuvres africaines certifiées.

**Ce n'est pas** une marketplace publique. C'est un outil de sourcing professionnel B2B.

#### Fonctionnalités V1 (3-9 mois)

| Fonctionnalité | Description |
|----------------|-------------|
| Catalogue filtrable | Filtres : pays, artiste, style, période, prix, disponibilité |
| Accès restreint | Sur validation uniquement (curateurs, galeries approuvées) |
| Fiche œuvre complète | Toutes les données du Standard Kucibok |
| Demande de sourcing privée | Contact direct galerie/artiste via Kucibok (anonymisé si besoin) |
| Mise en relation structurée | Kucibok orchestre la mise en contact et le suivi |
| Statuts de disponibilité | Disponible / En exposition / Non disponible / Sur demande |

#### Hors scope V1

- Vente publique directe
- Prix affichés publiquement
- Enchères

**Critère de succès F3** : 10 mises en relation ayant abouti à une transaction ou un partenariat d'exposition.

---

## 7. MODÈLE DE REVENUS

### Portail Afrique — Gratuit (Phase Structuration)

Accès gratuit pour galeries africaines, artistes validés et curateurs africains pendant toute la phase de construction du catalogue certifié.

> L'objectif n'est pas de monétiser l'Afrique maintenant.  
> L'objectif est de construire le catalogue qui alimente le portail Global.

---

### Portail Global — Payant

| Source | Modèle | Montant |
|--------|--------|---------|
| **Abonnement Pro** | Mensuel / annuel | €79 / €149 / €299 selon volume |
| **Frais logistique** | Par expédition (marge intégrée) | Variable selon distance et valeur |
| **Certification premium** | Par œuvre (niveau expert) | €25 - €75 |
| **Commission transaction** | Sur ventes structurées | 5% - 10% |

### Grille Abonnement Global

| Plan | Prix | Inclus |
|------|------|--------|
| **Starter** | €79/mois | 50 œuvres catalogue, 5 expéditions/mois, sourcing basique |
| **Pro** | €149/mois | 200 œuvres, 20 expéditions/mois, mise en relation prioritaire |
| **Institution** | €299/mois | Illimité, logistique dédiée, certification experte incluse |

### Trajectoire de Revenus

```
Mois 0-6    : Investissement (structuration Afrique, 0 revenu)
Mois 6-12   : Premiers abonnements Global + frais logistique
Mois 12-18  : MRR cible €10K, volume logistique croissant
Mois 18-24  : MRR cible €25K, commissions transactions
```

> **Note** : Le MRR est un indicateur secondaire. L'indicateur primaire est la valeur totale d'œuvres certifiées et circulées.

---

## 8. CORRIDOR STRATÉGIQUE & MARCHÉS

### Corridor Prioritaire — Phase 1

```
AFRIQUE DE L'OUEST              FRANCE
──────────────────              ──────
🇸🇳 Sénégal                     Paris (galeries, curateurs)
🇨🇮 Côte d'Ivoire        ↔      Lyon, Bordeaux (collectionneurs)
🇧🇯 Bénin                       Diaspora (acheteurs privés)
🇳🇬 Nigeria
```

**Critères de sélection de ces 4 pays** :
- Écosystèmes artistiques actifs et structurés
- Présence de galeries avec production exportable
- Artistes contemporains avec reconnaissance internationale naissante
- Infrastructure logistique existante (aéroports, douanes)

### Extension — Phase 2 (Mois 12-24)

```
MÊME AFRIQUE DE L'OUEST    +    BELGIQUE (Bruxelles)
                                 ROYAUME-UNI (Londres)
```

### Ce qui ne change pas sur 24 mois
- Pas d'expansion Asie
- Pas d'expansion Afrique de l'Est ou du Nord
- Pas d'ouverture USA / UAE avant validation du corridor AF-Europe

---

## 9. KPIs & MÉTRIQUES DE SUCCÈS

### KPIs Primaires — Infrastructure

| Métrique | Définition | Cible 24 mois |
|----------|------------|---------------|
| **Asset Value Certified** | Valeur totale des œuvres certifiées Kucibok | €5M+ |
| **Œuvres circulées** | Nombre d'œuvres ayant transité via corridor Kucibok | 200+ |
| **Partenaires logistiques validés** | Transporteurs certifiés actifs | 5+ |
| **Institutions utilisant le standard** | Assureurs, maisons de vente, musées | 3+ |

### KPIs Secondaires — Adoption

| Métrique | Cible 12 mois | Cible 24 mois |
|----------|---------------|---------------|
| Galeries africaines actives | 20 pilotes | 50+ |
| Artistes validés | 200 | 500+ |
| Partenaires France actifs | 5 | 15+ |
| Œuvres certifiées | 500 | 2,000+ |

### KPIs Financiers

| Métrique | Cible 12 mois | Cible 24 mois |
|----------|---------------|---------------|
| MRR | €5K | €25K |
| ARR | €60K | €300K |
| Expéditions réalisées | 50 | 200+ |

### KPI de Validation Stratégique
> ✅ **Milestone décisif** : Au moins 1 assureur majeur ou 1 maison de vente internationale reconnaît officiellement le certificat Kucibok comme document de référence.

Ce milestone valide le standard et ouvre la Phase 3 (hub physique).

---

## 10. ROADMAP 24 MOIS

### Phase 1 — Standard Minimal Viable (Mois 0-6)

**Objectif** : Lancer le Standard Kucibok et recruter les premiers pilotes.

| Livrable | Description |
|----------|-------------|
| Standard Kucibok V1 | Fiche œuvre + certificat PDF + QR vérifiable |
| Portail Africa V1 | Onboarding artistes et galeries, catalogue de base |
| 20 galeries pilotes | Sénégal + Côte d'Ivoire prioritaires |
| 5 partenaires France | Curateurs et galeries en phase de test |
| Logistique V1 | Premier corridor opérationnel SN/CI ↔ France |

---

### Phase 2 — Corridor Opérationnel (Mois 6-12)

**Objectif** : Prouver que le corridor fonctionne. Générer les premières transactions structurées.

| Livrable | Description |
|----------|-------------|
| 500+ œuvres certifiées | Catalogue suffisant pour le sourcing |
| 50 expéditions réalisées | Corridor AF Ouest ↔ France validé |
| Portail Global V1 | Accès sourcing pour curateurs et galeries internationales |
| 5 galeries France actives | Clients payants sur abonnement Pro |
| Passeport NFC V1 | Déploiement sur œuvres haute valeur |
| Extension Bénin + Nigeria | Onboarding galeries et artistes |

---

### Phase 3 — Standard Reconnu (Mois 12-24)

**Objectif** : Faire reconnaître le standard Kucibok par le marché institutionnel.

| Livrable | Description |
|----------|-------------|
| 1 assureur majeur partenaire | Reconnaissance officielle du certificat |
| 1 maison de vente partenaire | Utilisation du standard dans leurs catalogues |
| Extension Belgique / UK | 2e pays européen actif |
| 200+ expéditions cumulées | Volume suffisant pour négocier tarifs logistique |
| Validation experte V1 | Circuit d'expertise certifiée intégré |
| Préparation Phase 4 | Étude de faisabilité hub physique |

---

## 11. RISQUES IDENTIFIÉS

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Adoption lente du standard | Moyenne | Élevé | Pilotes galeries de référence, validation assureur rapide |
| Complexité douanière sous-estimée | Élevée | Moyen | Partenariat expert douanier dès Phase 1 |
| Besoin de crédibilité élevée dès le départ | Élevée | Élevé | Branding institutionnel, board advisory visible |
| Concurrence acteur établi (Christie's, Artsy) | Faible | Moyen | Focus Afrique — terrain non couvert par ces acteurs |
| Qualité insuffisante du catalogue initial | Moyenne | Élevé | Validation manuelle stricte à l'onboarding |

---

## 12. DOCUMENTS ASSOCIÉS

| Document | Contenu | Statut |
|----------|---------|--------|
| `ROADMAP.md` | Phasage détaillé, sprints, jalons techniques | À rédiger |
| `DESIGN.md` | Système de design, ADN visuel, composants UI | À rédiger |
| `TECHSPEC.md` | Stack technique, APIs, architecture backend | À rédiger |

---

*Kucibok PRD V2 — Document stratégique confidentiel*
*Mars 2026 — Version 2.0*
*Kucibok © 2026*
