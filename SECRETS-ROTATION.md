# BLOCKER-3 — Checklist de rotation des secrets compromis

**Statut :** À compléter — les secrets ci-dessous ont été exposés dans l'historique Git.
**Fichiers mis à jour :** `backend/.env` et `backend/.env.production` contiennent des placeholders à remplacer.

---

## Ce qui a déjà été fait automatiquement

- [x] `JWT_SECRET` — nouveaux secrets générés et écrits dans `.env` et `.env.production`
- [x] `API_KEY` — nouvelles clés générées et écrites dans `.env` et `.env.production`
- [x] `WALLET_ENCRYPTION_KEY` — nouvelle clé générée et ajoutée dans `.env` (dev)
- [x] `.env` dev — live keys PayDunya remplacées par sandbox keys (corrige une erreur critique)
- [x] `.gitignore` — couvre correctement `.env` et `.env.*` (déjà en place)

---

## Actions manuelles à faire MAINTENANT

### 1. MongoDB Atlas (CRITIQUE)
**Clé compromise :** `tXI1f7MTNmT3e7if` (mot de passe user `aureliuskolani`)

**Étapes :**
1. Aller sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Connexion → projet Kucibok → **Database Access** (menu gauche)
3. Cliquer **Edit** sur l'utilisateur `aureliuskolani`
4. **Edit Password** → générer ou taper un nouveau mot de passe fort
5. **Update User**
6. Copier l'URI complète avec le nouveau mot de passe dans `backend/.env` :
   ```
   MONGODB_URI=mongodb+srv://aureliuskolani:NOUVEAU_MDP@kucibok.mmnychn.mongodb.net/?retryWrites=true&w=majority&appName=Kucibok
   ```

---

### 2. Resend API (CRITIQUE — emails compromis)
**Clé compromise :** `re_PbFQyWpj_6QLRDNzFz83QNSQ3KhnQMZig`

**Étapes :**
1. Aller sur [resend.com/api-keys](https://resend.com/api-keys)
2. Trouver la clé `re_PbFQyWpj_...` → **Revoke** (ou Delete)
3. **Create API Key** → nommer `kucibok-production`
4. Copier la nouvelle clé dans `backend/.env` :
   ```
   RESEND_API_KEY=re_NOUVELLE_CLE_ICI
   ```

---

### 3. Brevo SMTP (HAUTE — emails SMTP)
**Clé compromise :** `xsmtpsib-85a1d581151c44f2591b8b52537c7be39622595746ec95050e62c54e27aac76f-DJqyKtxZYryK2Itj`

**Étapes :**
1. Aller sur [app.brevo.com](https://app.brevo.com)
2. Connexion → **SMTP & API** (menu en haut)
3. Onglet **SMTP** → trouver la clé compromise → **Delete**
4. **Generate a new SMTP key** → nommer `kucibok`
5. Copier dans `backend/.env.production` :
   ```
   SMTP_PASS=NOUVELLE_CLE_BREVO_ICI
   ```

---

### 4. Hostinger Email (HAUTE)
**Mot de passe compromis :** `LideOfkucibok2026@`

**Étapes :**
1. Aller sur [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. **Emails** → choisir le compte email Kucibok
3. **Change Password** → nouveau mot de passe fort
4. Copier dans `backend/.env` :
   ```
   HOSTINGER_EMAIL_PASSWORD=NOUVEAU_MDP_ICI
   ```

---

### 5. PayDunya Live Keys (CRITIQUE — paiements réels)
**Clés compromises :**
- `PAYDUNYA_MASTER_KEY=bvT2pgh9-CxVR-Z5As-Yasr-UaCkxdEdA2Ab`
- `PAYDUNYA_PRIVATE_KEY=live_private_1GkGlbonNIW4Z9gLgkJGYba6rm8`
- `PAYDUNYA_TOKEN=ivji4MHsjzptQA1oUpEI`

**Étapes :**
1. Aller sur le dashboard PayDunya → **Settings** → **API Keys**
2. Consulter l'historique des transactions pour détecter des appels frauduleux
3. **Invalider** les clés live compromises
4. **Régénérer** de nouvelles clés live
5. Copier dans `backend/.env.production` :
   ```
   PAYDUNYA_MASTER_KEY=NOUVELLE_MASTER_KEY
   PAYDUNYA_PRIVATE_KEY=NOUVELLE_PRIVATE_KEY
   PAYDUNYA_TOKEN=NOUVEAU_TOKEN
   ```

---

### 6. MongoDB VPS — mot de passe `kuciadmin`
**Mot de passe compromis :** `kucibok@2025` (dans `backend/.env.production`)

**Étapes (sur le VPS Hostinger) :**
```bash
# Connexion SSH au VPS
ssh root@<IP_VPS>

# Connexion à MongoDB avec l'utilisateur admin
mongosh --authenticationDatabase admin -u <admin_root> -p

# Changer le mot de passe
use kucibok
db.changeUserPassword("kuciadmin", "NOUVEAU_MOT_DE_PASSE_FORT")
exit
```
Puis copier dans `backend/.env.production` :
```
MONGODB_URI=mongodb://kuciadmin:NOUVEAU_MDP@localhost:27017/kucibok?authSource=kucibok
```

---

### 7. WALLET_ENCRYPTION_KEY production
La clé dev est générée. Pour la production, générer une clé unique :
```bash
node -e "require('crypto').randomBytes(32).toString('hex')" | pbcopy
```
Copier dans `backend/.env.production` :
```
WALLET_ENCRYPTION_KEY=CLE_GENEREE_ICI
```
> ⚠️ Si des wallets ETH existent déjà en production, **NE PAS changer cette clé** — cela rendrait les wallets existants illisibles. Vérifier d'abord si des wallets sont en base.

---

### 8. Purger l'historique Git (recommandé mais optionnel)
Les secrets resteront dans l'historique Git même après commit. Si le dépôt est privé, risque limité. Si public ou compromis :
```bash
# Installer BFG Repo-Cleaner
# https://rtyley.github.io/bfg-repo-cleaner/

# Créer un fichier passwords.txt avec les secrets à purger
# Puis :
bfg --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

---

## Après avoir complété la checklist

Tester que tout fonctionne :
```bash
cd backend
npm run dev
# Vérifier : connexion MongoDB OK, emails OK, paiements sandbox OK
```

Marquer BLOCKER-3 comme résolu dans `roadmap.md`.
