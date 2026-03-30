# MOCTAR.md — Configuration manuelle restante

> **Destinataire** : Moctar (admin / DevOps)
> **Date** : 27 mars 2026
> **Contexte** : Phase 0 — Migration M4 + refactor rôles + correctifs sécurité

Ce document liste **toutes les actions manuelles** à effectuer avant et après le déploiement. Le code est prêt — ces étapes concernent l'infrastructure, la base de données et les services externes.

---

## Table des matières

1. [Migrations SQL à appliquer](#1-migrations-sql-à-appliquer)
2. [Configuration Supabase](#2-configuration-supabase)
3. [Configuration Vercel](#3-configuration-vercel)
4. [Configuration Resend (emails)](#4-configuration-resend-emails)
5. [Configuration PayDunya](#5-configuration-paydunya)
6. [Sécurité — Rate Limiting](#6-sécurité--rate-limiting)
7. [Vérifications post-déploiement](#7-vérifications-post-déploiement)
8. [Résumé des correctifs appliqués dans le code](#8-résumé-des-correctifs-appliqués-dans-le-code)

---

## 1. Migrations SQL à appliquer

### Ordre d'exécution (obligatoire)

Les migrations doivent être appliquées **dans l'ordre** via le SQL Editor de Supabase Dashboard :

```
Supabase Dashboard → SQL Editor → New Query → Coller le contenu → Run
```

| Migration | Fichier | Description | Statut |
|-----------|---------|-------------|--------|
| 007 | `supabase/migrations/007_role_refactor.sql` | Renomme `collector`→`buyer`, `professional`→`curator` dans `users` + `auth.users` + trigger | **À appliquer** |
| 008 | `supabase/migrations/008_rls_role_refactor.sql` | Corrige la fonction RLS `is_professional()` pour vérifier `'curator'` au lieu de `'professional'` | **À appliquer APRÈS 007** |

### Pourquoi les deux sont nécessaires

- **007** renomme les données utilisateur mais **oublie** la fonction `is_professional()` dans les politiques RLS.
- **Sans 008**, les curators (ex-professionnels) perdent silencieusement l'accès à :
  - Création d'enchères (`auctions INSERT`)
  - Création d'articles blog (`blog_posts INSERT`)
  - Création d'avis (`reviews INSERT`)

### Vérification après application

```sql
-- Vérifier qu'il n'y a plus de 'collector' ou 'professional' dans public.users
SELECT role, COUNT(*) FROM public.users GROUP BY role;
-- Résultat attendu : uniquement 'buyer', 'artist', 'curator', 'admin'

-- Vérifier que la fonction is_professional() renvoie TRUE pour un curator
-- (tester avec un UUID de curator connu)
SELECT is_professional() -- en étant connecté comme curator
```

---

## 2. Configuration Supabase

### 2.1 Politiques de stockage (Storage Bucket)

Les buckets Supabase Storage doivent restreindre les types MIME acceptés pour éviter l'upload de fichiers malveillants.

```
Supabase Dashboard → Storage → Sélectionner le bucket → Settings
```

| Bucket | Types MIME autorisés | Taille max |
|--------|---------------------|------------|
| `artworks` | `image/jpeg`, `image/png`, `image/webp` | 10 MB |
| `profiles` | `image/jpeg`, `image/png`, `image/webp` | 5 MB |
| `blogs` | `image/jpeg`, `image/png`, `image/webp` | 5 MB |
| `certificates` | `application/pdf` | 2 MB |

**Action** : Pour chaque bucket, dans les paramètres du bucket :
1. Cocher "Restrict file types"
2. Ajouter les types MIME listés ci-dessus
3. Définir la taille maximale de fichier

### 2.2 Vérifier les politiques RLS

```
Supabase Dashboard → Authentication → Policies
```

Vérifier que **toutes les tables** ont RLS activé :

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- Toutes les lignes doivent avoir rowsecurity = true
```

### 2.3 Auth — Provider Google

```
Supabase Dashboard → Authentication → Providers → Google
```

Vérifier que :
- Le provider Google est **activé**
- Le `Client ID` et `Client Secret` sont configurés
- L'URI de redirection est `https://[PROJECT_REF].supabase.co/auth/v1/callback`
- Ce même URI est dans Google Cloud Console → Identifiants OAuth

### 2.4 Auth — Email Templates

```
Supabase Dashboard → Authentication → Email Templates
```

Vérifier que les templates d'email sont personnalisés en français :
- **Confirm signup** : "Confirmez votre inscription Kucibok"
- **Reset password** : "Réinitialisation de votre mot de passe Kucibok"
- **Magic Link** : (si activé)

---

## 3. Configuration Vercel

### 3.1 Variables d'environnement

```
Vercel Dashboard → Projet Kucibok → Settings → Environment Variables
```

Vérifier que **toutes** ces variables sont définies pour **Production** :

| Variable | Valeur attendue | Scope |
|----------|----------------|-------|
| `SUPABASE_URL` | `https://[ID].supabase.co` | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (clé service_role) | Production uniquement |
| `API_KEY` | Clé hex 64 caractères (identique à `VITE_API_KEY`) | Production + Preview |
| `CORS_ORIGIN` | `https://kucibok.com` | Production |
| `CORS_ORIGIN` | `https://kucibok-wine.vercel.app` | Preview |
| `RESEND_API_KEY` | `re_...` | Production + Preview |
| `ADMIN_EMAIL` | `admin@kucibok.com` | Production + Preview |
| `ALERT_RECEIVER` | `alerts@kucibok.com` | Production + Preview |
| `PAYDUNYA_MASTER_KEY` | Clé PayDunya | Production |
| `PAYDUNYA_PRIVATE_KEY` | Clé PayDunya | Production |
| `PAYDUNYA_TOKEN` | Token PayDunya | Production |
| `PAYDUNYA_MODE` | `live` | Production |
| `PAYDUNYA_MODE` | `test` | Preview |
| `LOGIDOO_API_KEY` | JWT Logidoo | Production + Preview |
| `LOGIDOO_ENV` | `production` | Production |
| `LOGIDOO_ENV` | `sandbox` | Preview |

**Important** :
- `SUPABASE_SERVICE_ROLE_KEY` ne doit **jamais** avoir le préfixe `VITE_`
- Les variables `VITE_*` sont configurées dans le code (build-time), pas dans Vercel env vars serveur

### 3.2 Domaine personnalisé

```
Vercel Dashboard → Projet → Settings → Domains
```

- Vérifier que `kucibok.com` est configuré et le certificat SSL est actif
- Vérifier la redirection `www.kucibok.com` → `kucibok.com`

---

## 4. Configuration Resend (emails)

### 4.1 Domaine vérifié

```
Resend Dashboard → Domains
```

Vérifier que `kucibok.com` est vérifié (DNS DKIM + SPF configurés).

### 4.2 Templates d'email

Le code utilise deux templates d'email de bienvenue :
- `welcome-artist` — envoyé aux artistes à l'inscription
- `welcome-buyer` — envoyé aux acheteurs à l'inscription (anciennement `welcome-collector`)

**Action** : Si des templates nommés existaient côté Resend :
1. Renommer `welcome-collector` en `welcome-buyer` dans le dashboard Resend
2. Ou vérifier que les emails sont générés en HTML inline côté serveur (auquel cas rien à faire côté Resend)

### 4.3 Adresse d'expédition

Le code envoie depuis `noreply@kucibok.com`. Vérifier que cette adresse est autorisée dans Resend.

---

## 5. Configuration PayDunya

### 5.1 Mode production

Avant de passer en production :
1. Basculer `PAYDUNYA_MODE=live` dans Vercel env vars
2. Remplacer les clés sandbox par les clés production dans Vercel

### 5.2 URL de callback

Vérifier dans le dashboard PayDunya que l'URL de callback pointe vers :
```
https://kucibok.com/api/payments/paydunya-callback
```

### 5.3 IP Whitelisting (recommandé)

Pour sécuriser le webhook PayDunya, idéalement :
1. Contacter PayDunya pour obtenir la liste de leurs IP de callback
2. Ajouter une vérification IP dans le handler `routePaydunyaCallback`
3. Alternative : vérifier la signature du webhook si PayDunya le supporte

---

## 6. Sécurité — Rate Limiting

### Situation actuelle

Le code **n'a pas** de rate limiting. C'est une vulnérabilité identifiée lors de l'audit sécurité (priorité CRITIQUE). Les endpoints les plus sensibles :

| Endpoint | Risque sans rate limit |
|----------|----------------------|
| `POST /api/auth/signup` | Création de comptes en masse |
| `POST /api/auth/login` | Brute-force mot de passe |
| `POST /api/auth/forgot-password` | Spam d'emails de réinitialisation |
| `POST /api/blog/comment` | Spam de commentaires |
| `GET /api/artworks` | Scraping du catalogue |

### Solutions recommandées (par ordre de facilité)

#### Option A — Vercel Edge Middleware (recommandé)

Créer un fichier `middleware.js` à la racine du projet utilisant `@vercel/edge` :

```bash
yarn add @upstash/ratelimit @upstash/redis
```

Nécessite un compte Upstash Redis (plan gratuit suffisant) :
- `UPSTASH_REDIS_REST_URL` — à ajouter dans Vercel env vars
- `UPSTASH_REDIS_REST_TOKEN` — à ajouter dans Vercel env vars

#### Option B — Rate limiting in-memory (simple mais limité)

Fonctionne uniquement pour une seule instance Vercel Function (pas de partage entre régions). Utile en attendant la solution A.

#### Option C — Cloudflare (si le DNS passe par Cloudflare)

Activer les règles de rate limiting dans Cloudflare Dashboard. Ne nécessite aucun changement de code.

---

## 7. Vérifications post-déploiement

### Checklist fonctionnelle

Après application des migrations et déploiement, vérifier **manuellement** :

- [ ] **Inscription** : créer un compte `buyer` → vérifier email → connexion
- [ ] **Inscription artiste** : créer un compte `artist` avec photo → vérifier l'upload dans Storage
- [ ] **Connexion Google** : OAuth → sélection de rôle → redirection correcte
- [ ] **Dashboard buyer** : `/account` affiche le dashboard acheteur
- [ ] **Dashboard artist** : `/dashboard/artist` affiche le dashboard artiste
- [ ] **Dashboard curator** : `/dashboard/curator` affiche le dashboard curateur (ex-professionnel)
- [ ] **Admin** : `/dashboard/admin` → vérifier que les stats affichent "Acheteurs" et "Curateurs" (pas "Collectionneurs" / "Professionnels")
- [ ] **Blog** : poster un commentaire → vérifier que les balises HTML sont sanitisées
- [ ] **Catalogue** : les oeuvres non-approuvées ne sont pas visibles pour les visiteurs anonymes
- [ ] **Abonnement** : le flux activate/fail fonctionne (requêtes POST, plus GET)
- [ ] **RLS curator** : un curator peut créer un article blog et un avis

### Vérification des rôles en base

```sql
-- Aucun ancien rôle ne doit subsister
SELECT COUNT(*) FROM public.users WHERE role IN ('collector', 'professional');
-- Résultat attendu : 0

-- Distribution actuelle des rôles
SELECT role, COUNT(*) FROM public.users GROUP BY role ORDER BY role;
```

### Vérification sécurité

```sql
-- Vérifier RLS actif sur toutes les tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND NOT rowsecurity;
-- Résultat attendu : 0 lignes (toutes les tables ont RLS)
```

---

## 8. Résumé des correctifs appliqués dans le code

### Sécurité (déjà dans le code, aucune action manuelle)

| Correctif | Fichier | Description |
|-----------|---------|-------------|
| XSS client | `Comments.jsx`, `Step4.jsx` | DOMPurify sur `dangerouslySetInnerHTML` |
| XSS serveur | `api/[...path].js` | Strip `<script>`, `<iframe>`, `on*` handlers côté API |
| IDOR transactions | `api/[...path].js` | Vérification propriétaire (`buyer_id`/`seller_id`) |
| IDOR abonnements | `api/[...path].js` | Vérification `user_id` sur lecture et mise à jour |
| Escalade de rôle | `api/[...path].js` | Suppression du fallback `user_metadata` dans `requireRole` |
| Oeuvres non-approuvées | `api/[...path].js` | Cachées aux non-propriétaires/non-admins |
| GET → POST | `api/[...path].js` | Endpoints de mutation (fail/activate) convertis en POST |
| DoS listUsers | `api/[...path].js` | Remplacement de `listUsers()` par requête ciblée |
| SQL injection ilike | `api/[...path].js` | Échappement des wildcards `%` et `_` |
| Mot de passe | `api/[...path].js` | Validation longueur minimum 8 caractères |

### Refactor rôles (déjà dans le code)

| Zone | Ancien | Nouveau |
|------|--------|---------|
| Routes frontend | `/dashboard/buyer` (404) | `/account` |
| Navigation | `PortalNav`, `UserLinks` | Logique `buyer` → `/account` |
| Profils | `professionalProfile`, `collectorProfile` | `curatorProfile`, `buyerProfile` |
| Admin views | `collectors`, `professionals` | `buyers`, `curators` |
| API auth | `VALID_ROLES` incluait `professional` | Inclut `curator` |
| API auth | `requirePro()` | `requireCurator()` |
| CRM sync | `type: 'collector'` | `type: 'buyer'` |
| Email template | `welcome-collector` | `welcome-buyer` |
| Contacts CRM | `'Collectionneur'` | `'Acheteur'` |

---

## 9. Récupérer le code depuis la branche `dev`

### Première fois (cloner le projet)

```bash
git clone https://github.com/[ORGANISATION]/kucibok.git
cd kucibok
git checkout dev
yarn install
```

### Déjà le projet en local

```bash
# 1. S'assurer d'être sur la branche dev
git checkout dev

# 2. Récupérer les dernières modifications
git pull origin dev

# 3. Réinstaller les dépendances (au cas où package.json a changé)
yarn install

# 4. Vérifier que le build passe
yarn build
```

### Points importants

- **Ne jamais travailler directement sur `main`** — `dev` est la branche d'intégration
- **Toutes les modifications** (sécurité, rôles, tests, migrations) sont sur `dev`
- Les fichiers de migration SQL sont dans `supabase/migrations/` — les copier-coller dans le SQL Editor de Supabase (ne pas les exécuter depuis le terminal)
- Les variables d'environnement frontend sont dans `.env.exemple` — copier vers `.env` et remplir les valeurs

### Vérifier que tout est en ordre

```bash
# Voir les derniers commits
git log --oneline -10

# Vérifier qu'il n'y a pas de conflits
git status

# Lancer les tests
yarn test

# Lancer le build
yarn build
```

### En cas de conflit

```bash
# Si git pull échoue avec des conflits :
git stash                # Mettre de côté vos modifications locales
git pull origin dev      # Récupérer les changements
git stash pop            # Réappliquer vos modifications
# Résoudre les conflits manuellement si nécessaire
```

---

## Priorité d'exécution

1. **Immédiat** : Récupérer le code depuis `dev` (section 9) puis appliquer migration 007 puis 008
2. **Avant mise en production** : Vérifier variables Vercel + buckets Storage + domaine Resend
3. **Semaine suivante** : Mettre en place le rate limiting (Option A ou C)
4. **Phase 1** : IP whitelisting PayDunya, CSRF tokens
