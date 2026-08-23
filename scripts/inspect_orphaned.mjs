#!/usr/bin/env node

/**
 * Inspect the 208 orphaned artworks in detail
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔍 Inspecting 208 Orphaned Artworks\n')

// Get orphaned artworks with full details
const { data: allArtworks } = await supabase
  .from('artworks')
  .select('id, kucibok_id, title, user_id, owner_id, artist_id, status, category, created_at')

const orphaned = allArtworks.filter((a) => !a.artist_id).sort(() => Math.random() - 0.5)

console.log(`Total orphaned: ${orphaned.length}\n`)

// Get users for lookup
const { data: users } = await supabase
  .from('users')
  .select('id, name, role')

const userMap = {}
users.forEach((u) => {
  userMap[u.id] = u
})

// Get artists
const { data: artists } = await supabase
  .from('artists')
  .select('id, name, user_id')

const artistMap = {}
const artistsByUserId = {}
artists.forEach((a) => {
  artistMap[a.id] = a
  if (a.user_id) {
    if (!artistsByUserId[a.user_id]) {
      artistsByUserId[a.user_id] = []
    }
    artistsByUserId[a.user_id].push(a)
  }
})

console.log('='.repeat(80))
console.log('RANDOM SAMPLE: 30 Orphaned Artworks')
console.log('='.repeat(80) + '\n')

orphaned.slice(0, 30).forEach((art, idx) => {
  const userId = art.user_id || art.owner_id
  const user = userMap[userId]
  const potentialArtists = artistsByUserId[userId] || []

  console.log(`\n${idx + 1}. ${art.kucibok_id}`)
  console.log(`   Title: "${art.title}"`)
  console.log(`   Status: ${art.status}`)
  console.log(`   User: ${user ? user.name : 'UNKNOWN'} (${user?.role || '?'})`)
  console.log(`   User ID: ${userId?.substring(0, 12)}...`)
  console.log(`   User has artist profile? ${potentialArtists.length > 0 ? '✓ YES' : '✗ NO'}`)
  if (potentialArtists.length > 0) {
    potentialArtists.forEach((pa) => {
      console.log(`     → ${pa.name} (${pa.id.substring(0, 12)}...)`)
    })
  }
})

console.log('\n' + '='.repeat(80))
console.log('SUMMARY BY USER ROLE')
console.log('='.repeat(80) + '\n')

const byRole = {}
orphaned.forEach((art) => {
  const userId = art.user_id || art.owner_id
  const user = userMap[userId]
  const role = user?.role || 'UNKNOWN'

  if (!byRole[role]) {
    byRole[role] = { count: 0, hasArtistProfile: 0 }
  }
  byRole[role].count++

  if (artistsByUserId[userId]?.length > 0) {
    byRole[role].hasArtistProfile++
  }
})

Object.entries(byRole)
  .sort((a, b) => b[1].count - a[1].count)
  .forEach(([role, data]) => {
    const pct = ((data.hasArtistProfile / data.count) * 100).toFixed(1)
    console.log(
      `${role.padEnd(20)} : ${data.count.toString().padEnd(3)} artworks (${data.hasArtistProfile}/${data.count} have artist profile = ${pct}%)`
    )
  })

console.log('\n')
process.exit(0)
