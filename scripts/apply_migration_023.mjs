#!/usr/bin/env node

/**
 * Apply Migration 023: Fix Orphaned Artworks
 * This assigns artist_id to 200+ artworks using user_id matching
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔧 Applying Migration 023: Fix Orphaned Artworks\n')

// ============================================================================
// STEP 1: Count before
// ============================================================================

const { data: beforeData } = await supabase
  .from('artworks')
  .select('id', { count: 'exact', head: true })
  .is('artist_id', null)

const beforeCount = beforeData?.length || 0
console.log(`📊 Before: ${beforeCount} artworks without artist_id\n`)

// ============================================================================
// STEP 2: Execute the fix
// ============================================================================

console.log('🔄 Executing fix...\n')

// Get all orphaned artworks
const { data: orphaned, error: err1 } = await supabase
  .from('artworks')
  .select('id, user_id, owner_id')
  .is('artist_id', null)

if (err1) {
  console.error('❌ Error fetching orphaned artworks:', err1)
  process.exit(1)
}

console.log(`Found ${orphaned.length} orphaned artworks\n`)

// Get all artists with user_id
const { data: artists, error: err2 } = await supabase
  .from('artists')
  .select('id, user_id, name')

if (err2) {
  console.error('❌ Error fetching artists:', err2)
  process.exit(1)
}

console.log(`Loaded ${artists.length} artists\n`)

// Create artist lookup by user_id
const artistByUserId = {}
artists.forEach((artist) => {
  if (artist.user_id) {
    artistByUserId[artist.user_id] = artist
  }
})

// ============================================================================
// STEP 3: Match and update
// ============================================================================

console.log('🎨 Matching artworks to artists...\n')

let fixed = 0
let skipped = 0
const updates = []

for (const art of orphaned) {
  const userId = art.user_id || art.owner_id
  const artist = artistByUserId[userId]

  if (artist) {
    updates.push({
      id: art.id,
      artist_id: artist.id,
      artist_name: artist.name,
    })
    fixed++
  } else {
    skipped++
  }
}

console.log(`✅ Will fix: ${fixed} artworks`)
console.log(`⚠️  Will skip (no artist profile): ${skipped} artworks\n`)

// Execute updates in batches
console.log('💾 Applying updates in batches...\n')

const BATCH_SIZE = 50
let batchNum = 0

for (let i = 0; i < updates.length; i += BATCH_SIZE) {
  batchNum++
  const batch = updates.slice(i, i + BATCH_SIZE)

  // Update each artwork in the batch
  for (const update of batch) {
    const { error } = await supabase
      .from('artworks')
      .update({ artist_id: update.artist_id })
      .eq('id', update.id)

    if (error) {
      console.error(
        `  ❌ Error updating ${update.id}: ${error.message}`
      )
    }
  }

  console.log(`  Batch ${batchNum}: ${batch.length} rows updated`)
}

// ============================================================================
// STEP 4: Count after
// ============================================================================

console.log('\n📊 Verifying...\n')

const { data: afterData } = await supabase
  .from('artworks')
  .select('id', { count: 'exact', head: true })
  .is('artist_id', null)

const afterCount = afterData?.length || 0

console.log(`✅ After: ${afterCount} artworks without artist_id`)
console.log(`📈 Fixed: ${beforeCount - afterCount} artworks`)
console.log(`⏸️  Remaining orphaned: ${afterCount}\n`)

// ============================================================================
// STEP 5: Show remaining orphaned
// ============================================================================

if (afterCount > 0 && afterCount <= 20) {
  console.log('⚠️  Remaining orphaned artworks (manual review needed):\n')

  const { data: remaining } = await supabase
    .from('artworks')
    .select('id, kucibok_id, title, user_id, owner_id')
    .is('artist_id', null)
    .limit(50)

  remaining.forEach((art) => {
    console.log(`  • ${art.kucibok_id} - "${art.title}" (user: ${art.user_id?.substring(0, 8)}...)`)
  })
  console.log()
}

console.log('✨ Migration 023 Complete!\n')

process.exit(0)
