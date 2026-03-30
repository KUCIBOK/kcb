/**
 * deduplicate.mjs — Supprime les doublons artistes et oeuvres dans Supabase.
 *
 * Stratégie artistes :
 *   - Groupe par nom (insensible à la casse)
 *   - Garde celui avec le plus d'oeuvres, sinon celui avec image, sinon le premier
 *   - Réassigne artworks.artist_id vers l'entrée conservée
 *   - Supprime les doublons
 *
 * Stratégie oeuvres :
 *   - Groupe par (title.lower + artist_name.lower)
 *   - Garde le plus ancien (created_at le plus tôt)
 *   - Supprime les doublons
 *
 * Usage : node scripts/deduplicate.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(join(__dir, '.env.migration'), 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()] })
)

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// ── helpers ────────────────────────────────────────────────────────────────

function pick(arr, key) { return arr.map(a => a[key]) }

async function run() {
  console.log('\n=== DÉDUPLICATION SUPABASE ===\n')

  // ── 1. ARTISTES ─────────────────────────────────────────────────────────
  console.log('1/2 — Chargement des artistes...')
  const { data: artists, error: aErr } = await supabase
    .from('artists')
    .select('id, name, image, artwork_count, created_at')
    .order('artwork_count', { ascending: false })

  if (aErr) { console.error('Erreur artistes:', aErr.message); process.exit(1) }
  console.log(`   ${artists.length} artistes chargés`)

  // Grouper par nom normalisé
  const artistGroups = {}
  for (const a of artists) {
    const key = (a.name || '').trim().toLowerCase()
    if (!artistGroups[key]) artistGroups[key] = []
    artistGroups[key].push(a)
  }
  const artistDupGroups = Object.values(artistGroups).filter(g => g.length > 1)
  console.log(`   ${artistDupGroups.length} groupes en doublon`)

  let artistsDeleted = 0
  let artworksReassigned = 0

  for (const group of artistDupGroups) {
    // Trier : plus d'oeuvres d'abord, ensuite avec image, ensuite plus ancien
    group.sort((a, b) => {
      if ((b.artwork_count ?? 0) !== (a.artwork_count ?? 0))
        return (b.artwork_count ?? 0) - (a.artwork_count ?? 0)
      if (!!b.image !== !!a.image) return b.image ? 1 : -1
      return new Date(a.created_at) - new Date(b.created_at)
    })
    const keep = group[0]
    const toDelete = group.slice(1).map(a => a.id)

    // Réassigner les oeuvres
    const { count: rc } = await supabase
      .from('artworks')
      .update({ artist_id: keep.id })
      .in('artist_id', toDelete)
      .select('id', { count: 'exact', head: true })

    artworksReassigned += rc ?? 0

    // Supprimer les doublons artiste
    const { error: delErr } = await supabase
      .from('artists')
      .delete()
      .in('id', toDelete)

    if (delErr) {
      console.warn(`  ⚠ Erreur suppression artiste "${keep.name}":`, delErr.message)
    } else {
      artistsDeleted += toDelete.length
    }
  }

  console.log(`   ✓ ${artistsDeleted} artistes doublons supprimés`)
  console.log(`   ✓ ${artworksReassigned} oeuvres réassignées\n`)

  // ── 2. OEUVRES ──────────────────────────────────────────────────────────
  console.log('2/2 — Chargement des oeuvres...')
  const { data: artworks, error: owErr } = await supabase
    .from('artworks')
    .select('id, title, artist_id, artists!artist_id(name), image, created_at, status')
    .order('created_at', { ascending: true })

  if (owErr) { console.error('Erreur oeuvres:', owErr.message); process.exit(1) }
  console.log(`   ${artworks.length} oeuvres chargées`)

  // Grouper par (title.lower + artist_name.lower)
  const artworkGroups = {}
  for (const a of artworks) {
    const artistName = a.artists?.name ?? ''
    const key = (a.title || '').trim().toLowerCase() + '|' + artistName.trim().toLowerCase()
    if (!artworkGroups[key]) artworkGroups[key] = []
    artworkGroups[key].push(a)
  }
  const artworkDupGroups = Object.values(artworkGroups).filter(g => g.length > 1)
  console.log(`   ${artworkDupGroups.length} groupes en doublon`)

  let artworksDeleted = 0

  for (const group of artworkDupGroups) {
    // Trier : status approved d'abord, avec image, puis plus ancien (created_at ASC déjà trié)
    group.sort((a, b) => {
      if (a.status === 'approved' && b.status !== 'approved') return -1
      if (b.status === 'approved' && a.status !== 'approved') return 1
      if (!!a.image !== !!b.image) return a.image ? -1 : 1
      return new Date(a.created_at) - new Date(b.created_at)
    })
    const toDelete = group.slice(1).map(a => a.id)

    const { error: delErr } = await supabase
      .from('artworks')
      .delete()
      .in('id', toDelete)

    if (delErr) {
      console.warn(`  ⚠ Erreur suppression oeuvre "${group[0].title}":`, delErr.message)
    } else {
      artworksDeleted += toDelete.length
    }
  }

  console.log(`   ✓ ${artworksDeleted} oeuvres doublons supprimées\n`)

  // ── RÉSUMÉ ───────────────────────────────────────────────────────────────
  console.log('=== RÉSUMÉ ===')
  console.log(`Artistes supprimés : ${artistsDeleted}`)
  console.log(`Oeuvres supprimées : ${artworksDeleted}`)
  console.log('Terminé ✓\n')
}

run().catch(err => { console.error('Erreur fatale:', err); process.exit(1) })
