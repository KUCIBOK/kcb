/**
 * migrate_users_auth.js — Migration des utilisateurs MongoDB → Supabase Auth
 *
 * Ce script exporte les users MongoDB vers Supabase Auth (auth.users) en utilisant
 * l'API Admin Supabase. Les mots de passe bcrypt NE sont PAS migrés (incompatibilité
 * d'algorithme). Chaque utilisateur reçoit un email de réinitialisation de mot de passe.
 *
 * USAGE :
 *   node scripts/migrate_users_auth.js [options]
 *
 * OPTIONS :
 *   --dry-run          Simule sans écrire dans Supabase
 *   --skip-email       Crée les comptes sans envoyer les emails de reset
 *   --limit=N          Migre seulement les N premiers utilisateurs
 *   --offset=N         Commence à partir du Nième utilisateur
 *
 * PRÉREQUIS :
 *   Variables d'env dans .env.migration :
 *   - MONGODB_URI
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * ORDRE D'EXÉCUTION :
 *   1. node scripts/migrate_users_auth.js --dry-run  (vérifier)
 *   2. node scripts/migrate_users_auth.js --skip-email  (créer les comptes)
 *   3. node scripts/migrate_users_auth.js --send-reset-emails  (envoyer les emails de reset)
 *      OU envoyer une campagne email manuelle expliquant la migration
 *
 * @module migrate_users_auth
 */

import { createClient } from '@supabase/supabase-js';
import mongoose         from 'mongoose';
import { config }       from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';

config({ path: '.env.migration' });

// ─── Configuration ────────────────────────────────────────────────────────────

const MONGODB_URI    = process.env.MONGODB_URI;
const SUPABASE_URL   = process.env.SUPABASE_URL;
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DRY_RUN    = process.argv.includes('--dry-run');
const SKIP_EMAIL = process.argv.includes('--skip-email');
const SEND_RESET = process.argv.includes('--send-reset-emails');

const limitArg  = process.argv.find(a => a.startsWith('--limit='));
const offsetArg = process.argv.find(a => a.startsWith('--offset='));
const LIMIT     = limitArg  ? parseInt(limitArg.split('=')[1],  10) : Infinity;
const OFFSET    = offsetArg ? parseInt(offsetArg.split('=')[1], 10) : 0;

/** Fichier de mapping MongoDB _id → Supabase UUID (pour la migration des données) */
const USER_ID_MAP_FILE = './scripts/user_id_map.json';

// ─── Supabase Admin ────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Modèle MongoDB ───────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  email:    String,
  name:     String,
  role:     String,
  country:  String,
  telephone: String,
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  createdAt: Date,
}, { strict: false });

const User = mongoose.model('User', UserSchema);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Charge le mapping id précédent si il existe.
 * @returns {Record<string, string>} map mongoId → supabaseUuid
 */
function loadIdMap() {
  if (existsSync(USER_ID_MAP_FILE)) {
    return JSON.parse(readFileSync(USER_ID_MAP_FILE, 'utf-8'));
  }
  return {};
}

/**
 * Sauvegarde le mapping sur disque.
 * @param {Record<string, string>} map
 */
function saveIdMap(map) {
  writeFileSync(USER_ID_MAP_FILE, JSON.stringify(map, null, 2), 'utf-8');
}

/**
 * Migre un utilisateur MongoDB vers Supabase Auth.
 * @param {object} mongoUser
 * @param {Record<string, string>} idMap
 * @returns {Promise<{ ok: boolean, supabaseId?: string, error?: string }>}
 */
async function migrateUser(mongoUser, idMap) {
  const mongoId = mongoUser._id.toString();

  // Déjà migré
  if (idMap[mongoId]) {
    return { ok: true, supabaseId: idMap[mongoId], skipped: true };
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would create: ${mongoUser.email} (role=${mongoUser.role})`);
    return { ok: true, supabaseId: 'dry-run-id' };
  }

  // Créer dans Supabase Auth avec un mot de passe temporaire aléatoire
  // L'utilisateur devra le réinitialiser via l'email de migration
  const tempPassword = `KCB_${Math.random().toString(36).slice(2, 10).toUpperCase()}_${Date.now()}`;

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email:         mongoUser.email,
    password:      tempPassword,
    email_confirm: true, // Marquer comme confirmé (vérification faite dans l'ancien système)
    user_metadata: {
      name:    mongoUser.name ?? '',
      role:    mongoUser.role ?? 'collector',
      migrated_from_mongodb: mongoId,
    },
  });

  if (authError) {
    // Email déjà existant — récupérer l'UUID Supabase existant
    if (authError.message?.includes('already registered') ||
        authError.message?.includes('already exists')) {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users.find(u => u.email === mongoUser.email);
      if (existing) {
        idMap[mongoId] = existing.id;
        return { ok: true, supabaseId: existing.id, existing: true };
      }
    }
    return { ok: false, error: authError.message };
  }

  const supabaseId = authData.user.id;
  idMap[mongoId] = supabaseId;

  // Créer la ligne public.users
  const { error: insertError } = await supabase
    .from('users')
    .upsert({
      id:          supabaseId,
      name:        mongoUser.name    ?? '',
      role:        mongoUser.role    ?? 'collector',
      country:     mongoUser.country  ?? null,
      telephone:   mongoUser.telephone ?? null,
      auth_provider: 'email',
      is_active:   mongoUser.isActive ?? true,
      profile_completed:    false,
      onboarding_completed: false,
      created_at:  mongoUser.createdAt?.toISOString() ?? new Date().toISOString(),
    }, { onConflict: 'id' });

  if (insertError) {
    console.warn(`  ⚠ public.users insert failed for ${mongoUser.email}: ${insertError.message}`);
  }

  return { ok: true, supabaseId };
}

/**
 * Envoie un email de réinitialisation de mot de passe à un utilisateur migré.
 * @param {string} email
 */
async function sendResetEmail(email) {
  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would send reset email to: ${email}`);
    return;
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://kucibok.com/forgot-password-form',
  });
  if (error) console.warn(`  ⚠ Reset email failed for ${email}: ${error.message}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== Migration Users MongoDB → Supabase Auth ===`);
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}`);
  if (!DRY_RUN && !MONGODB_URI) {
    console.error('MONGODB_URI manquant dans .env.migration');
    process.exit(1);
  }
  if (!DRY_RUN && (!SUPABASE_URL || !SUPABASE_KEY)) {
    console.error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant');
    process.exit(1);
  }

  if (!DRY_RUN) {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connecté');
  }

  const idMap = loadIdMap();
  const stats = { total: 0, created: 0, existing: 0, skipped: 0, errors: 0 };

  let query = User.find({}).sort({ createdAt: 1 }).lean();
  if (OFFSET > 0)   query = query.skip(OFFSET);
  if (LIMIT < Infinity) query = query.limit(LIMIT);

  const users = DRY_RUN ? [{ _id: 'test123', email: 'test@kucibok.com', role: 'collector', name: 'Test' }]
                        : await query;

  console.log(`\nUtilisateurs à migrer : ${users.length}\n`);

  for (const user of users) {
    stats.total++;
    process.stdout.write(`[${stats.total}/${users.length}] ${user.email} ... `);

    const result = await migrateUser(user, idMap);

    if (!result.ok) {
      console.error(`ERREUR: ${result.error}`);
      stats.errors++;
    } else if (result.skipped) {
      console.log('skip (déjà migré)');
      stats.skipped++;
    } else if (result.existing) {
      console.log('existing (compte déjà dans Supabase)');
      stats.existing++;
    } else {
      console.log(`OK → ${result.supabaseId}`);
      stats.created++;

      // Envoyer le reset email si demandé
      if (SEND_RESET && !SKIP_EMAIL && user.email) {
        await sendResetEmail(user.email);
      }
    }

    // Sauvegarder le mapping toutes les 50 itérations
    if (stats.total % 50 === 0) {
      saveIdMap(idMap);
      console.log(`  [Mapping sauvegardé — ${Object.keys(idMap).length} entrées]`);
    }
  }

  // Sauvegarde finale
  if (!DRY_RUN) {
    saveIdMap(idMap);
    console.log(`\nMapping final sauvegardé dans ${USER_ID_MAP_FILE}`);
    console.log('IMPORTANT : Ce fichier est nécessaire pour migrate_mongodb.js (mapping des IDs)\n');
  }

  console.log('\n=== Résultats ===');
  console.log(`  Total traités : ${stats.total}`);
  console.log(`  Créés         : ${stats.created}`);
  console.log(`  Existants     : ${stats.existing}`);
  console.log(`  Ignorés       : ${stats.skipped}`);
  console.log(`  Erreurs       : ${stats.errors}`);

  if (!DRY_RUN) await mongoose.disconnect();
  process.exit(stats.errors > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
