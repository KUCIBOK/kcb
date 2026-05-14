/**
 * recompress_storage_images.mjs
 *
 * Télécharge, compresse et ré-uploade les images existantes
 * dans les buckets Supabase Storage (artworks, profiles, blogs).
 *
 * Usage :
 *   node scripts/recompress_storage_images.mjs              → dry-run (liste sans modifier)
 *   node scripts/recompress_storage_images.mjs --send       → compression + ré-upload réel
 *   node scripts/recompress_storage_images.mjs --bucket=artworks --send
 *   node scripts/recompress_storage_images.mjs --limit=10 --send
 */

import { createClient }  from '@supabase/supabase-js'
import { Jimp }          from 'jimp'
import { readFileSync }  from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(join(__dir, '.env.migration'), 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

for (const key of ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!env[key]) { console.error(`❌ Variable manquante : ${key}`); process.exit(1) }
}

const args      = process.argv.slice(2)
const DRY_RUN   = !args.includes('--send')
const LIMIT     = parseInt((args.find(a => a.startsWith('--limit=')) ?? '').replace('--limit=', ''), 10) || null
const BUCKET_ARG = (args.find(a => a.startsWith('--bucket=')) ?? '').replace('--bucket=', '') || null
const DELAY     = 300

const MAX_WIDTH    = 1920
const JPEG_QUALITY = 82
const SKIP_BELOW_KB = 200  // déjà légère, on skip

const BUCKETS = BUCKET_ARG ? [BUCKET_ARG] : ['artworks', 'profiles', 'blogs']

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Lister tous les fichiers d'un bucket (pagination) ───────────────────────

async function listAllFiles(bucket) {
  const files = []
  const stack = ['']
  while (stack.length) {
    const prefix = stack.pop()
    const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 })
    if (error) { console.error(`❌ list(${bucket}/${prefix}):`, error.message); continue }
    for (const item of data ?? []) {
      if (item.id === null) {
        stack.push(prefix ? `${prefix}/${item.name}` : item.name)
      } else {
        files.push({ path: prefix ? `${prefix}/${item.name}` : item.name, size: item.metadata?.size ?? 0 })
      }
    }
  }
  return files
}

// ─── Compression d'un buffer image ────────────────────────────────────────────

async function compress(buffer, mime) {
  if (mime === 'image/gif') return null

  const image = await Jimp.fromBuffer(buffer)
  const { width } = image.bitmap
  if (width > MAX_WIDTH) image.resize({ w: MAX_WIDTH })

  return await image.getBuffer(mime === 'image/png' ? 'image/png' : 'image/jpeg', {
    quality: JPEG_QUALITY,
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n══════════════════════════════════════════════════════')
  console.log('  KUCIBOK — RECOMPRESSION IMAGES STORAGE')
  console.log('══════════════════════════════════════════════════════')
  console.log(`  Mode    : ${DRY_RUN ? '🔍 DRY-RUN (aucune modification)' : '🚀 ENVOI REEL'}`)
  console.log(`  Buckets : ${BUCKETS.join(', ')}`)
  console.log(`  Limite  : ${LIMIT ?? 'aucune'}`)
  console.log('══════════════════════════════════════════════════════\n')

  const totals = { processed: 0, compressed: 0, skipped: 0, errors: 0, saved_kb: 0 }

  for (const bucket of BUCKETS) {
    console.log(`\n── Bucket: ${bucket} ─────────────────────────────────`)
    const files = await listAllFiles(bucket)
    console.log(`   ${files.length} fichiers trouvés`)

    const images = files.filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f.path))
    const targets = LIMIT ? images.slice(0, LIMIT - totals.processed) : images

    for (const file of targets) {
      if (LIMIT && totals.processed >= LIMIT) break

      const ext = file.path.split('.').pop().toLowerCase()
      const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg'

      if (file.size > 0 && file.size < SKIP_BELOW_KB * 1024) {
        console.log(`  ⏭  SKIP  ${file.path.padEnd(60)} (${(file.size / 1024).toFixed(0)} Ko — déjà léger)`)
        totals.skipped++
        totals.processed++
        continue
      }

      if (DRY_RUN) {
        console.log(`  👁  DRY   ${file.path.padEnd(60)} (${file.size ? (file.size / 1024).toFixed(0) + ' Ko' : 'taille inconnue'})`)
        totals.processed++
        continue
      }

      try {
        // Téléchargement
        const { data: dlData, error: dlErr } = await supabase.storage.from(bucket).download(file.path)
        if (dlErr) throw new Error(`download: ${dlErr.message}`)

        const originalBuffer = Buffer.from(await dlData.arrayBuffer())
        const originalKb = originalBuffer.length / 1024

        const compressedBuffer = await compress(originalBuffer, mime)
        if (!compressedBuffer) {
          console.log(`  ⏭  SKIP  ${file.path} (GIF — ignoré)`)
          totals.skipped++
          totals.processed++
          continue
        }

        const compressedKb = compressedBuffer.length / 1024
        const ratio = ((1 - compressedKb / originalKb) * 100).toFixed(0)

        if (compressedKb >= originalKb) {
          console.log(`  ⏭  SKIP  ${file.path.padEnd(60)} (déjà optimisé)`)
          totals.skipped++
          totals.processed++
          continue
        }

        // Ré-upload
        const { error: upErr } = await supabase.storage.from(bucket).upload(
          file.path,
          compressedBuffer,
          { upsert: true, contentType: mime === 'image/png' ? 'image/png' : 'image/jpeg' }
        )
        if (upErr) throw new Error(`upload: ${upErr.message}`)

        console.log(`  ✅ DONE  ${file.path.padEnd(60)} ${originalKb.toFixed(0)} Ko → ${compressedKb.toFixed(0)} Ko (-${ratio}%)`)
        totals.compressed++
        totals.saved_kb += originalKb - compressedKb
      } catch (err) {
        console.log(`  ❌ ERR   ${file.path} — ${err.message}`)
        totals.errors++
      }

      totals.processed++
      await new Promise(r => setTimeout(r, DELAY))
    }
  }

  console.log('\n══════════════════════════════════════════════════════')
  console.log(`  Traités    : ${totals.processed}`)
  console.log(`  Compressés : ${totals.compressed}`)
  console.log(`  Ignorés    : ${totals.skipped}`)
  console.log(`  Erreurs    : ${totals.errors}`)
  if (!DRY_RUN && totals.saved_kb > 0) {
    console.log(`  Espace libéré : ${(totals.saved_kb / 1024).toFixed(1)} Mo`)
  }
  if (DRY_RUN) {
    console.log('\n  ℹ️  DRY-RUN — aucune image modifiée.')
    console.log('  Relance avec --send pour compresser.\n')
  } else {
    console.log('\n  ✅ Terminé.\n')
  }
}

run().catch(err => { console.error('❌ Erreur fatale:', err.message); process.exit(1) })
