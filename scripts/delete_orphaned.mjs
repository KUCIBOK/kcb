#!/usr/bin/env node

/**
 * Delete orphaned artworks (193 from sourcing catalog)
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🗑️  Deleting Orphaned Artworks from Sourcing Catalog\n')

// ========================================================================
// BEFORE: Count orphaned artworks
// ========================================================================

const { data: allArtworks1, error: err1 } = await supabase
  .from('artworks')
  .select('id, status, artist_id')

if (err1) {
  console.error('❌ Error:', err1)
  process.exit(1)
}

const approved1 = allArtworks1.filter((a) => a.status === 'approved')
const approvedOrphaned1 = approved1.filter((a) => !a.artist_id)
const total1 = allArtworks1.length

console.log('📊 BEFORE:')
console.log(`  Total artworks: ${total1}`)
console.log(`  Approved: ${approved1.length}`)
console.log(`  Approved + Orphaned: ${approvedOrphaned1.length}`)
console.log(`  To DELETE: ${approvedOrphaned1.length}\n`)

// ========================================================================
// DELETE: Get IDs to delete
// ========================================================================

console.log('🔍 Finding artworks to delete...\n')

const toDelete = allArtworks1.filter(
  (a) => a.status === 'approved' && !a.artist_id
)

console.log(`Found ${toDelete.length} artworks to delete:\n`)

// Show first 20
toDelete.slice(0, 20).forEach((art, idx) => {
  console.log(`  ${idx + 1}. ${art.id}`)
})

if (toDelete.length > 20) {
  console.log(`  ... and ${toDelete.length - 20} more\n`)
}

// ========================================================================
// EXECUTE: Delete in batches
// ========================================================================

console.log('\n💾 Deleting...\n')

let deleted = 0
const BATCH_SIZE = 50

for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
  const batch = toDelete.slice(i, i + BATCH_SIZE)

  for (const art of batch) {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', art.id)

    if (!error) {
      deleted++
    } else {
      console.error(`  ❌ Failed to delete ${art.id}: ${error.message}`)
    }
  }

  console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} rows deleted`)
}

console.log(`\n✅ Deleted: ${deleted}/${toDelete.length}\n`)

// ========================================================================
// AFTER: Verify deletion
// ========================================================================

console.log('📊 AFTER:')

const { data: allArtworks2 } = await supabase
  .from('artworks')
  .select('id, status, artist_id')

const approved2 = allArtworks2.filter((a) => a.status === 'approved')
const approvedOrphaned2 = approved2.filter((a) => !a.artist_id)
const total2 = allArtworks2.length

console.log(`  Total artworks: ${total2} (removed ${total1 - total2})`)
console.log(`  Approved: ${approved2.length} (removed ${approved1.length - approved2.length})`)
console.log(`  Approved + Orphaned: ${approvedOrphaned2.length} (removed ${approvedOrphaned1.length - approvedOrphaned2.length})`)

console.log('\n✨ Deletion Complete!\n')

process.exit(0)
