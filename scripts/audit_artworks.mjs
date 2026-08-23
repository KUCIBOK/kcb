#!/usr/bin/env node

/**
 * Deep Audit: Artwork Attribution Analysis
 * Run with: node scripts/audit_artworks.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
})

console.log('\n🔍 DEEP AUDIT: Artwork Attribution (Full Database Analysis)')
console.log('=' .repeat(80))
console.log(`Supabase Project: wyrmpddlhldjzoiwbshj`)
console.log(`Timestamp: ${new Date().toISOString()}\n`)

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function printTable(data, title = '') {
  if (!data || !Array.isArray(data)) return
  if (data.length === 0) {
    console.log('  (No results)')
    return
  }

  // Limit rows for display
  const displayData = data.slice(0, 50)
  console.table(displayData)

  if (data.length > 50) {
    console.log(`\n  ... and ${data.length - 50} more rows\n`)
  }
}

async function executeQuery(name, sql) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`${name}`)
  console.log(`${'='.repeat(80)}\n`)

  try {
    // Use the from() method to execute a query
    const { data, error } = await supabase.rpc('execute_sql', { sql })

    if (error) {
      console.error(`❌ Error: ${error.message}`)
      console.error(`Code: ${error.code}`)
      return null
    }

    printTable(data, name)
    return data
  } catch (err) {
    console.error(`❌ Exception: ${err.message}`)
    return null
  }
}

// ============================================================================
// MAIN AUDIT
// ============================================================================

async function runAudit() {
  // Q1: Count total artworks
  console.log('\n📊 STEP 1: Total Artwork Count')
  console.log('-'.repeat(80))
  const { data: totalData } = await supabase
    .from('artworks')
    .select('id', { count: 'exact', head: true })
  console.log(`Total artworks in database: ${totalData?.length || 'ERROR'}\n`)

  // Q2: Group by artist_id and artist_name
  await executeQuery(
    '1️⃣  GROUPS - Artworks grouped by artist_id and artist_name',
    `
    SELECT
      artist_id,
      artist_name,
      COUNT(*) as artwork_count,
      MIN(year) as first_year,
      MAX(year) as last_year,
      COUNT(DISTINCT medium) as unique_mediums
    FROM artworks
    WHERE artist_id IS NOT NULL AND artist_name IS NOT NULL
    GROUP BY artist_id, artist_name
    ORDER BY artwork_count DESC
    LIMIT 100
    `
  )

  // Q3: Suspicious patterns - same ID, different names
  const suspiciousIds = await executeQuery(
    '2️⃣  SUSPICIOUS - Same artist_id with DIFFERENT artist_name values',
    `
    SELECT
      artist_id,
      COUNT(DISTINCT artist_name) as name_variants,
      STRING_AGG(DISTINCT artist_name, ' | ') as all_names,
      COUNT(*) as total_artworks
    FROM artworks
    WHERE artist_id IS NOT NULL
    GROUP BY artist_id
    HAVING COUNT(DISTINCT artist_name) > 1
    ORDER BY total_artworks DESC
    `
  )

  // Q4: Suspicious patterns - same name, different IDs
  const suspiciousNames = await executeQuery(
    '3️⃣  SUSPICIOUS - Same artist_name with DIFFERENT artist_id values',
    `
    SELECT
      artist_name,
      COUNT(DISTINCT artist_id) as id_variants,
      STRING_AGG(DISTINCT artist_id, ' | ') as all_ids,
      COUNT(*) as total_artworks
    FROM artworks
    WHERE artist_name IS NOT NULL
    GROUP BY artist_name
    HAVING COUNT(DISTINCT artist_id) > 1
    ORDER BY total_artworks DESC
    `
  )

  // Q5: Specific artists
  await executeQuery(
    '4️⃣  KEY ARTISTS - All artworks for Gaétan, Abel, Toh',
    `
    SELECT
      artist_id,
      artist_name,
      kucibok_id,
      title,
      year,
      medium,
      price
    FROM artworks
    WHERE artist_name ILIKE '%gaet%'
       OR artist_name ILIKE '%abel%'
       OR artist_name ILIKE '%toh%'
    ORDER BY artist_name, title
    `
  )

  // Q6: Top 30 artists
  await executeQuery(
    '5️⃣  TOP 30 - Artists with most artworks',
    `
    SELECT
      artist_name,
      artist_id,
      COUNT(*) as artwork_count,
      MIN(year) as earliest_year,
      MAX(year) as latest_year,
      COUNT(DISTINCT medium) as mediums
    FROM artworks
    WHERE artist_id IS NOT NULL
    GROUP BY artist_id, artist_name
    ORDER BY artwork_count DESC
    LIMIT 30
    `
  )

  // Q7: NULL/EMPTY check
  await executeQuery(
    '6️⃣  DATA QUALITY - NULL/EMPTY values',
    `
    SELECT
      COUNT(*) as count,
      'NULL artist_id' as issue
    FROM artworks
    WHERE artist_id IS NULL

    UNION ALL

    SELECT
      COUNT(*) as count,
      'NULL artist_name' as issue
    FROM artworks
    WHERE artist_name IS NULL

    UNION ALL

    SELECT
      COUNT(*) as count,
      'EMPTY artist_name (blank string)' as issue
    FROM artworks
    WHERE artist_name = ''
    `
  )

  // Q8: Duplicates by title/year/medium
  await executeQuery(
    '7️⃣  DUPLICATES - Identical title/year/medium with different artists',
    `
    SELECT
      title,
      year,
      medium,
      COUNT(*) as duplicate_count,
      STRING_AGG(DISTINCT artist_name, ' | ') as artist_names,
      STRING_AGG(DISTINCT artist_id::text, ' | ') as artist_ids,
      COUNT(DISTINCT artist_id) as unique_artists
    FROM artworks
    WHERE title IS NOT NULL
    GROUP BY title, year, medium
    HAVING COUNT(*) > 1
    ORDER BY duplicate_count DESC, title
    LIMIT 50
    `
  )

  console.log('\n\n' + '='.repeat(80))
  console.log('✨ AUDIT COMPLETE')
  console.log('='.repeat(80))
  console.log('\n📋 KEY FINDINGS:')
  console.log(`  - Suspicious ID patterns (same ID, different names): ${suspiciousIds?.length || 0}`)
  console.log(`  - Suspicious Name patterns (same name, different IDs): ${suspiciousNames?.length || 0}`)
  console.log('\n📝 NEXT STEPS:')
  console.log('  1. Review "SUSPICIOUS" sections for attribution errors')
  console.log('  2. Verify "KEY ARTISTS" section - Gaétan, Abel, Toh')
  console.log('  3. Create correction migration based on findings\n')
}

// Run it
runAudit().catch(console.error)
