#!/usr/bin/env node

/**
 * Import Sales Data from Google Sheets Dashboard Comptable V5
 * Sheet: https://docs.google.com/spreadsheets/d/1ISzDcDWE3S36ze5Vv8k0ojKfA259TCAa/edit?gid=563295159
 */

import fetch from 'node-fetch'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const SHEET_ID = '1ISzDcDWE3S36ze5Vv8k0ojKfA259TCAa'
const GID = '563295159'
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

console.log('\n📊 Importing Sales Data from Google Sheets\n')
console.log(`Sheet: Dashboard Comptable V5`)
console.log(`GID: ${GID}\n`)

// ========================================================================
// STEP 1: Fetch CSV from Google Sheets
// ========================================================================

console.log('📥 Downloading data from Google Sheets...\n')

let csvData
try {
  const response = await fetch(CSV_URL)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  csvData = await response.text()
  console.log(`✅ Downloaded ${csvData.length} bytes\n`)
} catch (err) {
  console.error('❌ Failed to download:', err.message)
  process.exit(1)
}

// ========================================================================
// STEP 2: Parse CSV
// ========================================================================

console.log('🔍 Parsing CSV...\n')

let records
try {
  records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })
  console.log(`✅ Parsed ${records.length} rows\n`)
} catch (err) {
  console.error('❌ Failed to parse CSV:', err.message)
  process.exit(1)
}

if (records.length === 0) {
  console.error('❌ No data found in CSV')
  process.exit(1)
}

// ========================================================================
// STEP 3: Show data structure
// ========================================================================

console.log('📋 Data Structure:')
console.log('─'.repeat(80))

const columns = Object.keys(records[0])
console.log(`Columns (${columns.length}):`)
columns.forEach((col) => {
  console.log(`  • ${col}`)
})

console.log('\nFirst 3 rows:')
console.log('─'.repeat(80))

records.slice(0, 3).forEach((row, idx) => {
  console.log(`\n${idx + 1}. `)
  Object.entries(row).forEach(([key, val]) => {
    console.log(`   ${key}: ${String(val).substring(0, 50)}`)
  })
})

// ========================================================================
// STEP 4: Analysis - identify transaction columns
// ========================================================================

console.log('\n\n' + '='.repeat(80))
console.log('📊 ANALYSIS - Identifying Sales Data')
console.log('='.repeat(80) + '\n')

// Show some statistics
const nonEmptyColumns = {}
columns.forEach((col) => {
  let count = 0
  records.forEach((row) => {
    if (row[col] && String(row[col]).trim() !== '') {
      count++
    }
  })
  nonEmptyColumns[col] = count
})

console.log('Column Fill Rate:')
Object.entries(nonEmptyColumns)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([col, count]) => {
    const pct = ((count / records.length) * 100).toFixed(1)
    console.log(`  ${col.padEnd(40)} : ${count}/${records.length} (${pct}%)`)
  })

// ========================================================================
// STEP 5: Summary
// ========================================================================

console.log('\n\n' + '='.repeat(80))
console.log('✅ DATA READY FOR IMPORT')
console.log('='.repeat(80))

console.log(`\nTotal rows: ${records.length}`)
console.log(`Columns: ${columns.length}`)
console.log(`\nNEXT STEPS:`)
console.log(`1. Map columns to Kucibok transaction schema`)
console.log(`2. Identify: date, artist, amount, buyer_country, status`)
console.log(`3. Import to transactions table`)

console.log('\n💡 SAMPLE MAPPING (you need to confirm):')
console.log('─'.repeat(80))

// Try to auto-detect columns
const dateCol = columns.find((c) =>
  /date|date|datee|jour|when/i.test(c)
)
const amountCol = columns.find((c) =>
  /amount|price|montant|prix|total|vente/i.test(c)
)
const artistCol = columns.find((c) =>
  /artist|artiste|creator|createur|name|nom/i.test(c)
)
const buyerCol = columns.find((c) =>
  /buyer|acheteur|client|customer|pays|country/i.test(c)
)

console.log(`Date column:   ${dateCol || '❓ NOT FOUND'}`)
console.log(`Amount column: ${amountCol || '❓ NOT FOUND'}`)
console.log(`Artist column: ${artistCol || '❓ NOT FOUND'}`)
console.log(`Buyer column:  ${buyerCol || '❓ NOT FOUND'}`)

console.log('\n')
process.exit(0)
