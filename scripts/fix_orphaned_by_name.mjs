#!/usr/bin/env node

/**
 * Fix orphaned artworks by matching user names to artist names
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔧 Fixing Orphaned Artworks by Name Matching\n')

// Get all data
const { data: allArtworks } = await supabase.from('artworks').select('id, user_id, owner_id, artist_id')
const { data: users } = await supabase.from('users').select('id, name, role')
const { data: artists } = await supabase.from('artists').select('id, name, user_id')

const orphaned = allArtworks.filter((a) => !a.artist_id)

console.log(`Total artworks: ${allArtworks.length}`)
console.log(`Orphaned: ${orphaned.length}`)
console.log(`Artists: ${artists.length}\n`)

// Create lookup maps
const userNameMap = {}
users.forEach((u) => {
  if (u.name) {
    userNameMap[u.name] = u.id
  }
})

const artistsByName = {}
artists.forEach((artist) => {
  if (artist.name) {
    if (!artistsByName[artist.name]) {
      artistsByName[artist.name] = []
    }
    artistsByName[artist.name].push(artist)
  }
})

console.log(`Users: ${users.length}`)
console.log(`Artist names: ${Object.keys(artistsByName).length}\n`)

// ========================================================================
// MATCHING STRATEGY
// ========================================================================
// For each orphaned artwork:
//   1. Get the user who uploaded it (user_id or owner_id)
//   2. Get that user's name
//   3. Find artists with that name
//   4. If found, assign the artist_id

let fixed = 0
let skipped = 0
const updates = []

console.log('🔍 Matching...\n')

for (const art of orphaned) {
  const userId = art.user_id || art.owner_id
  if (!userId) {
    skipped++
    continue
  }

  const user = users.find((u) => u.id === userId)
  if (!user || !user.name) {
    skipped++
    continue
  }

  const matchingArtists = artistsByName[user.name]
  if (!matchingArtists || matchingArtists.length === 0) {
    skipped++
    continue
  }

  // If multiple artists with same name, pick first one
  const artist = matchingArtists[0]

  updates.push({
    artwork_id: art.id,
    user_name: user.name,
    artist_id: artist.id,
    artist_name: artist.name,
  })
  fixed++
}

console.log(`✅ Can fix: ${fixed} artworks`)
console.log(`⏸️  Cannot fix: ${skipped} artworks\n`)

// ========================================================================
// APPLY UPDATES
// ========================================================================

if (fixed > 0) {
  console.log('💾 Applying updates...\n')

  for (let i = 0; i < updates.length; i++) {
    const update = updates[i]

    const { error } = await supabase
      .from('artworks')
      .update({ artist_id: update.artist_id })
      .eq('id', update.artwork_id)

    if (error) {
      console.error(`  ❌ ${update.artwork_id}: ${error.message}`)
    }

    if ((i + 1) % 50 === 0) {
      console.log(`  ${i + 1}/${updates.length} done...`)
    }
  }

  console.log(`\n✅ Updated ${fixed} artworks\n`)
}

// ========================================================================
// VERIFY
// ========================================================================

console.log('📊 Verifying...\n')

const { data: allArtworks2 } = await supabase.from('artworks').select('id, artist_id')
const orphaned2 = allArtworks2.filter((a) => !a.artist_id)

console.log(`Before: ${orphaned.length} orphaned`)
console.log(`After:  ${orphaned2.length} orphaned`)
console.log(`Fixed:  ${orphaned.length - orphaned2.length}\n`)

if (orphaned2.length > 0 && orphaned2.length <= 30) {
  console.log('⚠️  Remaining orphaned artworks (need manual fix):')
  orphaned2.slice(0, 30).forEach((a) => {
    console.log(`  ${a.id}`)
  })
  console.log()
}

console.log('✨ Done!\n')

process.exit(0)
