/**
 * migrate_mongodb.js — Script de migration MongoDB Atlas → Supabase PostgreSQL
 *
 * USAGE :
 *   node scripts/migrate_mongodb.js [--dry-run] [--collection=artworks]
 *
 * PRÉREQUIS :
 *   1. Schéma Supabase déjà créé (001_initial_schema.sql + 002_rls_policies.sql)
 *   2. Variables d'env définies (voir .env.migration.exemple)
 *   3. yarn add mongoose @supabase/supabase-js dotenv
 *
 * ORDRE DE MIGRATION :
 *   1. users          (users MongoDB → Supabase Auth + public.users)
 *   2. artists        (artist profiles)
 *   3. profiles       (collector/pro profiles)
 *   4. categories
 *   5. plans
 *   6. artworks
 *   7. collections
 *   8. liked_artworks
 *   9. transactions
 *  10. subscriptions
 *  11. delivery_requests + events
 *  12. sourcing_inquiries
 *  13. blog_posts
 *  14. clients, contacts, campaigns, crm_clients
 *  15. logs
 *
 * @module migrate_mongodb
 */

'use strict';

require('dotenv').config({ path: '.env.migration' });

const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

// ─── Configuration ────────────────────────────────────────────────────────────

const MONGODB_URI    = process.env.MONGODB_URI;
const SUPABASE_URL   = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY; // clé service role — PAS anon key

const DRY_RUN        = process.argv.includes('--dry-run');
const TARGET         = process.argv.find(a => a.startsWith('--collection='))?.split('=')[1] ?? 'all';
const BATCH_SIZE     = 50; // Supabase recommande des lots de 50-100

if (!MONGODB_URI || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[ERREUR] Variables manquantes : MONGODB_URI, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// ─── Logger ───────────────────────────────────────────────────────────────────

/** @param {string} msg */
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

/** @param {string} msg */
const warn = (msg) => console.warn(`[WARN] ${msg}`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Insère des enregistrements en lots dans Supabase.
 * Skips silently les conflits (upsert).
 *
 * @param {string} table
 * @param {object[]} rows
 * @returns {Promise<number>} Nombre d'enregistrements insérés
 */
async function batchUpsert(table, rows) {
  if (DRY_RUN) {
    log(`[DRY-RUN] ${table} : ${rows.length} enregistrements (non insérés)`);
    return rows.length;
  }

  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error, count } = await supabase.from(table).upsert(batch, { onConflict: 'id' });
    if (error) {
      warn(`${table} lot ${i}-${i + BATCH_SIZE} : ${error.message}`);
    } else {
      total += batch.length;
    }
  }
  return total;
}

// ─── Modèles Mongoose légers (read-only) ─────────────────────────────────────

const UserSchema = new mongoose.Schema({}, { strict: false });
const ArtistSchema = new mongoose.Schema({}, { strict: false });
const ProfileSchema = new mongoose.Schema({}, { strict: false });
const ArtworkSchema = new mongoose.Schema({}, { strict: false });
const CollectionSchema = new mongoose.Schema({}, { strict: false });
const CategorySchema = new mongoose.Schema({}, { strict: false });
const PlanSchema = new mongoose.Schema({}, { strict: false });
const TransactionSchema = new mongoose.Schema({}, { strict: false });
const SubscriptionSchema = new mongoose.Schema({}, { strict: false });
const DeliverySchema = new mongoose.Schema({}, { strict: false });
const SourcingSchema = new mongoose.Schema({}, { strict: false });
const BlogSchema = new mongoose.Schema({}, { strict: false });
const LogSchema = new mongoose.Schema({}, { strict: false });
const ClientSchema = new mongoose.Schema({}, { strict: false });
const ContactSchema = new mongoose.Schema({}, { strict: false });
const CampaignSchema = new mongoose.Schema({}, { strict: false });
const CrmClientSchema = new mongoose.Schema({}, { strict: false });

const User        = mongoose.model('User',        UserSchema,        'users');
const Artist      = mongoose.model('Artist',      ArtistSchema,      'artists');
const Profile     = mongoose.model('Profile',     ProfileSchema,     'profiles');
const Artwork     = mongoose.model('Artwork',     ArtworkSchema,     'artworks');
const Collection  = mongoose.model('Collection',  CollectionSchema,  'collections');
const Category    = mongoose.model('Category',    CategorySchema,    'categories');
const Plan        = mongoose.model('Plan',        PlanSchema,        'plans');
const Transaction = mongoose.model('Transaction', TransactionSchema, 'transactions');
const Subscription = mongoose.model('Subscription', SubscriptionSchema, 'subscriptions');
const Delivery    = mongoose.model('DeliveryRequest', DeliverySchema, 'deliveryrequests');
const Sourcing    = mongoose.model('SourcingInquiry', SourcingSchema, 'sourcinginquiries');
const BlogPost    = mongoose.model('BlogPost',    BlogSchema,        'blogposts');
const Log         = mongoose.model('Log',         LogSchema,         'logs');
const Client      = mongoose.model('Client',      ClientSchema,      'clients');
const Contact     = mongoose.model('Contact',     ContactSchema,     'contacts');
const Campaign    = mongoose.model('Campaign',    CampaignSchema,    'campaigns');
const CrmClient   = mongoose.model('CrmClient',   CrmClientSchema,   'crmclients');

// ─── Migrations par collection ────────────────────────────────────────────────

/**
 * Mappe un ObjectId MongoDB vers une string UUID-compatible.
 * NOTE : Supabase utilise UUID v4. Les ObjectIds MongoDB (24 chars hex)
 * seront stockés comme TEXT dans les champs id.
 * Alternativement, générer de vrais UUIDs et maintenir une table de mapping.
 *
 * Stratégie choisie : conserver les ObjectIds comme IDs (TEXT PRIMARY KEY)
 * pendant la migration, puis les remplacer en Phase 4 production.
 *
 * @param {object} doc - Document Mongoose
 * @returns {string}
 */
const mongoId = (doc) => doc?._id?.toString?.() ?? doc?.id?.toString?.();

/**
 * Migre les utilisateurs MongoDB → public.users Supabase.
 * ATTENTION : ne crée PAS les comptes Supabase Auth (mots de passe).
 * La migration Auth se fait via `supabase auth import` (CLI) séparément.
 *
 * @returns {Promise<void>}
 */
async function migrateUsers() {
  log('=== Migration : users ===');
  const docs = await User.find({}).lean();
  log(`  ${docs.length} utilisateurs trouvés`);

  const rows = docs.map(doc => ({
    id:          mongoId(doc),
    name:        doc.name ?? null,
    username:    doc.username ?? null,
    role:        ['collector','artist','professional','admin'].includes(doc.role) ? doc.role : 'collector',
    country:     doc.country ?? null,
    telephone:   doc.telephone ?? null,
    is_active:   doc.isActive !== false,
    created_at:  doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('users', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les profils artistes.
 *
 * @returns {Promise<void>}
 */
async function migrateArtists() {
  log('=== Migration : artists ===');
  const docs = await Artist.find({}).lean();
  log(`  ${docs.length} artistes trouvés`);

  const rows = docs.map(doc => ({
    id:          mongoId(doc),
    user_id:     doc.userId?.toString() ?? null,
    name:        doc.name ?? null,
    username:    doc.username ?? null,
    image:       doc.image ?? null,
    country:     doc.country ?? null,
    biography:   doc.biography ?? null,
    portfolio:   doc.portfolio ?? null,
    facebook:    doc.socials?.facebook ?? doc.facebook ?? null,
    twitter:     doc.socials?.twitter  ?? doc.twitter  ?? null,
    instagram:   doc.socials?.instagram ?? doc.instagram ?? null,
    artwork_count: doc.artworkCount ?? 0,
    visited:     doc.visited ?? 0,
    created_at:  doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('artists', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les profils collectionneurs / professionnels.
 *
 * @returns {Promise<void>}
 */
async function migrateProfiles() {
  log('=== Migration : profiles ===');
  const docs = await Profile.find({}).lean();
  log(`  ${docs.length} profils trouvés`);

  const rows = docs.map(doc => ({
    id:             mongoId(doc),
    user_id:        doc.userId?.toString() ?? null,
    username:       doc.username ?? null,
    name:           doc.name ?? null,
    country:        doc.country ?? null,
    interests:      Array.isArray(doc.interests) ? doc.interests.join(', ') : doc.interests ?? null,
    institution:    doc.institution ?? null,
    qualifications: doc.qualifications ?? null,
    image:          doc.image ?? null,
    created_at:     doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('profiles', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les catégories.
 *
 * @returns {Promise<void>}
 */
async function migrateCategories() {
  log('=== Migration : categories ===');
  const docs = await Category.find({}).lean();
  log(`  ${docs.length} catégories trouvées`);

  const rows = docs.map(doc => ({
    id:         mongoId(doc),
    name:       doc.name,
    image:      doc.image ?? null,
    created_at: doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('categories', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les plans d'abonnement.
 *
 * @returns {Promise<void>}
 */
async function migratePlans() {
  log('=== Migration : plans ===');
  const docs = await Plan.find({}).lean();
  log(`  ${docs.length} plans trouvés`);

  const rows = docs.map(doc => ({
    id:            mongoId(doc),
    name:          doc.name,
    price:         doc.price ?? 0,
    currency:      doc.currency ?? 'XOF',
    duration_days: doc.durationDays ?? doc.duration ?? 30,
    features:      Array.isArray(doc.features) ? doc.features : [],
    is_active:     doc.isActive !== false,
    created_at:    doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('plans', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les œuvres d'art.
 *
 * @returns {Promise<void>}
 */
async function migrateArtworks() {
  log('=== Migration : artworks ===');
  const docs = await Artwork.find({}).lean();
  log(`  ${docs.length} œuvres trouvées`);

  const rows = docs.map(doc => ({
    id:                  mongoId(doc),
    kucibok_id:          doc.kuciobkId ?? doc.kucibok_id ?? null,
    user_id:             doc.userId?.toString() ?? null,
    artist_id:           doc.artistId?.toString() ?? null,
    owner_id:            doc.ownerId?.toString() ?? doc.userId?.toString() ?? null,
    collection_id:       doc.collectionId?.toString() ?? null,
    title:               doc.title ?? 'Sans titre',
    description:         doc.description ?? null,
    image:               doc.image ?? null,
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
    sold_at:             doc.soldAt ?? null,
    sold_price:          doc.soldPrice ?? null,
    for_bid:             !!doc.forBid,
    auction_status:      doc.auctionStatus ?? 'not_for_auction',
    availability_status: doc.availabilityStatus ?? 'available',
    status:              ['pending','approved','rejected','sold'].includes(doc.status) ? doc.status : 'pending',
    featured:            !!doc.featured,
    visited:             doc.visited ?? 0,
    likes_count:         Array.isArray(doc.likes) ? doc.likes.length : (doc.likesCount ?? 0),
    certificate_path:    doc.certificatePath ?? null,
    etherscan:           doc.etherscan ?? null,
    edition_number:      doc.editionNumber ?? 1,
    edition_total:       doc.editionTotal ?? 1,
    average_rating:      doc.averageRating ?? 0,
    created_at:          doc.createdAt ?? new Date(),
    updated_at:          doc.updatedAt ?? new Date(),
  }));

  const inserted = await batchUpsert('artworks', rows);
  log(`  Insérés : ${inserted}`);

  // Migrer les likes (array dans le doc artwork)
  log('  Migration likes...');
  const likeRows = [];
  for (const doc of docs) {
    if (!Array.isArray(doc.likes)) continue;
    for (const userId of doc.likes) {
      likeRows.push({
        user_id:    userId?.toString(),
        artwork_id: mongoId(doc),
      });
    }
  }
  if (likeRows.length > 0) {
    const likeInserted = await batchUpsert('liked_artworks', likeRows);
    log(`  Likes insérés : ${likeInserted}`);
  }
}

/**
 * Migre les collections.
 *
 * @returns {Promise<void>}
 */
async function migrateCollections() {
  log('=== Migration : collections ===');
  const docs = await Collection.find({}).lean();
  log(`  ${docs.length} collections trouvées`);

  const rows = docs.map(doc => ({
    id:          mongoId(doc),
    user_id:     doc.userId?.toString() ?? null,
    name:        doc.name ?? 'Collection',
    description: doc.description ?? null,
    image:       doc.image ?? null,
    created_at:  doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('collections', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les transactions.
 *
 * @returns {Promise<void>}
 */
async function migrateTransactions() {
  log('=== Migration : transactions ===');
  const docs = await Transaction.find({}).lean();
  log(`  ${docs.length} transactions trouvées`);

  const rows = docs.map(doc => ({
    id:             mongoId(doc),
    artwork_id:     doc.artworkId?.toString() ?? null,
    buyer_id:       doc.buyerId?.toString() ?? null,
    seller_id:      doc.sellerId?.toString() ?? null,
    amount:         doc.amount ?? 0,
    currency:       doc.currency ?? 'XOF',
    status:         doc.status ?? 'pending',
    payment_method: doc.paymentMethod ?? null,
    payment_ref:    doc.paymentRef ?? doc.token ?? null,
    created_at:     doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('transactions', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les abonnements.
 *
 * @returns {Promise<void>}
 */
async function migrateSubscriptions() {
  log('=== Migration : subscriptions ===');
  const docs = await Subscription.find({}).lean();
  log(`  ${docs.length} abonnements trouvés`);

  const rows = docs.map(doc => ({
    id:                mongoId(doc),
    user_id:           doc.userId?.toString() ?? null,
    plan_id:           doc.planId?.toString() ?? null,
    status:            doc.status ?? 'active',
    start_date:        doc.startDate ?? new Date(),
    end_date:          doc.endDate ?? null,
    next_payment_date: doc.nextPaymentDate ?? null,
    amount:            doc.amount ?? 0,
    currency:          doc.currency ?? 'XOF',
    payment_ref:       doc.paymentRef ?? null,
    created_at:        doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('subscriptions', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les demandes de livraison.
 *
 * @returns {Promise<void>}
 */
async function migrateDelivery() {
  log('=== Migration : delivery_requests ===');
  const docs = await Delivery.find({}).lean();
  log(`  ${docs.length} demandes de livraison trouvées`);

  const rows = docs.map(doc => ({
    id:                      mongoId(doc),
    user_id:                 doc.userId?.toString() ?? null,
    tracking_id:             doc.trackingId ?? null,
    status:                  doc.status ?? 'pending',
    corridor:                doc.corridor ?? 'AF_TO_FR',
    origin_country:          doc.originCountry ?? null,
    delivery_address:        doc.deliveryAddress ?? null,
    recipient_name:          doc.recipientName ?? null,
    recipient_phone:         doc.recipientPhone ?? null,
    special_instructions:    doc.specialInstructions ?? null,
    insurance_required:      !!doc.insuranceRequired,
    package_size:            doc.packageSize ?? null,
    package_weight:          doc.packageWeight ?? null,
    delivery_priority:       doc.deliveryPriority ?? 'standard',
    payment_status:          doc.paymentStatus ?? 'pending',
    price:                   doc.price ?? null,
    currency:                doc.currency ?? 'XOF',
    museum_wrap:             !!(doc.checklist?.museumWrap),
    bubble_wrap:             !!(doc.checklist?.bubbleWrap),
    crate:                   !!(doc.checklist?.crate),
    fragile_label:           !!(doc.checklist?.fragileLabel),
    humidity_control:        !!(doc.checklist?.humidityControl),
    created_at:              doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('delivery_requests', rows);
  log(`  Insérés : ${inserted}`);

  // Migrer les events de livraison
  const eventRows = [];
  for (const doc of docs) {
    if (!Array.isArray(doc.events)) continue;
    for (const ev of doc.events) {
      eventRows.push({
        delivery_id: mongoId(doc),
        status:      ev.status ?? null,
        note:        ev.note ?? '',
        date:        ev.date ?? new Date(),
      });
    }
  }
  if (eventRows.length > 0) {
    const evInserted = await batchUpsert('delivery_events', eventRows);
    log(`  Events insérés : ${evInserted}`);
  }
}

/**
 * Migre les demandes de sourcing (F3).
 *
 * @returns {Promise<void>}
 */
async function migrateSourcing() {
  log('=== Migration : sourcing_inquiries ===');
  const docs = await Sourcing.find({}).lean();
  log(`  ${docs.length} demandes sourcing trouvées`);

  const rows = docs.map(doc => ({
    id:           mongoId(doc),
    artwork_id:   doc.artworkId?.toString() ?? null,
    requested_by: doc.requestedBy?.toString() ?? null,
    organization: doc.organization ?? null,
    purpose:      doc.purpose ?? null,
    budget:       doc.budget ?? null,
    message:      doc.message ?? null,
    status:       doc.status ?? 'pending',
    admin_note:   doc.adminNote ?? null,
    created_at:   doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('sourcing_inquiries', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les articles de blog.
 *
 * @returns {Promise<void>}
 */
async function migrateBlogPosts() {
  log('=== Migration : blog_posts ===');
  const docs = await BlogPost.find({}).lean();
  log(`  ${docs.length} articles trouvés`);

  const rows = docs.map(doc => ({
    id:         mongoId(doc),
    user_id:    doc.userId?.toString() ?? null,
    title:      doc.title ?? 'Sans titre',
    content:    doc.content ?? null,
    image:      doc.image ?? null,
    category:   doc.category ?? null,
    tags:       Array.isArray(doc.tags) ? doc.tags : [],
    published:  !!doc.published,
    views:      doc.views ?? 0,
    created_at: doc.createdAt ?? new Date(),
    updated_at: doc.updatedAt ?? new Date(),
  }));

  const inserted = await batchUpsert('blog_posts', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les logs d'activité.
 *
 * @returns {Promise<void>}
 */
async function migrateLogs() {
  log('=== Migration : logs ===');
  const docs = await Log.find({}).sort({ createdAt: 1 }).lean();
  log(`  ${docs.length} logs trouvés`);

  const rows = docs.map(doc => ({
    id:          mongoId(doc),
    user_id:     doc.userId?.toString() ?? null,
    description: doc.description ?? null,
    action:      doc.action ?? null,
    entity:      doc.entity ?? null,
    entity_id:   doc.entityId?.toString() ?? null,
    created_at:  doc.createdAt ?? new Date(),
  }));

  const inserted = await batchUpsert('logs', rows);
  log(`  Insérés : ${inserted}`);
}

/**
 * Migre les clients CRM.
 *
 * @returns {Promise<void>}
 */
async function migrateCrmData() {
  log('=== Migration : CRM (clients, contacts, campaigns, crm_clients) ===');

  const [clients, contacts, campaigns, crmClients] = await Promise.all([
    Client.find({}).lean(),
    Contact.find({}).lean(),
    Campaign.find({}).lean(),
    CrmClient.find({}).lean(),
  ]);

  await batchUpsert('clients', clients.map(doc => ({
    id: mongoId(doc), user_id: doc.userId?.toString(), name: doc.name, email: doc.email,
    telephone: doc.telephone, country: doc.country, notes: doc.notes, created_at: doc.createdAt,
  })));

  await batchUpsert('contacts', contacts.map(doc => ({
    id: mongoId(doc), user_id: doc.userId?.toString(), name: doc.name,
    email: doc.email, telephone: doc.telephone, created_at: doc.createdAt,
  })));

  await batchUpsert('campaigns', campaigns.map(doc => ({
    id: mongoId(doc), user_id: doc.userId?.toString(), name: doc.name,
    subject: doc.subject, content: doc.content, status: doc.status ?? 'draft',
    sent_at: doc.sentAt, created_at: doc.createdAt,
  })));

  await batchUpsert('crm_clients', crmClients.map(doc => ({
    id: mongoId(doc), user_id: doc.userId?.toString(), name: doc.name,
    email: doc.email, status: doc.status, notes: doc.notes,
    metadata: doc.metadata ?? {}, created_at: doc.createdAt,
  })));

  log(`  CRM migré`);
}

// ─── Runner ───────────────────────────────────────────────────────────────────

/** @type {Record<string, () => Promise<void>>} */
const MIGRATIONS = {
  users:         migrateUsers,
  artists:       migrateArtists,
  profiles:      migrateProfiles,
  categories:    migrateCategories,
  plans:         migratePlans,
  artworks:      migrateArtworks,
  collections:   migrateCollections,
  transactions:  migrateTransactions,
  subscriptions: migrateSubscriptions,
  delivery:      migrateDelivery,
  sourcing:      migrateSourcing,
  blog_posts:    migrateBlogPosts,
  crm:           migrateCrmData,
  logs:          migrateLogs,
};

/**
 * Point d'entrée principal.
 *
 * @returns {Promise<void>}
 */
async function main() {
  log(`=== Kucibok — Migration MongoDB → Supabase ${DRY_RUN ? '[DRY-RUN]' : ''} ===`);
  log(`Target : ${TARGET}`);

  log('Connexion MongoDB...');
  await mongoose.connect(MONGODB_URI);
  log('MongoDB connecté');

  const toRun = TARGET === 'all'
    ? Object.entries(MIGRATIONS)
    : [[TARGET, MIGRATIONS[TARGET]]];

  if (TARGET !== 'all' && !MIGRATIONS[TARGET]) {
    console.error(`Collection inconnue : ${TARGET}. Options : ${Object.keys(MIGRATIONS).join(', ')}`);
    process.exit(1);
  }

  for (const [name, fn] of toRun) {
    try {
      await fn();
    } catch (err) {
      warn(`Erreur migration ${name} : ${err.message}`);
    }
  }

  log('=== Migration terminée ===');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
