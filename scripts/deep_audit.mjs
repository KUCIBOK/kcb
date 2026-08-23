#!/usr/bin/env node

/**
 * Deep Audit: Artwork Attribution - Direct Table Analysis
 * Run with: node scripts/deep_audit.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔍 DEEP AUDIT: Artwork Attribution Analysis')
console.log('='.repeat(80))
console.log(`Database: wyrmpddlhldjzoiwbshj.supabase.co`)
console.log(`Time: ${new Date().toISOString()}\n`)

// ============================================================================
// HELPERS
// ============================================================================

function print(title) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(title)
  console.log(`${'='.repeat(80)}\n`)
}

function table(data) {
  if (!data || data.length === 0) {
    console.log('  (No results)\n')
    return
  }
  console.table(data.slice(0, 50))
  if (data.length > 50) console.log(`  ... and ${data.length - 50} more\n`)
}

// ============================================================================
// AUDIT
// ============================================================================

async function runAudit() {
  // Step 1: Get all artworks
  print('📊 STEP 1: Fetching all artworks...')
  const { data: allArtworks, error: err1 } = await supabase
    .from('artworks')
    .select('id, kucibok_id, title, artist_id, artist_name, year, medium, price, created_at')

  if (err1) {
    console.error('❌ Error fetching artworks:', err1)
    process.exit(1)
  }

  console.log(`✅ Loaded ${allArtworks.length} artworks\n`)

  // ========================================================================
  // Analysis: Q1 - Group by artist_id + artist_name
  // ========================================================================

  print('1️⃣  GROUPS - Artworks by artist_id and artist_name')

  const groupedByArtist = {}
  allArtworks.forEach((art) => {
    if (art.artist_id && art.artist_name) {
      const key = `${art.artist_id}||${art.artist_name}`
      if (!groupedByArtist[key]) {
        groupedByArtist[key] = {
          artist_id: art.artist_id,
          artist_name: art.artist_name,
          artwork_count: 0,
          sample_titles: [],
          years: new Set(),
          mediums: new Set(),
        }
      }
      groupedByArtist[key].artwork_count++
      if (groupedByArtist[key].sample_titles.length < 3) {
        groupedByArtist[key].sample_titles.push(art.title)
      }
      if (art.year) groupedByArtist[key].years.add(art.year)
      if (art.medium) groupedByArtist[key].mediums.add(art.medium)
    }
  })

  const q1Data = Object.values(groupedByArtist)
    .map((g) => ({
      artist_id: g.artist_id,
      artist_name: g.artist_name,
      artwork_count: g.artwork_count,
      sample_titles: g.sample_titles.join(' | '),
      year_range: `${Math.min(...g.years)} - ${Math.max(...g.years)}`,
      mediums: Array.from(g.mediums).join(', '),
    }))
    .sort((a, b) => b.artwork_count - a.artwork_count)

  table(q1Data.slice(0, 50))
  console.log(`Total unique (artist_id, artist_name) pairs: ${q1Data.length}\n`)

  // ========================================================================
  // Analysis: Q2 - Same ID, different names
  // ========================================================================

  print('2️⃣  SUSPICIOUS - Same artist_id with DIFFERENT artist_name')

  const sameIdDiffNames = {}
  allArtworks.forEach((art) => {
    if (art.artist_id) {
      if (!sameIdDiffNames[art.artist_id]) {
        sameIdDiffNames[art.artist_id] = {
          artist_id: art.artist_id,
          names: new Set(),
          titles: [],
          count: 0,
        }
      }
      if (art.artist_name) sameIdDiffNames[art.artist_id].names.add(art.artist_name)
      if (sameIdDiffNames[art.artist_id].titles.length < 2)
        sameIdDiffNames[art.artist_id].titles.push(art.title)
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
      sample_titles: g.titles.join(' | '),
    }))
    .sort((a, b) => b.total_artworks - a.total_artworks)

  table(q2Data)
  console.log(`⚠️  FOUND ${q2Data.length} suspicious IDs with multiple names!\n`)

  // ========================================================================
  // Analysis: Q3 - Same name, different IDs
  // ========================================================================

  print('3️⃣  SUSPICIOUS - Same artist_name with DIFFERENT artist_id')

  const sameNameDiffIds = {}
  allArtworks.forEach((art) => {
    if (art.artist_name) {
      if (!sameNameDiffIds[art.artist_name]) {
        sameNameDiffIds[art.artist_name] = {
          artist_name: art.artist_name,
          ids: new Set(),
          titles: [],
          count: 0,
        }
      }
      if (art.artist_id) sameNameDiffIds[art.artist_name].ids.add(art.artist_id)
      if (sameNameDiffIds[art.artist_name].titles.length < 2)
        sameNameDiffIds[art.artist_name].titles.push(art.title)
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
      sample_titles: g.titles.join(' | '),
    }))
    .sort((a, b) => b.total_artworks - a.total_artworks)

  table(q3Data)
  console.log(`⚠️  FOUND ${q3Data.length} suspicious names with multiple IDs!\n`)

  // ========================================================================
  // Analysis: Q4 - Key artists (Gaétan, Abel, Toh)
  // ========================================================================

  print('4️⃣  KEY ARTISTS - Gaétan, Abel, Toh')

  const keyArtists = allArtworks.filter(
    (art) =>
      (art.artist_name && /gaet|abel|toh/i.test(art.artist_name))
  )

  table(keyArtists.map((a) => ({
    kucibok_id: a.kucibok_id,
    title: a.title,
    artist_name: a.artist_name,
    artist_id: a.artist_id?.substring(0, 8) + '...',
    year: a.year,
    medium: a.medium,
  })))

  console.log(`Found ${keyArtists.length} artworks for key artists\n`)

  // Group key artists by ID + name
  const keyArtistsGrouped = {}
  keyArtists.forEach((art) => {
    const key = `${art.artist_id}||${art.artist_name}`
    if (!keyArtistsGrouped[key]) {
      keyArtistsGrouped[key] = { artist_id: art.artist_id, artist_name: art.artist_name, count: 0 }
    }
    keyArtistsGrouped[key].count++
  })

  console.log('Breakdown by (artist_id, artist_name):')
  Object.values(keyArtistsGrouped)
    .sort((a, b) => b.count - a.count)
    .forEach((g) => {
      console.log(`  ${g.artist_name} (${g.artist_id?.substring(0, 8)}...): ${g.count} artworks`)
    })
  console.log()

  // ========================================================================
  // Analysis: Q5 - Top 30 artists
  // ========================================================================

  print('5️⃣  TOP 30 - Artists with most artworks')

  const top30 = q1Data.slice(0, 30)
  table(top30)

  // ========================================================================
  // Analysis: Q6 - NULL/EMPTY
  // ========================================================================

  print('6️⃣  DATA QUALITY - NULL/EMPTY values')

  const nullChecks = [
    { issue: 'NULL artist_id', count: allArtworks.filter((a) => !a.artist_id).length },
    {
      issue: 'NULL artist_name',
      count: allArtworks.filter((a) => !a.artist_name).length,
    },
    { issue: 'EMPTY artist_name', count: allArtworks.filter((a) => a.artist_name === '').length },
  ]

  table(nullChecks)

  // ========================================================================
  // Analysis: Q7 - Duplicates
  // ========================================================================

  print('7️⃣  DUPLICATES - Same title/year/medium')

  const duplicates = {}
  allArtworks.forEach((art) => {
    const key = `${art.title}||${art.year}||${art.medium}`
    if (!duplicates[key]) {
      duplicates[key] = {
        title: art.title,
        year: art.year,
        medium: art.medium,
        artists: new Set(),
        count: 0,
      }
    }
    if (art.artist_name) duplicates[key].artists.add(art.artist_name)
    duplicates[key].count++
  })

  const q7Data = Object.values(duplicates)
    .filter((d) => d.count > 1)
    .map((d) => ({
      title: d.title,
      year: d.year,
      medium: d.medium,
      duplicate_count: d.count,
      artist_names: Array.from(d.artists).join(' | '),
      unique_artists: d.artists.size,
    }))
    .sort((a, b) => b.duplicate_count - a.duplicate_count)

  table(q7Data.slice(0, 30))
  console.log(`Found ${q7Data.length} potential duplicates\n`)

  // ========================================================================
  // Summary
  // ========================================================================

  print('📊 SUMMARY & FINDINGS')
  console.log(`Total artworks: ${allArtworks.length}`)
  console.log(`Unique (artist_id, artist_name) pairs: ${q1Data.length}`)
  console.log(`⚠️  Same ID with different names: ${q2Data.length}`)
  console.log(`⚠️  Same name with different IDs: ${q3Data.length}`)
  console.log(`⚠️  Potential duplicates: ${q7Data.length}`)
  console.log(`\n🎨 Key Artists Found:`)
  Object.values(keyArtistsGrouped)
    .sort((a, b) => b.count - a.count)
    .forEach((g) => {
      console.log(
        `  • ${g.artist_name.padEnd(25)} (ID: ${g.artist_id?.substring(0, 8)}...): ${g.count} artworks`
      )
    })

  console.log('\n✅ AUDIT COMPLETE!\n')
}

runAudit().catch((err) => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
