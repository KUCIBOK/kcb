#!/usr/bin/env node

/**
 * Check the sourcing catalog - are all 300 works linked to creators?
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔍 Checking Sourcing Catalog (300 works)\n')

// Get all artworks with their details
const { data: allArtworks } = await supabase
  .from('artworks')
  .select('id, kucibok_id, title, artist_id, status, availability_status, for_sale, created_at')

console.log(`Total artworks in database: ${allArtworks.length}\n`)

// Filter for "sourcing catalog" - probably:
// - status = 'approved' (published)
// - for_sale = true OR availability_status = 'available'
// - has artist_id

const withArtist = allArtworks.filter((a) => a.artist_id)
const withoutArtist = allArtworks.filter((a) => !a.artist_id)

console.log('📊 Overall Status:')
console.log(`  With artist_id (linked to creator): ${withArtist.length}`)
console.log(`  WITHOUT artist_id (orphaned): ${withoutArtist.length}\n`)

// Check by status
const byStatus = {}
allArtworks.forEach((art) => {
  const status = art.status || 'UNKNOWN'
  if (!byStatus[status]) {
    byStatus[status] = { total: 0, withArtist: 0, withoutArtist: 0 }
  }
  byStatus[status].total++
  if (art.artist_id) byStatus[status].withArtist++
  else byStatus[status].withoutArtist++
})

console.log('📋 By Status:')
console.log('─'.repeat(80))
Object.entries(byStatus).forEach(([status, counts]) => {
  const pct = ((counts.withArtist / counts.total) * 100).toFixed(1)
  console.log(`  ${status.padEnd(15)} : ${counts.total} total | ${counts.withArtist} with artist_id | ${counts.withoutArtist} orphaned (${pct}% linked)`)
})

// Assume "sourcing catalog" = approved + available
const approvednAvailable = allArtworks.filter(
  (a) => a.status === 'approved' && (a.for_sale || a.availability_status === 'available')
)

const sourcingWithArtist = approvednAvailable.filter((a) => a.artist_id)
const sourcingWithoutArtist = approvednAvailable.filter((a) => !a.artist_id)

console.log('\n' + '='.repeat(80))
console.log('✅ SOURCING CATALOG (Approved + Available):')
console.log('='.repeat(80))
console.log(`\nTotal in sourcing: ${approvednAvailable.length}`)
console.log(`  ✓ Linked to creator (artist_id): ${sourcingWithArtist.length}`)
console.log(`  ✗ Orphaned (no artist_id): ${sourcingWithoutArtist.length}`)
console.log(`\n✅ Linkage rate: ${((sourcingWithArtist.length / approvednAvailable.length) * 100).toFixed(1)}% are linked\n`)

// If there are orphaned ones in sourcing, show them
if (sourcingWithoutArtist.length > 0) {
  console.log('⚠️  Orphaned works in sourcing catalog:')
  console.log('─'.repeat(80))
  sourcingWithoutArtist.slice(0, 20).forEach((art) => {
    console.log(`  ${art.kucibok_id} - "${art.title}"`)
  })
  if (sourcingWithoutArtist.length > 20) {
    console.log(`  ... and ${sourcingWithoutArtist.length - 20} more`)
  }
}

console.log('\n')
process.exit(0)
