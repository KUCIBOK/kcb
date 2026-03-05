# KUCIBOK — ROADMAP.md
**Version** 1.0 — Mars 2026
**Horizon** 24 mois (Mars 2026 → Mars 2028)
**Aligné sur** PRD V2
**Langue** FR/EN — Confidentiel

---

## PRINCIPES DE CETTE ROADMAP

- **Focus > Volume** : Chaque phase a un objectif unique et mesurable
- **Standard d'abord** : Aucune feature de liquidité avant que le standard soit validé
- **Corridor unique** : AF Ouest ↔ France avant toute extension
- **Pas de sprints fixes** : Milestones par phase, itérations libres à l'intérieur

---

## VUE MACRO — 24 MOIS

```
PHASE 0   PHASE 1      PHASE 2         PHASE 3          PHASE 4
Mar 2026  Avr–Sep 26   Oct 26–Mar 27   Avr–Sep 27       Oct 27–Mar 28
────────  ──────────   ─────────────   ──────────────   ─────────────
Nettoyage Standard     Corridor        Reconnaissance   Scale
& Socle   Minimal      Opérationnel    Institutionnelle & Extension
          Viable
```

---

## ⚠️ PHASE 0 — NETTOYAGE & SOCLE (Mars 2026 — PRIORITÉ IMMÉDIATE)

> Avant de construire, nettoyer. La codebase est riche mais contient de la dette technique à adresser immédiatement.

### Décisions architecturales validées (Mars 2026)
| Décision | Choix retenu |
|----------|-------------|
| Design system | **Garder indigo/violet** (DESIGN-SYSTEM.md) — noir/ivoire/or reporté Phase 3+ |
| Routing portails | **Routes /africa et /global** — pas de detection hostname pour l'instant |
| Enchères | **Masquées côté front** — code backend conservé, réactivation possible Phase 3 |
| Hébergement frontend | **Vercel** (vercel.json déjà présent) |
| Hébergement backend | **VPS Hostinger** (cron jobs incompatibles serverless) |

### Priorités techniques immédiates

| Tâche | Raison | Urgence |
|-------|--------|---------|
| Supprimer `mailerConfig.js` + import dans `index.js` | Remplacé par Resend, encore importé | 🔴 Haute |
| Supprimer `smtpMailer.service.js` (legacy) | Remplacé par `resendMailer.service.js` | 🔴 Haute |
| Supprimer `middleware/upload.js` (legacy) | Remplacé par `multer.js` | 🔴 Haute |
| Corriger `auth.js:31` — lire `config.jwt.secret` au lieu de `process.env.JWT_SECRET` | Viole règle CLAUDE.md | 🔴 Haute |
| Masquer `/auctions` et `/auction/:id` du nav public | Enchères non prioritaires PRD V2 | 🔴 Haute |
| Désactiver `analyticsCollectionJob.js` proprement | Commenté dans index.js = dette tech | 🟡 Moyenne |
| Consolider `Header.jsx` (2 versions coexistent) | Confusion composants | 🟡 Moyenne |
| Adopter composants `ui/` sur les pages non migrées | Design system existant non utilisé partout | 🟡 Moyenne |
| Auditer les 15 Context providers | Possible over-engineering | 🟡 Moyenne |

### Migration Hébergement

| Action | Détail |
|--------|--------|
| **Frontend → Vercel** | Déjà préparé (`vercel.json` présent), migration directe |
| **Backend → Garder VPS Hostinger** | ⚠️ Vercel = serverless = incompatible avec cron jobs node-cron actifs |
| **Alternative backend future** | Railway ou Render si besoin de scalabilité (pas urgent) |

> **Décision critique** : Ne pas migrer le backend sur Vercel. Les 5 cron jobs actifs (enchères, abonnements, certificats, logidoo sync) nécessitent un process Node.js persistant. Garder le VPS Hostinger pour le backend.

### Livrables Phase 0
- [ ] Legacy backend supprimé (mailerConfig, smtpMailer, upload.js)
- [ ] `auth.js` corrigé — `config.jwt.secret`
- [ ] Enchères masquées du nav
- [ ] Frontend déployé sur Vercel
- [ ] Backend stable sur VPS Hostinger
- [ ] Variables d'environnement auditées et sécurisées
- [ ] CI/CD GitHub Actions validé end-to-end

---

## PHASE 1 — STANDARD MINIMAL VIABLE (Avr → Sep 2026)

> **Objectif unique** : Lancer le Standard Kucibok. Recruter 20 galeries pilotes. Ouvrir le corridor logistique.

### M1 — Avril 2026 : Standard Kucibok V1

**Backend**
- [ ] Refactoriser `artwork.controller.js` → champs standardisés obligatoires (titre, médium, dimensions, provenance, photos HD min 3)
- [ ] Améliorer `documents.service.js` → certificat PDF aux normes Kucibok (layout institutionnel, QR, numéro unique)
- [ ] Améliorer `generateCertificates.js` cron job → génération automatique à la validation
- [ ] Ajouter endpoint `GET /artwork/:id/verify` → public, sans auth, retourne données certificat
- [ ] Blockchain backend : s'assurer que le NFT Ethereum est généré silencieusement à la certification (invisible front)

**Frontend**
- [ ] Refaire `SubmitArtwork.jsx` → formulaire standardisé en étapes (données → photos → provenance → validation)
- [ ] Créer page `/verify/:id` → page publique de vérification QR (aucun compte requis)
- [ ] Mettre à jour dashboard Artiste → affichage certificat + QR téléchargeable

**Design**
- [ ] Appliquer nouvelle direction visuelle (voir DESIGN.md) sur les pages Standard
- [ ] Template certificat PDF premium (noir/ivoire/or, logo Kucibok)

---

### M2 — Mai 2026 : Portail Africa V1

**Backend**
- [ ] Nouveau rôle `gallery_africa` dans le système de rôles JWT
- [ ] Onboarding galeries africaines : validation manuelle par admin avant activation
- [ ] `gallery.controller.js` → CRUD complet galerie + gestion catalogue
- [ ] Endpoint import CSV artistes/œuvres pour galeries

**Frontend**
- [ ] Refonte `AfricaLanding.jsx` → positionnement institutionnel (design system actif : indigo/violet)
- [ ] Route `/africa` confirmée comme entrée principale (pas de subdomain)
- [ ] Nouveau flow onboarding galeries africaines (4 étapes : profil → catalogue → validation → activation)
- [ ] Dashboard galerie africaine → inventaire + statuts certification
- [ ] Interface import masse œuvres (CSV + photos)

---

### M3 — Juin 2026 : Logistique V1

**Backend**
- [ ] Refactoriser `delivery.controller.js` → workflow standardisé en statuts : `draft → confirmed → packaging → in_transit → customs → delivered`
- [ ] Améliorer `logidoo.service.js` → sync automatique statuts via `logidooSyncJob.js`
- [ ] Génération automatique documents douaniers export (depuis `documents.service.js`)
- [ ] Assurance intégrée : endpoint calcul prime selon valeur certifiée
- [ ] Notifications email (Resend) à chaque changement de statut

**Frontend**
- [ ] Refonte `DeliveryTab` → timeline visuelle des statuts
- [ ] `TrackingPage.jsx` → accessible sans compte (via lien unique)
- [ ] Checklist emballage muséal interactive (par type d'œuvre)
- [ ] Simulateur de coût logistique (corridor AF ↔ France)

---

### M4 — Juillet 2026 : Portail Global V1

**Backend**
- [ ] Nouveau rôle `curator_global` + `gallery_global`
- [ ] Onboarding international : validation stricte + abonnement payant obligatoire
- [ ] Catalogue certifié : endpoint filtrable par pays/artiste/style/disponibilité (accès restreint)
- [ ] Système de demande de sourcing privée (anonymisée)
- [ ] Paiements Stripe pour abonnements Global (complément PayDunya existant)

**Frontend**
- [ ] Refonte `GlobalPage.jsx` → landing institutionnelle EN prioritaire (design system actif : indigo/violet)
- [ ] Route `/global` confirmée comme entrée portail international (pas de subdomain)
- [ ] Page catalogue certifié → accès sur approbation uniquement
- [ ] Flow sourcing : demande → mise en relation → suivi
- [ ] Page pricing Global → 3 plans (Starter/Pro/Institution)

---

### M5-M6 — Août/Sep 2026 : Pilotes & Validation

- [ ] Onboarding 20 galeries pilotes (SN + CI prioritaires)
- [ ] 5 partenaires France actifs (curateurs / galeries)
- [ ] 100 premières œuvres certifiées Standard Kucibok
- [ ] 10 premières expéditions AF ↔ France réalisées
- [ ] Collecte feedback structuré pilotes → itérations rapides

**Milestone Phase 1 ✅**
> 20 galeries africaines actives · 100 œuvres certifiées · 10 expéditions · 5 partenaires France · MRR €2K+

---

## PHASE 2 — CORRIDOR OPÉRATIONNEL (Oct 2026 → Mar 2027)

> **Objectif** : Prouver que le corridor fonctionne à l'échelle. Générer les premières transactions structurées.

### Oct–Nov 2026 : Extension Afrique

- [ ] Onboarding Bénin + Nigeria (galeries structurées)
- [ ] Adaptation documents douaniers Nigeria (complexité NAFDAC)
- [ ] Portail Africa bilingue FR/EN complet
- [ ] Passeport NFC V1 : intégration lecture/écriture puce NFC œuvres haute valeur

### Déc 2026 – Jan 2027 : Catalogue & Sourcing

- [ ] 500+ œuvres certifiées dans le catalogue
- [ ] Moteur de recherche catalogue amélioré (filtres avancés)
- [ ] Profils artistes publics premium (visible curateurs approuvés)
- [ ] Système de mise en relation structuré (Kucibok orchestre)
- [ ] Dashboard analytics basique galeries : vues, demandes sourcing, expéditions

### Fév–Mar 2027 : Transactions Structurées

- [ ] 5 galeries France sur abonnement payant actif
- [ ] Module transaction privée B2B (pas de vente publique)
- [ ] Commission automatique sur transactions structurées (5-10%)
- [ ] Contrats de vente générés automatiquement (PDF signable)
- [ ] 50 expéditions cumulées AF ↔ France

**Milestone Phase 2 ✅**
> 500 œuvres certifiées · 50 expéditions · 10 clients Global payants · MRR €8K · 1ère transaction structurée >€5K

---

## PHASE 3 — RECONNAISSANCE INSTITUTIONNELLE (Avr → Sep 2027)

> **Objectif** : Faire reconnaître le Standard Kucibok par au moins 1 assureur majeur ou 1 maison de vente.

### Avr–Mai 2027 : Dossier Institutionnel

- [ ] Export certificats format assureurs (Allianz Art, AXA Art)
- [ ] Validation experte intégrée : circuit expert certifié Kucibok
- [ ] Rapport patrimonial exportable (PDF pour assureurs, banques, héritiers)
- [ ] Audit sécurité complet backend (pentest externe)
- [ ] RGPD compliance complète + DPA pour clients UE

### Juin–Juil 2027 : Extension Europe

- [ ] Corridor Belgique actif (Bruxelles)
- [ ] Documents douaniers UE standardisés
- [ ] 2-3 galeries belges partenaires
- [ ] Préparation corridor UK (post-Brexit douanes)

### Août–Sep 2027 : Validation & Partenariats

- [ ] Signature partenariat assureur (objectif : 1 acteur majeur)
- [ ] Intégration catalogue dans 1 maison de vente partenaire
- [ ] 2,000 œuvres certifiées au total
- [ ] 200 expéditions cumulées

**Milestone Phase 3 ✅**
> 1 assureur partenaire officiel · 1 maison de vente · 2K œuvres · 200 expéditions · MRR €20K

---

## PHASE 4 — SCALE & EXTENSION (Oct 2027 → Mar 2028)

> **Objectif** : Consolider, étendre, préparer Phase 5 (hub physique).

### Oct–Déc 2027

- [ ] Corridor UK opérationnel
- [ ] Analytics avancé : valorisation collection, tendances marché
- [ ] API publique Kucibok (pour intégrations galeries tierces)
- [ ] Application mobile native (React Native — basée sur codebase React existante)

### Jan–Mar 2028

- [ ] 5,000 œuvres certifiées
- [ ] 500+ expéditions cumulées
- [ ] MRR €25K+
- [ ] Étude de faisabilité hub physique (Dakar / Abidjan)
- [ ] Préparation levée de fonds Série A

**Milestone Phase 4 ✅**
> Standard reconnu · Corridor 3 pays EU · MRR €25K · Préparation hub physique

---

## DETTE TECHNIQUE À SURVEILLER

| Item | Risque | Action recommandée |
|------|--------|-------------------|
| 15 Context providers React | Over-engineering, performance | Migrer vers Zustand ou React Query progressivement |
| MongoDB sans transactions ACID | Risque intégrité données financières | Activer sessions MongoDB pour ops critiques |
| `watchdog.js` backend | Redémarrage auto non documenté | Documenter comportement + alertes |
| Upload fichiers sur VPS local | Perte données si crash serveur | Migrer vers Cloudinary ou S3 dès Phase 1 |
| Pas de rate limiting global | Risque DDoS / abus | Activer `rateLimiter.service.js` sur toutes les routes publiques |
| Cron jobs sans monitoring | Silence si échec | Ajouter alertes Slack/email sur échec cron |

---

## DÉCISIONS D'INFRASTRUCTURE CLÉS

```
FRONTEND          BACKEND           DATABASE          STORAGE
─────────         ───────           ────────          ───────
Vercel            VPS Hostinger     MongoDB Atlas     → Cloudinary (Phase 1)
(déjà prêt)       (garder pour      (existant)        Actuellement: /public/uploads
                  cron jobs)                          sur VPS (⚠️ risque)

EMAILS            PAIEMENTS AF      PAIEMENTS EU      BLOCKCHAIN
──────            ────────────      ────────────      ──────────
Resend            PayDunya          Stripe (à         Ethereum
(existant)        (existant)        intégrer P2)      (backend invisible)
```

---

*Kucibok ROADMAP V1 — Mars 2026 — Confidentiel*
