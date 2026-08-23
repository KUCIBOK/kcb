#!/usr/bin/env node

/**
 * FINAL DEEP AUDIT: Artwork Attribution with proper JOINs
 * Run with: node scripts/audit_final.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔍 DEEP AUDIT: Artwork Attribution Analysis (Final)')
console.log('='.repeat(80))
console.log(`Database: wyrmpddlhldjzoiwbshj.supabase.co`)
console.log(`Time: ${new Date().toISOString()}\n`)

// ============================================================================
// STEP 1: Get all artworks with artist info
// ============================================================================

console.log('📊 Fetching all artworks...\n')

const { data: allArtworks, error: err1 } = await supabase
  .from('artworks')
  .select('id, kucibok_id, title, artist_id, medium, price, created_at, visited, likes_count, sold')

if (err1) {
  console.error('❌ Error:', err1)
  process.exit(1)
}

console.log(`✅ Loaded ${allArtworks.length} artworks\n`)

// Get artist data
const { data: allArtists, error: err2 } = await supabase
  .from('artists')
  .select('id, name, username')

if (err2) {
  console.error('❌ Error fetching artists:', err2)
  process.exit(1)
}

console.log(`✅ Loaded ${allArtists.length} artists\n`)

// Create lookup
const artistMap = {}
allArtists.forEach((artist) => {
  artistMap[artist.id] = artist
})

// Enrich artworks with artist data
const enrichedArtworks = allArtworks.map((art) => ({
  ...art,
  artist_name: artistMap[art.artist_id]?.name || 'UNKNOWN',
  artist_username: artistMap[art.artist_id]?.username,
}))

// ============================================================================
// ANALYSIS 1: Group by artist_id + artist_name
// ============================================================================

console.log('='.repeat(80))
console.log('1️⃣  GROUPS - Artworks by artist_id and artist_name')
console.log('='.repeat(80) + '\n')

const groupedByArtist = {}
enrichedArtworks.forEach((art) => {
  if (art.artist_id && art.artist_name) {
    const key = `${art.artist_id}||${art.artist_name}`
    if (!groupedByArtist[key]) {
      groupedByArtist[key] = {
        artist_id: art.artist_id,
        artist_name: art.artist_name,
        artwork_count: 0,
      }
    }
    groupedByArtist[key].artwork_count++
  }
})

const q1Data = Object.values(groupedByArtist)
  .sort((a, b) => b.artwork_count - a.artwork_count)
  .slice(0, 50)

console.table(q1Data)
console.log(`\nTotal unique (artist_id, artist_name) pairs: ${Object.values(groupedByArtist).length}\n`)

// ============================================================================
// ANALYSIS 2: Same ID, different names
// ============================================================================

console.log('='.repeat(80))
console.log('2️⃣  SUSPICIOUS - Same artist_id with DIFFERENT artist_name')
console.log('='.repeat(80) + '\n')

const sameIdDiffNames = {}
enrichedArtworks.forEach((art) => {
  if (art.artist_id && art.artist_name) {
    if (!sameIdDiffNames[art.artist_id]) {
      sameIdDiffNames[art.artist_id] = { artist_id: art.artist_id, names: new Set(), count: 0 }
    }
    sameIdDiffNames[art.artist_id].names.add(art.artist_name)
    sameIdDiffNames[art.artist_id].count++
  }
})

const q2Data = Object.values(sameIdDiffNames)
  .filter((g) => g.names.size > 1)
  .map((g) => ({
    artist_id: g.artist_id,
    name_variants: g.names.size,
    all_names: Array.from(g.names).join(' | '),
    total_artworks: g.count,
  }))
  .sort((a, b) => b.total_artworks - a.total_artworks)

if (q2Data.length > 0) {
  console.table(q2Data)
  console.log(`\n⚠️  CRITICAL: Found ${q2Data.length} artist IDs with multiple names!\n`)
} else {
  console.log('✅ No issues found: Each artist_id has only one name\n')
}

// ============================================================================
// ANALYSIS 3: Same name, different IDs
// ============================================================================

console.log('='.repeat(80))
console.log('3️⃣  SUSPICIOUS - Same artist_name with DIFFERENT artist_id')
console.log('='.repeat(80) + '\n')

const sameNameDiffIds = {}
enrichedArtworks.forEach((art) => {
  if (art.artist_name && art.artist_id) {
    if (!sameNameDiffIds[art.artist_name]) {
      sameNameDiffIds[art.artist_name] = { artist_name: art.artist_name, ids: new Set(), count: 0 }
    }
    sameNameDiffIds[art.artist_name].ids.add(art.artist_id)
    sameNameDiffIds[art.artist_name].count++
  }
})

const q3Data = Object.values(sameNameDiffIds)
  .filter((g) => g.ids.size > 1)
  .map((g) => ({
    artist_name: g.artist_name,
    id_variants: g.ids.size,
    all_ids: Array.from(g.ids).join(' | '),
    total_artworks: g.count,
  }))
  .sort((a, b) => b.total_artworks - a.total_artworks)

if (q3Data.length > 0) {
  console.table(q3Data)
  console.log(`\n⚠️  CRITICAL: Found ${q3Data.length} artist names with multiple IDs!\n`)
} else {
  console.log('✅ No issues found: Each artist_name maps to only one ID\n')
}

// ============================================================================
// ANALYSIS 4: Key artists (Gaétan, Abel, Toh)
// ============================================================================

console.log('='.repeat(80))
console.log('4️⃣  KEY ARTISTS - Gaétan, Abel, Toh')
console.log('='.repeat(80) + '\n')

const keyArtistsArtworks = enrichedArtworks.filter((art) =>
  art.artist_name && /gaet|abel|toh/i.test(art.artist_name)
)

console.log(`Found ${keyArtistsArtworks.length} artworks for key artists:\n`)

const keyArtistsGrouped = {}
keyArtistsArtworks.forEach((art) => {
  const key = `${art.artist_id}||${art.artist_name}`
  if (!keyArtistsGrouped[key]) {
    keyArtistsGrouped[key] = {
      artist_id: art.artist_id,
      artist_name: art.artist_name,
      count: 0,
      titles: [],
    }
  }
  keyArtistsGrouped[key].count++
  if (keyArtistsGrouped[key].titles.length < 3) keyArtistsGrouped[key].titles.push(art.title)
})

Object.values(keyArtistsGrouped)
  .sort((a, b) => b.count - a.count)
  .forEach((g) => {
    console.log(`\n  Artist: ${g.artist_name}`)
    console.log(`  ID: ${g.artist_id}`)
    console.log(`  Artworks: ${g.count}`)
    console.log(`  Sample: ${g.titles.join(', ')}`)
  })

console.log('\n')

// ============================================================================
// ANALYSIS 5: Top 30 artists
// ============================================================================

console.log('='.repeat(80))
console.log('5️⃣  TOP 30 - Artists with most artworks')
console.log('='.repeat(80) + '\n')

const top30 = Object.values(groupedByArtist)
  .sort((a, b) => b.artwork_count - a.artwork_count)
  .slice(0, 30)
  .map((g) => ({
    artist_name: g.artist_name,
    artist_id: g.artist_id.substring(0, 12) + '...',
    artwork_count: g.artwork_count,
  }))

console.table(top30)

// ============================================================================
// ANALYSIS 6: NULL/EMPTY
// ============================================================================

console.log('\n' + '='.repeat(80))
console.log('6️⃣  DATA QUALITY - NULL/EMPTY values')
console.log('='.repeat(80) + '\n')

const nullArtworks = enrichedArtworks.filter((a) => !a.artist_id || !a.artist_name)
console.log(`  NULL artist_id: ${enrichedArtworks.filter((a) => !a.artist_id).length}`)
console.log(`  NULL artist_name: ${enrichedArtworks.filter((a) => !a.artist_name).length}`)
console.log(
  `  Artworks with missing artist info: ${nullArtworks.length} (${((nullArtworks.length / enrichedArtworks.length) * 100).toFixed(1)}%)\n`
)

// ============================================================================
// SUMMARY
// ============================================================================

console.log('='.repeat(80))
console.log('📊 FINAL SUMMARY')
console.log('='.repeat(80) + '\n')

console.log(`Total artworks in database: ${enrichedArtworks.length}`)
console.log(`Total artists: ${allArtists.length}`)
console.log(`Artworks with artist info: ${enrichedArtworks.filter((a) => a.artist_id && a.artist_name).length}`)
console.log(`Unique (artist_id, artist_name) pairs: ${Object.keys(groupedByArtist).length}`)
console.log(`\n⚠️  ISSUES FOUND:`)
console.log(`  • Same ID with different names: ${q2Data.length}`)
console.log(`  • Same name with different IDs: ${q3Data.length}`)
console.log(`  • Missing artist info: ${nullArtworks.length}`)
console.log(`\n✅ AUDIT COMPLETE!\n`)

process.exit(0)
