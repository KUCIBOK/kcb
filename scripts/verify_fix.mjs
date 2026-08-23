#!/usr/bin/env node

/**
 * Verify the fix worked
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔍 Verifying artworks fix...\n')

// Fetch ALL artworks and check manually
const { data: allArtworks } = await supabase
  .from('artworks')
  .select('id, artist_id')

const withoutArtistId = allArtworks.filter((a) => !a.artist_id || a.artist_id === null)

console.log(`Total artworks: ${allArtworks.length}`)
console.log(`With artist_id: ${allArtworks.length - withoutArtistId.length}`)
console.log(`WITHOUT artist_id: ${withoutArtistId.length}`)

if (withoutArtistId.length > 0) {
  console.log(`\nFirst 10 orphaned artworks:`)
  withoutArtistId.slice(0, 10).forEach((a) => {
    console.log(`  ${a.id}`)
  })
}

console.log()
process.exit(0)
