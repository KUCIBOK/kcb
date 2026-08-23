#!/usr/bin/env node

/**
 * Import Sales Data from Google Sheets (Simple version)
 */

import https from 'https'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const SHEET_ID = '1ISzDcDWE3S36ze5Vv8k0ojKfA259TCAa'
const GID = '563295159'
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

console.log('\n📊 Importing Sales Data from Google Sheets\n')
console.log(`Sheet: Dashboard Comptable V5`)
console.log(`URL: ${CSV_URL}\n`)

// ========================================================================
// STEP 1: Fetch CSV from Google Sheets
// ========================================================================

console.log('📥 Downloading CSV...\n')

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const makeRequest = (urlToFetch) => {
      https.get(urlToFetch, (response) => {
        // Follow redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          makeRequest(response.headers.location)
          return
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`))
          return
        }

        let data = ''
        response.on('data', (chunk) => {
          data += chunk
        })
        response.on('end', () => {
          resolve(data)
        })
      }).on('error', reject)
    }

    makeRequest(url)
  })
}

let csvData
try {
  csvData = await downloadFile(CSV_URL)
  console.log(`✅ Downloaded ${csvData.length} bytes\n`)
} catch (err) {
  console.error('❌ Failed to download:', err.message)
  process.exit(1)
}

// ========================================================================
// STEP 2: Simple CSV Parser
// ========================================================================

console.log('🔍 Parsing CSV...\n')

function parseCSV(csv) {
  const lines = csv.trim().split('\n')
  if (lines.length === 0) return { headers: [], rows: [] }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const values = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''))
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''))

    const row = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx] || ''
    })
    rows.push(row)
  }

  return { headers, rows }
}

const { headers, rows } = parseCSV(csvData)

console.log(`✅ Parsed ${rows.length} rows, ${headers.length} columns\n`)

// ========================================================================
// STEP 3: Show structure
// ========================================================================

console.log('📋 Data Structure:')
console.log('─'.repeat(100))

console.log(`Columns (${headers.length}):`)
headers.forEach((h) => {
  console.log(`  • "${h}"`)
})

console.log('\n\nFirst 5 rows:')
console.log('─'.repeat(100))

rows.slice(0, 5).forEach((row, idx) => {
  console.log(`\nRow ${idx + 1}:`)
  headers.forEach((header) => {
    const val = row[header] || '(empty)'
    console.log(`  ${header.padEnd(40)}: ${String(val).substring(0, 60)}`)
  })
})

// ========================================================================
// STEP 4: Identify key columns
// ========================================================================

console.log('\n\n' + '='.repeat(100))
console.log('🔍 ANALYSIS - Identifying Sales Columns')
console.log('='.repeat(100) + '\n')

console.log('Column Analysis:')
console.log('─'.repeat(100))

const stats = {}
headers.forEach((header) => {
  let filled = 0
  let numeric = 0
  let dates = 0

  rows.forEach((row) => {
    const val = row[header]
    if (val && String(val).trim() !== '') {
      filled++
      if (!isNaN(parseFloat(val))) numeric++
      if (/^\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}/.test(val)) dates++
    }
  })

  stats[header] = { filled, numeric, dates, fillRate: ((filled / rows.length) * 100).toFixed(1) }
})

Object.entries(stats)
  .sort((a, b) => b[1].filled - a[1].filled)
  .forEach(([header, stat]) => {
    const badges = []
    if (stat.fillRate >= 80) badges.push('✓FULL')
    if (stat.numeric > stat.filled * 0.8) badges.push('NUMERIC')
    if (stat.dates > stat.filled * 0.8) badges.push('DATES')

    console.log(
      `${header.padEnd(40)} : ${stat.filled}/${rows.length} (${stat.fillRate}%) ${badges.join(' ')}`
    )
  })

// ========================================================================
// STEP 5: Suggest mapping
// ========================================================================

console.log('\n\n' + '='.repeat(100))
console.log('💡 SUGGESTED COLUMN MAPPING')
console.log('='.repeat(100) + '\n')

// Try to find relevant columns
const dateColumns = headers.filter((h) =>
  /date|datee|jour|when|created|transaction/i.test(h)
)
const amountColumns = headers.filter((h) =>
  /montant|prix|price|amount|total|vente|sale|revenue/i.test(h)
)
const artistColumns = headers.filter((h) =>
  /artiste|artist|createur|creator|nom|name|auteur/i.test(h)
)
const buyerColumns = headers.filter((h) =>
  /acheteur|buyer|client|customer|pays|country|pays|lieu/i.test(h)
)

console.log('Potential Date columns:', dateColumns.length > 0 ? dateColumns : '❓ NONE FOUND')
console.log('Potential Amount columns:', amountColumns.length > 0 ? amountColumns : '❓ NONE FOUND')
console.log('Potential Artist columns:', artistColumns.length > 0 ? artistColumns : '❓ NONE FOUND')
console.log('Potential Buyer columns:', buyerColumns.length > 0 ? buyerColumns : '❓ NONE FOUND')

console.log('\n\n✅ READY FOR MANUAL MAPPING\n')

console.log('TO IMPORT DATA:')
console.log('1. Review the columns above')
console.log('2. Confirm which columns contain: date, amount, artist, buyer_country')
console.log('3. Map to Kucibok transaction schema')
console.log('4. Create import script with the mapping\n')

process.exit(0)
