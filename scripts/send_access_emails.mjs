/**
 * send_access_emails.mjs — Envoie les emails d'accès Kucibok Bridge à tous les utilisateurs.
 *
 * Pour chaque utilisateur actif en base :
 *   1. Génère un recovery link Supabase (one-time, 24h)
 *   2. Injecte le lien dans le template welcome selon le rôle
 *   3. Envoie via Resend
 *
 * Variables requises dans scripts/.env.migration :
 *   SUPABASE_URL=
 *   SUPABASE_SERVICE_ROLE_KEY=
 *   RESEND_API_KEY=
 *   ADMIN_EMAIL=          (ex: noreply@kucibok.com)
 *   SITE_URL=             (ex: https://kucibok.com)
 *
 * Usage :
 *   node scripts/send_access_emails.mjs           → dry-run (aperçu, aucun email envoyé)
 *   node scripts/send_access_emails.mjs --send    → envoi réel
 *
 * Options :
 *   --role=artist|collector|professional          → filtrer par rôle
 *   --limit=N                                     → limiter à N users (test)
 *   --delay=N                                     → délai ms entre envois (défaut: 300)
 */

import { createClient } from '@supabase/supabase-js'
import { Resend }        from 'resend'
import { readFileSync }  from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

// ─── Charger les variables d'environnement ────────────────────────────────────

const env = Object.fromEntries(
  readFileSync(join(__dir, '.env.migration'), 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const REQUIRED = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'ADMIN_EMAIL', 'SITE_URL']
for (const key of REQUIRED) {
  if (!env[key]) { console.error(`❌ Variable manquante dans .env.migration : ${key}`); process.exit(1) }
}

// ─── Arguments CLI ────────────────────────────────────────────────────────────

const args     = process.argv.slice(2)
const DRY_RUN  = !args.includes('--send')
const ROLE_ARG = (args.find(a => a.startsWith('--role=')) ?? '').replace('--role=', '') || null
const LIMIT    = parseInt((args.find(a => a.startsWith('--limit=')) ?? '').replace('--limit=', ''), 10) || null
const DELAY_MS = parseInt((args.find(a => a.startsWith('--delay=')) ?? '').replace('--delay=', ''), 10) || 300

// ─── Exclusions ───────────────────────────────────────────────────────────────

// Comptes test — jamais d'email
const EXCLUDED_PATTERNS = [
  /@kucibok-test\.com$/i,
  /^(full|final|score)_\d+@kucibok\.com$/i,
]

// Admins exclus sauf liste blanche
const ADMIN_WHITELIST = [
  'kucibok221@gmail.com',   // Moctar Sidibé
  'emmanuel@kucibok.com',   // Emmanuel Aziaka
]

function isExcluded(email, role) {
  if (EXCLUDED_PATTERNS.some(p => p.test(email))) return true
  if (role === 'admin' && !ADMIN_WHITELIST.includes(email.toLowerCase())) return true
  return false
}

// ─── Clients ──────────────────────────────────────────────────────────────────

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const resend    = new Resend(env.RESEND_API_KEY)
const FROM      = `Kucibok Bridge <${env.ADMIN_EMAIL}>`
const SITE_URL  = env.SITE_URL.replace(/\/$/, '')
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function loadTemplate(role) {
  const name = role === 'artist' ? 'welcome-artist' : 'welcome-collector'
  return readFileSync(join(__dir, '..', 'emails', `${name}.html`), 'utf8')
}

function renderTemplate(html, { displayName, recoveryLink }) {
  return html
    .replace(/\{\{first_name\}\}/g,      displayName)
    .replace(/\{\{dashboard_url\}\}/g,   recoveryLink)
    .replace(/\{\{catalogue_url\}\}/g,   recoveryLink)
    .replace(/\{\{unsubscribe_url\}\}/g, `${SITE_URL}/unsubscribe`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n══════════════════════════════════════════════')
  console.log('  KUCIBOK — ENVOI EMAILS D\'ACCÈS')
  console.log('══════════════════════════════════════════════')
  console.log(`  Mode       : ${DRY_RUN ? '🔍 DRY-RUN (aucun email envoyé)' : '🚀 ENVOI RÉEL'}`)
  console.log(`  Filtre rôle: ${ROLE_ARG ?? 'tous'}`)
  console.log(`  Limite     : ${LIMIT ?? 'aucune'}`)
  console.log(`  Délai      : ${DELAY_MS}ms entre envois`)
  console.log(`  From       : ${FROM}`)
  console.log(`  Site       : ${SITE_URL}`)
  console.log('══════════════════════════════════════════════\n')

  // 1. Récupérer tous les users depuis public.users
  let query = supabase.from('users').select('id, name, role, is_active').eq('is_active', true)
  if (ROLE_ARG) query = query.eq('role', ROLE_ARG)
  if (LIMIT)    query = query.limit(LIMIT)

  const { data: users, error: usersErr } = await query
  if (usersErr) { console.error('❌ Erreur chargement users:', usersErr.message); process.exit(1) }
  console.log(`✅ ${users.length} utilisateur(s) trouvé(s) en base\n`)

  // 2. Récupérer les emails depuis auth.users (par batch de 100)
  const emailMap = {}
  let page = 1
  while (true) {
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (authErr) { console.error('❌ Erreur auth.listUsers:', authErr.message); process.exit(1) }
    for (const u of authData.users) {
      if (u.email) emailMap[u.id] = { email: u.email }
    }
    if (authData.users.length < 1000) break
    page++
  }
  console.log(`✅ ${Object.keys(emailMap).length} email(s) récupéré(s) depuis auth\n`)

  // 3. Pré-charger les templates
  const templates = {
    artist:       loadTemplate('artist'),
    collector:    loadTemplate('collector'),
    professional: loadTemplate('collector'), // fallback
  }

  // 4. Boucle d'envoi
  const results = { sent: [], skipped: [], errors: [] }

  for (const user of users) {
    const authUser = emailMap[user.id]
    const email       = authUser?.email
    const role        = user.role ?? 'collector'
    const displayName = user.name?.trim() || 'vous'

    if (!email || !EMAIL_RE.test(email)) {
      console.log(`  ⏭  SKIP   ${String(email ?? user.id).padEnd(40)} — email manquant ou invalide`)
      results.skipped.push({ id: user.id, reason: 'email manquant ou invalide' })
      continue
    }

    if (isExcluded(email, role)) {
      console.log(`  ⏭  SKIP   ${email.padEnd(40)} — exclu (test ou admin non whitelisté)`)
      results.skipped.push({ email, reason: 'exclu' })
      continue
    }
    const subject     = role === 'artist'
      ? 'Votre espace artiste Kucibok Bridge est prêt'
      : 'Votre accès Kucibok Bridge est prêt'

    if (DRY_RUN) {
      console.log(`  👁  DRY    ${email.padEnd(40)} role=${role.padEnd(14)} name="${displayName}"`)
      results.sent.push({ email, role, name: displayName })
      continue
    }

    try {
      // Générer le recovery link
      const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
        type: 'recovery', email,
        options: { redirectTo: `${SITE_URL}/reset-password` },
      })
      if (linkErr) throw new Error(linkErr.message)

      const recoveryLink = linkData?.properties?.action_link
      if (!recoveryLink) throw new Error('Recovery link vide (compte inexistant ?)')

      // Rendre le template
      const html = renderTemplate(templates[role] ?? templates.collector, { displayName, recoveryLink })

      // Envoyer
      await resend.emails.send({ from: FROM, to: email, subject, html })

      console.log(`  ✅ SENT   ${email.padEnd(40)} role=${role}`)
      results.sent.push({ email, role })
    } catch (err) {
      console.log(`  ❌ ERROR  ${email.padEnd(40)} ${err.message}`)
      results.errors.push({ email, role, reason: err.message })
    }

    await sleep(DELAY_MS)
  }

  // 5. Rapport final
  console.log('\n══════════════════════════════════════════════')
  console.log('  RAPPORT')
  console.log('══════════════════════════════════════════════')
  console.log(`  ✅ Envoyés  : ${results.sent.length}`)
  console.log(`  ⏭  Skippés  : ${results.skipped.length}`)
  console.log(`  ❌ Erreurs  : ${results.errors.length}`)

  if (results.errors.length) {
    console.log('\n  Détail erreurs :')
    results.errors.forEach(e => console.log(`    - ${e.email} : ${e.reason}`))
  }

  if (DRY_RUN) {
    console.log('\n  ℹ️  Mode DRY-RUN — aucun email envoyé.')
    console.log('  Relance avec --send pour envoyer réellement.\n')
  } else {
    console.log('\n  ✅ Envoi terminé.\n')
  }
}

run().catch(err => { console.error('\n❌ Erreur fatale:', err.message); process.exit(1) })
