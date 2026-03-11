# RUNBOOK Phase M4 — Bascule Production Kucibok

> Document operationnel de reference pour la migration production.
> Urgence : VPS Hostinger expire le **19 mars 2026**.
> Auteur : equipe Kucibok — a executer en dehors des heures de pointe.

---

## PRE-REQUIS AVANT DE COMMENCER

Verifier que les phases precedentes sont terminees et validees :

- [x] Phase M1 : Supabase Auth + Storage configure (buckets crees)
- [x] Phase M2 : Schema PostgreSQL cree + RLS actif (34 tables)
- [x] Phase M3 : Vercel Functions deployees et testees en staging
- [ ] VPS Hostinger renouvele (minimum 1 mois de marge)
- [ ] Snapshot MongoDB Atlas cree (backup obligatoire)
- [ ] Accces Supabase dashboard verifie (admin)
- [ ] Acces Vercel dashboard verifie (admin)
- [ ] `.env.migration` cree depuis `scripts/.env.migration.exemple`

---

## FENETRE DE MIGRATION

- **Moment ideal** : nuit (00h00-04h00 UTC) ou week-end
- **Duree estimee** : 3-5 heures selon le volume de donnees
- **Rollback possible** jusqu'a l'etape 8 (bascule DNS)

---

## ETAPE 0 — BACKUP (obligatoire)

### 0.1 Snapshot MongoDB Atlas

```bash
# Via Atlas dashboard : Database → ... → Take Snapshot
# Attendre la confirmation du snapshot avant de continuer.

# OU via mongodump (si acces CLI):
mongodump --uri "$MONGODB_URI" --out ./backup_$(date +%Y%m%d_%H%M)
```

### 0.2 Snapshot Cloudinary

```bash
# Cloudinary Dashboard → Media Library → Export (ZIP complet)
# Stocker localement + S3/Drive comme backup secondaire.
```

### 0.3 Verifier les sauvegardes

- [ ] Snapshot Atlas confirme dans le dashboard
- [ ] Backup Cloudinary telecharge localement
- [ ] Fichier backup accessible et non corrompu (verifier taille > 0)

---

## ETAPE 1 — MODE MAINTENANCE (optionnel mais recommande)

Afficher une page de maintenance pendant la migration pour eviter les
ecritures en base pendant la bascule.

```bash
# Dans Vercel dashboard → Project → Environment Variables :
# Ajouter : VITE_MAINTENANCE_MODE=true
# Redeploy le frontend pour activer la page de maintenance.

# OU : DNS-based — pointer temporairement vers une page statique
```

---

## ETAPE 2 — MIGRATION DES UTILISATEURS

```bash
# Depuis la racine du projet

# 2.1 Tester d'abord en dry-run
node scripts/migrate_users_auth.js --dry-run

# 2.2 Creer les comptes Supabase Auth (sans envoyer les emails)
node scripts/migrate_users_auth.js --skip-email

# Verifier le mapping cree :
cat scripts/user_id_map.json | head -20
# Le fichier doit contenir : { "mongoId1": "supabaseUUID1", ... }
```

**Verification :**

```bash
# Dans Supabase dashboard → Authentication → Users
# Compter les users : doit correspondre au nombre dans Atlas
```

---

## ETAPE 3 — MIGRATION DES DONNEES

```bash
# 3.1 Dry-run complet (verifier sans ecrire)
node scripts/migrate_mongodb.js --dry-run

# 3.2 Migration par collection (ordre obligatoire — respecter les FK)
node scripts/migrate_mongodb.js --collection=categories
node scripts/migrate_mongodb.js --collection=plans
node scripts/migrate_mongodb.js --collection=artists
node scripts/migrate_mongodb.js --collection=profiles
node scripts/migrate_mongodb.js --collection=artworks
node scripts/migrate_mongodb.js --collection=collections
node scripts/migrate_mongodb.js --collection=transactions
node scripts/migrate_mongodb.js --collection=subscriptions
node scripts/migrate_mongodb.js --collection=delivery
node scripts/migrate_mongodb.js --collection=sourcing
node scripts/migrate_mongodb.js --collection=blog_posts
node scripts/migrate_mongodb.js --collection=crm
node scripts/migrate_mongodb.js --collection=logs

# OU migration complete en une commande :
node scripts/migrate_mongodb.js
```

**Verification :**

```sql
-- Dans Supabase dashboard → SQL Editor :
SELECT
  (SELECT COUNT(*) FROM artworks) AS artworks,
  (SELECT COUNT(*) FROM artists)  AS artists,
  (SELECT COUNT(*) FROM users)    AS users,
  (SELECT COUNT(*) FROM transactions) AS transactions;
-- Comparer avec les comptages MongoDB Atlas.
```

---

## ETAPE 4 — MIGRATION DES IMAGES

```bash
# 4.1 Verifier les buckets Supabase Storage crees :
# Dashboard → Storage → Buckets : artworks, profiles, blogs, certificates

# 4.2 Dry-run
node scripts/migrate_cloudinary.js --dry-run

# 4.3 Migration des images par table
node scripts/migrate_cloudinary.js --table=artworks
node scripts/migrate_cloudinary.js --table=artists
node scripts/migrate_cloudinary.js --table=profiles
node scripts/migrate_cloudinary.js --table=blog_posts

# En cas d'erreur sur une table, relancer uniquement cette table :
node scripts/migrate_cloudinary.js --table=artworks --offset=150
```

**Verification :**

```bash
# Verifier quelques URLs dans Supabase dashboard → Table Editor → artworks
# Les URLs doivent pointer vers : https://xxxx.supabase.co/storage/v1/object/public/...
# Ouvrir 2-3 URLs manuellement pour confirmer que les images sont accessibles.
```

---

## ETAPE 5 — DEPLOIEMENT VERCEL FUNCTIONS

```bash
# Depuis la racine du projet

# 5.1 Verifier les variables d'env dans Vercel dashboard → Settings → Environment Variables :
# SUPABASE_URL              ✓
# SUPABASE_SERVICE_ROLE_KEY ✓
# API_KEY                   ✓
# CORS_ORIGIN               ✓
# RESEND_API_KEY            ✓
# ADMIN_EMAIL               ✓
# PAYDUNYA_*                ✓

# 5.2 Deployer (si pas encore fait depuis M3)
vercel --prod

# 5.3 Tester le healthcheck
curl https://kucibok.com/api/health
# Reponse attendue : { "status": "ok", "supabase": true }
```

---

## ETAPE 6 — TESTS FONCTIONNELS EN PRODUCTION

Tester chaque fonctionnalite cle manuellement avant de communiquer la bascule :

```
[ ] Inscription d'un nouveau compte (collector)
[ ] Connexion email/mot de passe
[ ] Connexion Google OAuth
[ ] Affichage de la liste des oeuvres (GET /api/artworks)
[ ] Affichage d'une oeuvre avec image (verifier URL Supabase Storage)
[ ] Verification QR code (GET /api/artworks/verify/:kuciobkId)
[ ] Soumission d'une demande de livraison
[ ] Tracking public d'une livraison
[ ] Paiement PayDunya (tester en mode sandbox d'abord)
[ ] Generation d'un certificat PDF
[ ] Dashboard admin accessible
[ ] Dashboard artiste accessible
```

---

## ETAPE 7 — EMAILS DE REINITIALISATION

Une fois tous les tests passes, envoyer les emails de reset aux utilisateurs
migres afin qu'ils puissent creer un nouveau mot de passe.

```bash
# Envoyer les emails de reinitialisation (Supabase Auth → Resend)
node scripts/migrate_users_auth.js --send-reset-emails

# OU : preparer une campagne email manuelle via le CRM Kucibok
# avec un message expliquant la migration et un lien de reset.
```

**Template email de migration (a adapter) :**

```
Objet : Kucibok — Action requise : reinitialisation de votre mot de passe

Bonjour [nom],

Nous avons migre notre infrastructure vers une plateforme plus robuste.
Pour continuer a utiliser Kucibok, vous devez creer un nouveau mot de passe.

Cliquer sur le lien ci-dessous pour reinitialiser votre mot de passe :
[LIEN DE REINITIALISATION]

Ce lien est valide 24 heures.

L'equipe Kucibok
```

---

## ETAPE 8 — SURVEILLANCE (1 semaine minimum)

Pendant la semaine suivant la bascule, surveiller :

```
[ ] Sentry : zero nouvelles erreurs critiques
[ ] Vercel : fonctions sans timeout (< 10s)
[ ] Supabase : usage DB et Storage dans les limites du plan
[ ] PayDunya : webhooks recus correctement
[ ] Emails Resend : taux de livraison normal
[ ] Logs Kucibok (/api/log) : pas d'anomalie
```

---

## ETAPE 9 — COUPURE VPS + ATLAS + CLOUDINARY

**Ne faire qu'apres 1 semaine de surveillance sans incident.**

```bash
# 9.1 Arreter le VPS Hostinger (PM2)
# Via Hostinger dashboard → VPS → Stop
# OU : ssh user@backend.kucibok.com → pm2 stop all

# 9.2 Supprimer le projet MongoDB Atlas
# Atlas dashboard → Project → Delete Project
# (Garder le backup local au minimum 30 jours)

# 9.3 Supprimer le compte Cloudinary
# Cloudinary dashboard → Account → Delete Account
# (Garder le backup local au minimum 30 jours)

# 9.4 Nettoyer le code (optionnel — sprint separe)
# - [FAIT] backend/ et frontend/ supprimes du repo (Mars 2026)
# - Supprimer packages inutiles du package.json : dotenv, socket.io-client
# - Les anciens packages serveur (mongoose, jsonwebtoken, bcryptjs, ioredis, cloudinary)
#   ne sont plus dans le repo
```

---

## PROCEDURE DE ROLLBACK

En cas de probleme critique avant l'etape 8 (bascule DNS) :

```bash
# 1. Remettre le vercel.json avec le proxy vers backend.kucibok.com
# (conserver une copie de l'ancien vercel.json avant de commencer)

# 2. Redeploy Vercel avec l'ancien vercel.json
vercel --prod

# 3. Les donnees MongoDB Atlas sont intactes (aucune ecriture pendant migration)
# Le VPS Hostinger est toujours actif.

# 4. Communiquer le statut a l'equipe.
```

**Apres l'etape 8 (bascule DNS), le rollback devient complexe.**
Prevoir 30-60 minutes de downtime pour revenir a l'ancienne infrastructure.

---

## CONTACTS D'URGENCE

```
Supabase status   : https://status.supabase.com
Vercel status     : https://www.vercel-status.com
PayDunya support  : https://app.paydunya.com/support
Resend support    : https://resend.com/support
Hostinger VPS     : https://www.hostinger.com/cpanel
MongoDB Atlas     : https://cloud.mongodb.com
```

---

*Document cree le 6 mars 2026 — Phase M4 production cutover*
