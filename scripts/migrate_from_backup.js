/**
 * migrate_from_backup.js — Migration backup MongoDB (BSON) → Supabase
 *
 * Lit directement les fichiers BSON du dossier extrait de backup.tar.gz,
 * genere de vrais UUIDs pour chaque enregistrement, resout les foreign keys,
 * et insere dans Supabase PostgreSQL + Supabase Auth.
 *
 * USAGE (depuis le dossier scripts/) :
 *   node migrate_from_backup.js [options]
 *
 * OPTIONS :
 *   --dry-run               Simule sans ecrire dans Supabase
 *   --collection=<nom>      Migre une seule collection
 *   --migrate-images        Migre les images VPS → Supabase Storage
 *   --send-reset-emails     Envoie emails de reinitialisation aux users migres
 *   --skip-auth             Ne pas creer les comptes Supabase Auth (si deja fait)
 *
 * COLLECTIONS :
 *   users, categories, plans, artists, profiles, artworks,
 *   collections, transactions, subscriptions, delivery,
 *   blog, galleries, campaigns, logs, visitors
 *
 * PREREQUIS :
 *   1. Creer .env.migration depuis .env.migration.exemple
 *   2. Schema Supabase applique (001 + 002 + 003 SQL dans SQL Editor)
 *   3. yarn install (dans ce dossier)
 *
 * @module migrate_from_backup
 */

'use strict';

require('dotenv').config({ path: '.env.migration' });

const { BSON }         = require('bson');
const { createClient } = require('@supabase/supabase-js');
const crypto           = require('crypto');
const fs               = require('fs');
const path             = require('path');
const https            = require('https');
const http             = require('http');
const { URL: NodeURL } = require('url');

// ─── Configuration ────────────────────────────────────────────────────────────

const SUPABASE_URL  = process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BACKUP_PATH   = process.env.BACKUP_PATH
  || 'C:/Users/Moctar Sidibe/Downloads/backup_extracted/home/moctar/backup/kucibok';

const DRY_RUN      = process.argv.includes('--dry-run');
const MIGRATE_IMGS = process.argv.includes('--migrate-images');
const SKIP_AUTH    = process.argv.includes('--skip-auth');
const SEND_RESET   = process.argv.includes('--send-reset-emails');
const TARGET       = process.argv.find(a => a.startsWith('--collection='))?.split('=')[1] ?? 'all';

const BATCH_SIZE   = 50;
const IMG_DELAY_MS = 200;

/** Fichier de sauvegarde du mapping entre IDs MongoDB et UUIDs Supabase */
const ID_MAP_FILE = './migration_id_map.json';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('\n[ERREUR] Variables manquantes dans .env.migration :');
  console.error('  SUPABASE_URL               =', SUPABASE_URL ? 'OK' : 'MANQUANT');
  console.error('  SUPABASE_SERVICE_ROLE_KEY  =', SUPABASE_KEY ? 'OK' : 'MANQUANT');
  process.exit(1);
}
if (!fs.existsSync(BACKUP_PATH)) {
  console.error(`\n[ERREUR] BACKUP_PATH introuvable : ${BACKUP_PATH}`);
  console.error('Definir BACKUP_PATH dans .env.migration');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// ─── Logger ───────────────────────────────────────────────────────────────────

const log  = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);
const warn = (msg) => console.warn(`  [WARN] ${msg}`);

// ─── ID Maps — MongoDB ObjectId → UUID Supabase ───────────────────────────────

/**
 * Maps par collection : { mongoId: supabaseUUID }
 * Construit en Phase 1 (pre-generation) avant tout insert.
 *
 * @type {{ users: {}, artists: {}, artworks: {}, collections: {},
 *          categories: {}, plans: {}, blogs: {}, galleries: {},
 *          deliveries: {}, campaigns: {} }}
 */
const ID_MAPS = {
  users:      {},
  artists:    {},
  artworks:   {},
  collections: {},
  categories: {},
  plans:      {},
  blogs:      {},
  galleries:  {},
  deliveries: {},
  campaigns:  {},
};

/**
 * Charge un mapping precedent depuis le disque (reprise d'une migration partielle).
 */
function loadIdMaps() {
  if (fs.existsSync(ID_MAP_FILE)) {
    const saved = JSON.parse(fs.readFileSync(ID_MAP_FILE, 'utf-8'));
    Object.assign(ID_MAPS, saved);
    log(`Mapping precedent charge : ${Object.values(ID_MAPS).reduce((s, m) => s + Object.keys(m).length, 0)} entrees`);
  }
}

/**
 * Sauvegarde le mapping sur disque (permet de reprendre en cas d'erreur).
 */
function saveIdMaps() {
  if (!DRY_RUN) {
    fs.writeFileSync(ID_MAP_FILE, JSON.stringify(ID_MAPS, null, 2));
  }
}

// ─── Lecture BSON ─────────────────────────────────────────────────────────────

/**
 * Lit un fichier BSON et retourne les documents deserialises.
 *
 * @param {string} filename - Ex: "users.bson"
 * @returns {object[]}
 */
function readBson(filename) {
  const filepath = path.join(BACKUP_PATH, filename);
  if (!fs.existsSync(filepath)) { warn(`Fichier absent : ${filepath}`); return []; }
  const buf  = fs.readFileSync(filepath);
  const docs = [];
  let offset = 0;
  while (offset < buf.length) {
    const size = buf.readInt32LE(offset);
    if (size <= 4 || offset + size > buf.length) break;
    docs.push(BSON.deserialize(buf.slice(offset, offset + size)));
    offset += size;
  }
  return docs;
}

/**
 * Extrait la valeur string d'un ObjectId MongoDB (peu importe le type d'entree).
 *
 * @param {*} val
 * @returns {string|null}
 */
function oid(val) {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (val._bsontype === 'ObjectId') return val.toHexString ? val.toHexString() : val.toString();
  if (val.toString) return val.toString();
  return null;
}

/**
 * Convertit une date MongoDB en ISO string ou null.
 *
 * @param {*} val
 * @returns {string|null}
 */
function toDate(val) {
  if (!val) return null;
  try { const d = new Date(val); return isNaN(d.getTime()) ? null : d.toISOString(); } catch { return null; }
}

/**
 * Resout un MongoDB ObjectId en UUID Supabase via la map de la collection.
 * Retourne null si non trouve (FK optionnelle).
 *
 * @param {string} mapName - Cle dans ID_MAPS ("users", "artists", etc.)
 * @param {*} mongoRef     - ObjectId MongoDB ou string
 * @returns {string|null}
 */
function resolve(mapName, mongoRef) {
  const key = oid(mongoRef);
  if (!key) return null;
  return ID_MAPS[mapName]?.[key] ?? null;
}

// ─── Phase 1 : Pre-generation des UUIDs ───────────────────────────────────────

/**
 * Pre-genere un UUID Supabase pour chaque document de chaque collection.
 * Les UUIDs des users seront ecrases par les vrais UUIDs Supabase Auth en Phase 2.
 * Sauvegarde dans ID_MAPS pour resolution des FK.
 */
function pregenerateIds() {
  log('=== Phase 1 : Pre-generation des UUIDs ===');

  const files = {
    users:       'users.bson',
    artists:     'artists.bson',
    artworks:    'artworks.bson',
    collections: 'collections.bson',
    categories:  'categories.bson',
    plans:       'plans.bson',
    blogs:       'blogposts.bson',
    galleries:   'galleries.bson',
    deliveries:  'deliveryrequests.bson',
    campaigns:   'campaigns.bson',
  };

  for (const [mapName, filename] of Object.entries(files)) {
    const docs = readBson(filename);
    let newCount = 0;
    for (const doc of docs) {
      const mongoId = oid(doc._id);
      if (!mongoId) continue;
      // Ne pas ecraser un UUID deja genere (reprise de migration)
      if (!ID_MAPS[mapName][mongoId]) {
        ID_MAPS[mapName][mongoId] = crypto.randomUUID();
        newCount++;
      }
    }
    log(`  ${mapName} : ${docs.length} docs → ${newCount} nouveaux UUIDs`);
  }

  saveIdMaps();
  log('  Pre-generation terminee\n');
}

// ─── Insertion Supabase ───────────────────────────────────────────────────────

/**
 * Insere des lignes en lots dans Supabase (upsert sur id).
 * Silencieux en dry-run.
 *
 * @param {string}   table
 * @param {object[]} rows
 * @param {string}   [conflictCol='id']
 * @returns {Promise<number>}
 */
async function batchUpsert(table, rows, conflictCol = 'id') {
  if (rows.length === 0) return 0;
  if (DRY_RUN) { log(`  [DRY-RUN] ${table} : ${rows.length} lignes`); return rows.length; }
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(table).upsert(batch, { onConflict: conflictCol });
    if (error) warn(`${table} [${i}..${i + batch.length}] : ${error.message}`);
    else total += batch.length;
  }
  return total;
}

// ─── Migration images VPS → Supabase Storage ─────────────────────────────────

/**
 * Telecharge une image depuis une URL HTTP/HTTPS.
 *
 * @param {string} url
 * @returns {Promise<{ buffer: Buffer, contentType: string }>}
 */
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    let parsed;
    try { parsed = new NodeURL(url); } catch { return reject(new Error(`URL invalide: ${url}`)); }
    const transport = parsed.protocol === 'https:' ? https : http;
    const req = transport.get(url, { timeout: 25_000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] ?? 'image/jpeg' }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout 25s')); });
  });
}

/**
 * Construit un chemin Storage lisible depuis l'URL VPS.
 * Ex: /uploads/2025/01/img.jpg → artwork_2025_01_img.jpg
 *
 * @param {string} url
 * @param {string} prefix
 * @returns {string}
 */
function buildStoragePath(url, prefix) {
  try {
    const p    = new NodeURL(url);
    const segs = p.pathname.split('/').filter(s => s && s !== 'uploads');
    return `${prefix}_${segs.join('_').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  } catch {
    return `${prefix}_${Date.now()}.jpg`;
  }
}

/**
 * Upload un buffer vers Supabase Storage et retourne l'URL publique.
 *
 * @param {string} bucket
 * @param {string} storagePath
 * @param {Buffer} buffer
 * @param {string} contentType
 * @returns {Promise<string>}
 */
async function uploadToStorage(bucket, storagePath, buffer, contentType) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, { contentType, upsert: true });
  if (error) throw new Error(`${bucket}/${storagePath}: ${error.message}`);
  return supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
}

/**
 * Migre une image vers Supabase Storage si --migrate-images est actif.
 * Sinon retourne l'URL originale.
 *
 * @param {string|null} url
 * @param {string} bucket
 * @param {string} prefix
 * @returns {Promise<string|null>}
 */
async function migrateImage(url, bucket, prefix) {
  if (!url || !MIGRATE_IMGS) return url ?? null;
  try {
    const { buffer, contentType } = await downloadImage(url);
    const sp  = buildStoragePath(url, prefix);
    const newUrl = await uploadToStorage(bucket, sp, buffer, contentType);
    return newUrl;
  } catch (err) {
    warn(`Image echouee (${url.slice(0, 50)}): ${err.message}`);
    return url;
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Phase 2 : Migrations par collection ─────────────────────────────────────

/**
 * Migre les utilisateurs vers Supabase Auth + public.users.
 * Cree chaque compte avec un mot de passe temporaire.
 * Met a jour ID_MAPS.users avec les vrais UUIDs Supabase Auth.
 *
 * @returns {Promise<void>}
 */
async function migrateUsers() {
  log('=== Migration : users ===');
  const docs = readBson('users.bson');
  log(`  Lu : ${docs.length} utilisateurs`);

  const publicRows = [];
  let created = 0, existing = 0, errors = 0;

  for (let i = 0; i < docs.length; i++) {
    const doc     = docs[i];
    const mongoId = oid(doc._id);
    if (!doc.email) { warn(`User sans email ignore: ${mongoId}`); errors++; continue; }

    process.stdout.write(`  [${i + 1}/${docs.length}] ${doc.email} ... `);

    if (DRY_RUN) { console.log('[DRY-RUN]'); continue; }

    if (SKIP_AUTH) {
      // Recuperer le vrai UUID depuis Supabase Auth (si migration Auth deja faite)
      const { data: { users: list } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const found = list?.find(u => u.email === doc.email);
      if (found) {
        ID_MAPS.users[mongoId] = found.id;
        console.log(`existant → ${found.id}`);
        existing++;
      } else {
        console.log('non trouve dans Auth, garde UUID pre-genere');
      }
      continue;
    }

    const tempPwd = `KCB_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email:         doc.email,
      password:      tempPwd,
      email_confirm: true,
      user_metadata: { name: doc.name ?? '', role: doc.role ?? 'collector', migrated: true },
    });

    if (authError) {
      if (authError.message?.includes('already') || authError.message?.includes('registered')) {
        const { data: { users: list } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
        const found = list?.find(u => u.email === doc.email);
        if (found) { ID_MAPS.users[mongoId] = found.id; console.log('existant'); existing++; }
        else { console.error(`CONFLIT non resolu: ${authError.message}`); errors++; }
      } else { console.error(`ERREUR: ${authError.message}`); errors++; }
      continue;
    }

    // Ecraser le UUID pre-genere par le vrai UUID Supabase Auth
    const supabaseId = authData.user.id;
    ID_MAPS.users[mongoId] = supabaseId;
    console.log(`OK → ${supabaseId}`);
    created++;

    if (SEND_RESET) {
      await supabase.auth.resetPasswordForEmail(doc.email, {
        redirectTo: 'https://kucibok.com/forgot-password-form',
      });
    }

    // La ligne public.users est cree automatiquement par le trigger handle_new_user.
    // On fait un upsert pour completer les champs supplementaires.
    publicRows.push({
      id:                   supabaseId,
      name:                 doc.name ?? null,
      role:                 ['collector','artist','professional','admin'].includes(doc.role) ? doc.role : 'collector',
      country:              doc.country ?? null,
      telephone:            doc.telephone ?? null,
      auth_provider:        'email',
      is_active:            doc.isActive !== false,
      profile_completed:    !!doc.profileCompleted,
      onboarding_completed: !!doc.onboardingCompleted,
      last_login:           toDate(doc.lastLogin),
      created_at:           toDate(doc.createdAt) ?? new Date().toISOString(),
    });
  }

  saveIdMaps();

  if (publicRows.length > 0) {
    const n = await batchUpsert('users', publicRows);
    log(`  public.users completes : ${n}`);
  }

  log(`  Resultats : crees=${created} existants=${existing} erreurs=${errors}`);
}

/**
 * Migre les categories.
 *
 * @returns {Promise<void>}
 */
async function migrateCategories() {
  log('=== Migration : categories ===');
  const docs = readBson('categories.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:         ID_MAPS.categories[oid(doc._id)],
    name:       doc.name ?? 'Sans nom',
    image:      doc.image ?? null,
    created_at: toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('categories', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les plans d'abonnement.
 *
 * @returns {Promise<void>}
 */
async function migratePlans() {
  log('=== Migration : plans ===');
  const docs = readBson('plans.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:            ID_MAPS.plans[oid(doc._id)],
    name:          doc.name ?? 'Plan',
    description:   doc.description ?? null,
    price:         doc.price ?? 0,
    currency:      doc.currency ?? 'XOF',
    duration_days: doc.durationDays ?? (doc.duration === 'yearly' ? 365 : 30),
    role:          doc.role ?? null,
    features:      Array.isArray(doc.features) ? doc.features : [],
    is_active:     doc.isActive !== false,
    created_at:    toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('plans', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les artistes avec migration optionnelle des images.
 *
 * @returns {Promise<void>}
 */
async function migrateArtists() {
  log('=== Migration : artists ===');
  const docs = readBson('artists.bson');
  log(`  Lu : ${docs.length}`);

  const rows = [];
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    process.stdout.write(`  [${i + 1}/${docs.length}] ${doc.name ?? '?'} ... `);
    const imageUrl = await migrateImage(doc.image, 'profiles', 'artist');
    if (MIGRATE_IMGS) await sleep(IMG_DELAY_MS);
    console.log(MIGRATE_IMGS ? 'image OK' : 'ok');

    rows.push({
      id:             ID_MAPS.artists[oid(doc._id)],
      user_id:        resolve('users', doc.userId),
      name:           doc.name ?? null,
      username:       doc.username ?? null,
      image:          imageUrl,
      country:        doc.country ?? null,
      biography:      doc.biography ?? null,
      portfolio:      doc.portfolio ?? null,
      facebook:       doc.facebook ?? null,
      twitter:        doc.twitter ?? null,
      instagram:      doc.instagram ?? null,
      visited:        doc.visited ?? 0,
      featured:       !!doc.featured,
      artwork_count:  doc.artworkCount ?? 0,
      total_sales:    doc.totalSales ?? 0,
      total_earnings: doc.totalEarnings ?? 0,
      created_at:     toDate(doc.createdAt) ?? new Date().toISOString(),
    });
  }

  const n = await batchUpsert('artists', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les profils collectionneurs/professionnels.
 *
 * @returns {Promise<void>}
 */
async function migrateProfiles() {
  log('=== Migration : profiles ===');
  const docs = readBson('profiles.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:             crypto.randomUUID(), // pas de map pre-generee pour profiles
    user_id:        resolve('users', doc.userId),
    username:       doc.username ?? null,
    name:           doc.name ?? null,
    country:        doc.country ?? null,
    interests:      Array.isArray(doc.interests) ? doc.interests.join(', ') : (doc.interests ?? null),
    institution:    doc.institution ?? null,
    qualifications: doc.qualifications ?? null,
    image:          doc.image ?? null,
    created_at:     toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('profiles', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les collections.
 *
 * @returns {Promise<void>}
 */
async function migrateCollections() {
  log('=== Migration : collections ===');
  const docs = readBson('collections.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:          ID_MAPS.collections[oid(doc._id)],
    user_id:     resolve('users', doc.userId),
    name:        doc.name ?? 'Collection',
    description: doc.description ?? null,
    image:       doc.image ?? null,
    created_at:  toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('collections', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les oeuvres d'art avec migration optionnelle des images.
 * Inclut la migration des likes (likedArtworks dans users).
 *
 * @returns {Promise<void>}
 */
async function migrateArtworks() {
  log('=== Migration : artworks (575 attendus) ===');
  const docs = readBson('artworks.bson');
  log(`  Lu : ${docs.length}`);

  const rows = [];
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    if (i % 50 === 0) process.stdout.write(`  [${i}/${docs.length}]... `);
    const imageUrl = await migrateImage(doc.image, 'artworks', 'artwork');
    if (MIGRATE_IMGS) await sleep(IMG_DELAY_MS);

    rows.push({
      id:                  ID_MAPS.artworks[oid(doc._id)],
      kucibok_id:          doc.kuciobkId ?? doc.kucibokId ?? null,
      user_id:             resolve('users', doc.userId),
      artist_id:           resolve('artists', doc.artistId),
      owner_id:            resolve('users', doc.ownerId ?? doc.userId),
      collection_id:       resolve('collections', doc.collectionId),
      title:               doc.title ?? 'Sans titre',
      description:         doc.description ?? null,
      image:               imageUrl,
      medium:              doc.medium ?? null,
      condition:           ['excellent','very_good','good','fair'].includes(doc.condition) ? doc.condition : null,
      provenance:          doc.provenance ?? null,
      height:              doc.height ?? null,
      width:               doc.width ?? null,
      weight:              doc.weight ?? null,
      price:               doc.price ?? 0,
      currency:            doc.currency ?? 'XOF',
      category:            doc.category ?? null,
      tags:                Array.isArray(doc.tags) ? doc.tags : [],
      for_sale:            !!doc.forSale,
      sold:                !!doc.sold,
      sold_at:             toDate(doc.soldAt),
      sold_price:          doc.soldPrice ?? null,
      sold_currency:       doc.soldCurrency ?? 'XOF',
      for_bid:             !!doc.forBid,
      auction_status:      doc.auctionStatus ?? 'not_for_auction',
      availability_status: doc.availabilityStatus ?? 'available',
      status:              ['pending','approved','rejected','sold'].includes(doc.status) ? doc.status : 'pending',
      featured:            !!doc.featured,
      visited:             doc.visited ?? 0,
      likes_count:         Array.isArray(doc.likes) ? doc.likes.length : 0,
      certificate_path:    doc.certificatePath ?? null,
      edition_number:      doc.edition?.number ?? 1,
      edition_total:       doc.edition?.total  ?? 1,
      average_rating:      doc.averageRating ?? 0,
      delivery_details:    typeof doc.deliveryDetails === 'string' ? doc.deliveryDetails : null,
      created_at:          toDate(doc.createdAt ?? doc.created) ?? new Date().toISOString(),
      updated_at:          toDate(doc.updatedAt) ?? new Date().toISOString(),
    });
  }
  if (docs.length) console.log();

  const n = await batchUpsert('artworks', rows);
  log(`  Inseres : ${n}`);

  // Likes : likedArtworks[] dans chaque user
  log('  Migration liked_artworks...');
  const users = readBson('users.bson');
  const likeRows = [];
  for (const user of users) {
    if (!Array.isArray(user.likedArtworks) || !user.likedArtworks.length) continue;
    const userId = resolve('users', user._id);
    if (!userId) continue;
    for (const artworkRef of user.likedArtworks) {
      const artworkId = resolve('artworks', artworkRef);
      if (artworkId) likeRows.push({ user_id: userId, artwork_id: artworkId });
    }
  }
  if (likeRows.length) {
    const ln = await batchUpsert('liked_artworks', likeRows, 'user_id,artwork_id');
    log(`  Likes inseres : ${ln}`);
  }
}

/**
 * Migre les transactions.
 *
 * @returns {Promise<void>}
 */
async function migrateTransactions() {
  log('=== Migration : transactions ===');
  const docs = readBson('transactions.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:             crypto.randomUUID(),
    artwork_id:     resolve('artworks', doc.artworkId),
    buyer_id:       resolve('users', doc.buyerId),
    seller_id:      resolve('users', doc.sellerId),
    amount:         doc.amount ?? 0,
    currency:       doc.currency ?? 'XOF',
    status:         doc.status ?? 'pending',
    payment_method: doc.paymentMethod ?? null,
    payment_ref:    doc.paymentRef ?? doc.token ?? null,
    created_at:     toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('transactions', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les abonnements.
 *
 * @returns {Promise<void>}
 */
async function migrateSubscriptions() {
  log('=== Migration : subscriptions ===');
  const docs = readBson('subscriptions.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:          crypto.randomUUID(),
    user_id:     resolve('users', doc.userId),
    plan_id:     resolve('plans', doc.planId),
    status:      doc.status ?? 'active',
    start_date:  toDate(doc.startDate) ?? new Date().toISOString(),
    end_date:    toDate(doc.endDate),
    payment_ref: doc.paymentRef ?? null,
    created_at:  toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('subscriptions', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les demandes de livraison.
 *
 * @returns {Promise<void>}
 */
async function migrateDelivery() {
  log('=== Migration : delivery_requests ===');
  const docs = readBson('deliveryrequests.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:                   ID_MAPS.deliveries[oid(doc._id)] ?? crypto.randomUUID(),
    user_id:              resolve('users', doc.userId),
    tracking_id:          doc.trackingId ?? null,
    status:               doc.status ?? 'pending',
    corridor:             doc.corridor ?? 'AF_TO_FR',
    origin_country:       doc.originCountry ?? null,
    delivery_address:     doc.deliveryAddress ?? null,
    recipient_name:       doc.recipientName ?? null,
    recipient_phone:      doc.recipientPhone ?? null,
    special_instructions: doc.specialInstructions ?? null,
    insurance_required:   !!doc.insuranceRequired,
    package_size:         doc.packageSize ?? null,
    package_weight:       doc.packageWeight ?? null,
    delivery_priority:    doc.deliveryPriority ?? 'standard',
    payment_status:       doc.paymentStatus ?? 'pending',
    price:                doc.price ?? null,
    currency:             doc.currency ?? 'XOF',
    museum_wrap:          !!(doc.checklist?.museumWrap),
    bubble_wrap:          !!(doc.checklist?.bubbleWrap),
    crate:                !!(doc.checklist?.crate),
    fragile_label:        !!(doc.checklist?.fragileLabel),
    humidity_control:     !!(doc.checklist?.humidityControl),
    created_at:           toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('delivery_requests', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les articles de blog.
 *
 * @returns {Promise<void>}
 */
async function migrateBlog() {
  log('=== Migration : blog_posts ===');
  const docs = readBson('blogposts.bson');
  log(`  Lu : ${docs.length}`);

  const rows = [];
  for (const doc of docs) {
    const imageUrl = await migrateImage(doc.image, 'blogs', 'blog');
    if (MIGRATE_IMGS) await sleep(IMG_DELAY_MS);
    rows.push({
      id:         ID_MAPS.blogs[oid(doc._id)] ?? crypto.randomUUID(),
      user_id:    resolve('users', doc.userId),
      title:      doc.title ?? 'Sans titre',
      content:    doc.content ?? null,
      image:      imageUrl,
      category:   doc.category ?? null,
      tags:       Array.isArray(doc.tags) ? doc.tags : [],
      published:  !!doc.published,
      views:      doc.views ?? 0,
      created_at: toDate(doc.createdAt) ?? new Date().toISOString(),
      updated_at: toDate(doc.updatedAt) ?? new Date().toISOString(),
    });
  }

  const n = await batchUpsert('blog_posts', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les galeries.
 *
 * @returns {Promise<void>}
 */
async function migrateGalleries() {
  log('=== Migration : galleries ===');
  const docs = readBson('galleries.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:          ID_MAPS.galleries[oid(doc._id)] ?? crypto.randomUUID(),
    user_id:     resolve('users', doc.userId),
    name:        doc.name ?? null,
    description: doc.description ?? null,
    image:       doc.image ?? null,
    location:    doc.location ?? null,
    website:     doc.website ?? null,
    created_at:  toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('galleries', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les campagnes email.
 *
 * @returns {Promise<void>}
 */
async function migrateCampaigns() {
  log('=== Migration : campaigns ===');
  const docs = readBson('campaigns.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:         ID_MAPS.campaigns[oid(doc._id)] ?? crypto.randomUUID(),
    user_id:    resolve('users', doc.userId),
    name:       doc.name ?? null,
    subject:    doc.subject ?? null,
    content:    doc.content ?? null,
    status:     doc.status ?? 'draft',
    sent_at:    toDate(doc.sentAt),
    created_at: toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('campaigns', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les logs d'activite (gros volume, inseris en dernier).
 *
 * @returns {Promise<void>}
 */
async function migrateLogs() {
  log('=== Migration : logs ===');
  const docs = readBson('logs.bson');
  log(`  Lu : ${docs.length} (peut prendre du temps)`);

  const rows = docs.map(doc => ({
    id:          crypto.randomUUID(),
    user_id:     resolve('users', doc.userId),
    description: doc.description ?? null,
    action:      doc.action ?? null,
    entity:      doc.entity ?? null,
    entity_id:   oid(doc.entityId),
    created_at:  toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('logs', rows);
  log(`  Inseres : ${n}`);
}

/**
 * Migre les visiteurs (gros volume).
 *
 * @returns {Promise<void>}
 */
async function migrateVisitors() {
  log('=== Migration : visitors ===');
  const docs = readBson('visitors.bson');
  log(`  Lu : ${docs.length}`);

  const rows = docs.map(doc => ({
    id:         crypto.randomUUID(),
    ip:         doc.ip ?? null,
    country:    doc.country ?? null,
    page:       doc.page ?? null,
    user_agent: doc.userAgent ?? null,
    created_at: toDate(doc.createdAt) ?? new Date().toISOString(),
  }));

  const n = await batchUpsert('visitors', rows);
  log(`  Inseres : ${n}`);
}

// ─── Runner ───────────────────────────────────────────────────────────────────

/** Ordre de migration strict (respecte les dependances FK) */
const MIGRATIONS = [
  ['users',         migrateUsers],
  ['categories',    migrateCategories],
  ['plans',         migratePlans],
  ['artists',       migrateArtists],
  ['profiles',      migrateProfiles],
  ['collections',   migrateCollections],
  ['artworks',      migrateArtworks],
  ['transactions',  migrateTransactions],
  ['subscriptions', migrateSubscriptions],
  ['delivery',      migrateDelivery],
  ['blog',          migrateBlog],
  ['galleries',     migrateGalleries],
  ['campaigns',     migrateCampaigns],
  ['logs',          migrateLogs],
  ['visitors',      migrateVisitors],
];

/**
 * Point d'entree principal.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const SEP = '='.repeat(60);
  log(`\n${SEP}`);
  log('Kucibok — Migration backup BSON → Supabase');
  log(`Mode      : ${DRY_RUN ? 'DRY-RUN (aucune ecriture)' : 'LIVE'}`);
  log(`Collection: ${TARGET}`);
  log(`Images    : ${MIGRATE_IMGS ? 'migration active (VPS → Storage)' : 'URL originales conservees'}`);
  log(`Reset pwd : ${SEND_RESET ? 'oui (emails de reinitialisation)' : 'non'}`);
  log(`Backup    : ${BACKUP_PATH}`);
  log(`${SEP}\n`);

  // Charger un mapping existant (reprise de migration partielle)
  loadIdMaps();

  // Phase 1 : Pre-generation des UUIDs pour toutes les collections
  pregenerateIds();

  // Phase 2 : Insertion dans Supabase
  const toRun = TARGET === 'all'
    ? MIGRATIONS
    : MIGRATIONS.filter(([name]) => name === TARGET);

  if (TARGET !== 'all' && toRun.length === 0) {
    const names = MIGRATIONS.map(([n]) => n).join(', ');
    console.error(`Collection inconnue: "${TARGET}". Options: ${names}`);
    process.exit(1);
  }

  log('=== Phase 2 : Insertion Supabase ===\n');
  for (const [name, fn] of toRun) {
    try {
      await fn();
      saveIdMaps();
      log(`  [OK] ${name}\n`);
    } catch (err) {
      warn(`Migration "${name}" echouee : ${err.message}`);
      if (process.env.DEBUG) console.error(err.stack);
      log('');
    }
  }

  log(`${SEP}`);
  log('Migration terminee.');

  if (!DRY_RUN && !MIGRATE_IMGS) {
    log('');
    log('IMPORTANT : Les 573 images restent sur backend.kucibok.com (VPS expire 19 mars).');
    log('Relancer avec --migrate-images pour les copier vers Supabase Storage :');
    log('  node migrate_from_backup.js --migrate-images --collection=artworks');
  }
  log(`${SEP}\n`);
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
