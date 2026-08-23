#!/usr/bin/env node

/**
 * Check the actual user_id and owner_id values in database
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔍 Checking user_id and owner_id in orphaned artworks\n')

// Get ALL artworks without artist_id
const { data: orphaned } = await supabase
  .from('artworks')
  .select('id, kucibok_id, title, user_id, owner_id, artist_id')

const noArtist = orphaned.filter((a) => !a.artist_id)

console.log(`Total artworks: ${orphaned.length}`)
console.log(`Without artist_id: ${noArtist.length}\n`)

// Check user_id and owner_id patterns
let nullUserId = 0
let nullOwnerId = 0
let bothNull = 0
let hasBoth = 0

const userIds = new Set()
const ownerIds = new Set()

noArtist.forEach((art) => {
  if (!art.user_id) nullUserId++
  if (!art.owner_id) nullOwnerId++
  if (!art.user_id && !art.owner_id) bothNull++
  if (art.user_id && art.owner_id) hasBoth++

  if (art.user_id) userIds.add(art.user_id)
  if (art.owner_id) ownerIds.add(art.owner_id)
})

console.log('📊 Data Quality:')
console.log(`  NULL user_id: ${nullUserId}/${noArtist.length}`)
console.log(`  NULL owner_id: ${nullOwnerId}/${noArtist.length}`)
console.log(`  BOTH NULL: ${bothNull}/${noArtist.length}`)
console.log(`  Have BOTH: ${hasBoth}/${noArtist.length}`)
console.log(`\n  Unique user_id values: ${userIds.size}`)
console.log(`  Unique owner_id values: ${ownerIds.size}\n`)

// Show first 20 with their IDs
console.log('First 20 orphaned artworks (show all columns):')
console.log('='.repeat(100) + '\n')

noArtist.slice(0, 20).forEach((art) => {
  console.log(`ID: ${art.id}`)
  console.log(`  kucibok_id: ${art.kucibok_id}`)
  console.log(`  title: ${art.title?.substring(0, 50)}`)
  console.log(`  user_id: ${art.user_id || '(null)'}`)
  console.log(`  owner_id: ${art.owner_id || '(null)'}`)
  console.log(`  artist_id: ${art.artist_id || '(null)'}`)
  console.log()
})

// Show artworks that have user_id or owner_id
console.log('\n' + '='.repeat(100))
console.log('Orphaned artworks WITH user_id or owner_id:')
console.log('='.repeat(100) + '\n')

const withIds = noArtist.filter((a) => a.user_id || a.owner_id)

console.log(`Found: ${withIds.length} artworks with user_id or owner_id\n`)

if (withIds.length > 0 && withIds.length <= 50) {
  console.table(
    withIds.map((a) => ({
      kucibok_id: a.kucibok_id,
      title: a.title?.substring(0, 30),
      user_id: a.user_id?.substring(0, 12) + '...' || null,
      owner_id: a.owner_id?.substring(0, 12) + '...' || null,
    }))
  )
}

console.log('\n')
process.exit(0)
