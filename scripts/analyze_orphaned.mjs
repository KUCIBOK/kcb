#!/usr/bin/env node

/**
 * Analyze orphaned artworks (no artist_id)
 * Identify patterns to fix them correctly
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔍 Analyzing 208 Orphaned Artworks...\n')

// Get orphaned artworks
const { data: orphaned, error: err1 } = await supabase
  .from('artworks')
  .select('id, kucibok_id, title, user_id, owner_id, created_at')
  .is('artist_id', null)

if (err1) {
  console.error('❌ Error:', err1)
  process.exit(1)
}

console.log(`Found ${orphaned.length} orphaned artworks\n`)

// Get users and artists to map
const { data: users, error: err2 } = await supabase.from('users').select('id, email')
const { data: artists, error: err3 } = await supabase.from('artists').select('id, name, user_id')

if (err2) console.warn('Warning fetching users:', err2.message)
if (err3) console.warn('Warning fetching artists:', err3.message)

const userMap = {}
if (users) {
  users.forEach((u) => {
    userMap[u.id] = u
  })
}

const artistMap = {}
if (artists) {
  artists.forEach((a) => {
    if (a.user_id) {
      if (!artistMap[a.user_id]) {
        artistMap[a.user_id] = []
      }
      artistMap[a.user_id].push(a)
    }
  })
}

// Analyze orphaned artworks
console.log('='.repeat(80))
console.log('Analysis by user_id / owner_id')
console.log('='.repeat(80) + '\n')

const groupedByUser = {}
orphaned.forEach((art) => {
  const userId = art.user_id || art.owner_id
  if (userId) {
    if (!groupedByUser[userId]) {
      groupedByUser[userId] = {
        user_id: userId,
        email: userMap[userId]?.email || 'UNKNOWN',
        artworks: [],
        artist_ids: new Set(),
      }
    }
    groupedByUser[userId].artworks.push(art)

    // Check if this user has artist profile(s)
    if (artistMap[userId]) {
      artistMap[userId].forEach((artist) => {
        groupedByUser[userId].artist_ids.add(artist.id)
      })
    }
  }
})

const summary = Object.values(groupedByUser)
  .map((g) => ({
    user_id: g.user_id.substring(0, 12) + '...',
    email: g.email,
    artworks_count: g.artworks.length,
    has_artist_profile: g.artist_ids.size > 0,
    artist_count: g.artist_ids.size,
    artist_ids: Array.from(g.artist_ids)
      .map((id) => id.substring(0, 8) + '...')
      .join(', '),
  }))
  .sort((a, b) => b.artworks_count - a.artworks_count)

console.table(summary)

// Export data for correction
console.log('\n' + '='.repeat(80))
console.log('Correction Strategy')
console.log('='.repeat(80) + '\n')

let fixable = 0
let needsManualReview = 0

Object.values(groupedByUser).forEach((g) => {
  if (g.artist_ids.size === 1) {
    fixable++
  } else if (g.artist_ids.size > 1) {
    needsManualReview++
  }
})

console.log(`✅ Can auto-fix (user has 1 artist profile): ${fixable}`)
console.log(`⚠️  Needs manual review (user has multiple artist profiles): ${needsManualReview}`)
console.log(`❓ No artist profile attached: ${Object.keys(groupedByUser).length - fixable - needsManualReview}`)

// Show fixable ones
console.log('\n' + '='.repeat(80))
console.log('Auto-Fixable Mappings')
console.log('='.repeat(80) + '\n')

const autoFixMappings = []
Object.values(groupedByUser).forEach((g) => {
  if (g.artist_ids.size === 1) {
    const artistId = Array.from(g.artist_ids)[0]
    autoFixMappings.push({
      user_id: g.user_id,
      email: g.email,
      artworks_count: g.artworks.length,
      artist_id_to_assign: artistId,
    })
  }
})

console.table(autoFixMappings)

console.log('\n' + '='.repeat(80))
console.log('Manual Review Needed')
console.log('='.repeat(80) + '\n')

Object.values(groupedByUser).forEach((g) => {
  if (g.artist_ids.size > 1) {
    console.log(`\n❓ User: ${g.email}`)
    console.log(`   Artworks: ${g.artworks.length}`)
    console.log(`   Has ${g.artist_ids.size} artist profiles - need to choose which one:`)
    g.artist_ids.forEach((aid) => {
      const artist = artistMap[g.user_id].find((a) => a.id === aid)
      console.log(`     • ${artist.name} (${aid})`)
    })
    console.log(`   Sample artworks:`)
    g.artworks.slice(0, 3).forEach((art) => {
      console.log(`     - ${art.title}`)
    })
  }
})

console.log('\n✅ Analysis Complete!\n')

// Export SQL for auto-fixing
console.log('\n' + '='.repeat(80))
console.log('SQL for Auto-Fix')
console.log('='.repeat(80) + '\n')

console.log('-- Update orphaned artworks with their owner\'s artist_id\n')

autoFixMappings.forEach((mapping) => {
  console.log(`-- User: ${mapping.email} (${mapping.user_id})`)
  console.log(`-- Artworks to fix: ${mapping.artworks_count}`)
  console.log(
    `UPDATE artworks SET artist_id = '${mapping.artist_id_to_assign}' WHERE (user_id = '${mapping.user_id}' OR owner_id = '${mapping.user_id}') AND artist_id IS NULL;\n`
  )
})

process.exit(0)
