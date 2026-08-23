#!/usr/bin/env node

/**
 * Import Sales Data from Google Sheets to Supabase Transactions
 * Data: VENTES & LOGISTIQUE — ANALYSE 2024–2025
 *
 * Strategy:
 * 1. Parse monthly sales data from Google Sheets
 * 2. Create transactions for each month (distributed across days)
 * 3. Assign to random existing artworks/buyers
 * 4. Verify import with analytics
 */

import https from 'https'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1ISzDcDWE3S36ze5Vv8k0ojKfA259TCAa/export?format=csv&gid=990808993'

console.log('\n🚀 IMPORTING SALES DATA 2024-2025\n')

// ========================================================================
// STEP 1: Download CSV
// ========================================================================

console.log('📥 Downloading from Google Sheets...\n')

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const makeRequest = (urlToFetch) => {
      https.get(urlToFetch, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          makeRequest(response.headers.location)
          return
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`))
          return
        }
        let data = ''
        response.on('data', (chunk) => { data += chunk })
        response.on('end', () => { resolve(data) })
      }).on('error', reject)
    }
    makeRequest(url)
  })
}

const csv = await downloadFile(CSV_URL)
console.log(`✅ Downloaded ${csv.length} bytes\n`)

// ========================================================================
// STEP 2: Parse Sales Data
// ========================================================================

console.log('📊 Parsing sales data...\n')

const lines = csv.trim().split('\n')

// Find "A. JOURNAL DE VENTE 2024" section
let sectionAStart = -1
let sectionBStart = -1

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('A. JOURNAL DE VENTE 2024')) {
    sectionAStart = i + 1 // Header line
  }
  if (lines[i].includes('B. LOGISTIQUE 2025')) {
    sectionBStart = i + 1
  }
}

console.log(`Section A (2024 sales): line ${sectionAStart}`)
console.log(`Section B (2025 logistics): line ${sectionBStart}\n`)

// Parse Section A: VENTES 2024
const salesData = []

for (let i = sectionAStart + 1; i < sectionBStart - 2; i++) {
  const line = lines[i]
  if (!line || line.trim() === '') continue
  if (line.includes('TOTAL 2024')) break

  const parts = line.split(',').map(p => p.trim())
  if (parts[0] && parts[0].startsWith('2024-')) {
    const month = parts[0]
    const nbCmd = parseInt(parts[1]) || 0
    const gmvXof = parts[2]
    const gmvEur = parseFloat(parts[3]?.replace(' €', '').replace(',', '.')) || 0
    const panier = parseFloat(parts[4]?.replace(' €', '').replace(',', '.')) || 0
    const caKucibok = parseFloat(parts[5]?.replace(' €', '').replace(',', '.')) || 0

    salesData.push({
      month,
      nbCmd,
      gmvEur,
      panier,
      caKucibok,
    })
  }
}

console.log(`✅ Parsed ${salesData.length} months of 2024 sales data\n`)

console.log('Sales Summary:')
console.log('─'.repeat(80))
salesData.forEach((sale) => {
  console.log(
    `${sale.month} : ${sale.nbCmd.toString().padEnd(3)} cmds | ${sale.gmvEur.toFixed(2).padEnd(10)} € | CA: ${sale.caKucibok.toFixed(2)} €`
  )
})

const totalGmv = salesData.reduce((sum, s) => sum + s.gmvEur, 0)
const totalCa = salesData.reduce((sum, s) => sum + s.caKucibok, 0)
console.log(`${'TOTAL 2024'.padEnd(7)} : ${salesData.reduce((sum, s) => sum + s.nbCmd, 0).toString().padEnd(3)} cmds | ${totalGmv.toFixed(2).padEnd(10)} € | CA: ${totalCa.toFixed(2)} €`)

// ========================================================================
// STEP 3: Get existing artworks and buyers
// ========================================================================

console.log('\n📋 Loading artworks and buyers...\n')

const { data: artworks } = await supabase
  .from('artworks')
  .select('id, kucibok_id, artist_id')
  .limit(1000)

const { data: users } = await supabase
  .from('users')
  .select('id, name, role')

console.log(`✅ Loaded ${artworks.length} artworks`)
console.log(`✅ Loaded ${users.length} users\n`)

if (artworks.length === 0 || users.length === 0) {
  console.error('❌ Not enough data to create transactions')
  process.exit(1)
}

// ========================================================================
// STEP 4: Create Transactions
// ========================================================================

console.log('💾 Creating transactions...\n')

const transactions = []
let txId = 0

for (const sale of salesData) {
  const [year, month] = sale.month.split('-')
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate()

  // Distribute daily transactions
  const txPerDay = Math.max(1, Math.floor(sale.nbCmd / daysInMonth))
  const amountPerTx = sale.gmvEur / sale.nbCmd

  for (let day = 1; day <= daysInMonth && txId < sale.nbCmd; day++) {
    // Random artwork and buyer
    const artwork = artworks[Math.floor(Math.random() * artworks.length)]
    const buyer = users[Math.floor(Math.random() * users.length)]

    const createdAt = new Date(parseInt(year), parseInt(month) - 1, day)

    transactions.push({
      id: `tx-${year}-${month}-${String(day).padStart(2, '0')}-${String(txId % 100).padStart(2, '0')}`,
      artwork_id: artwork.id,
      buyer_id: buyer.id,
      artist_id: artwork.artist_id,
      amount: parseFloat(amountPerTx.toFixed(2)),
      currency: 'EUR',
      status: 'confirmed',
      created_at: createdAt.toISOString(),
    })

    txId++
  }
}

console.log(`✅ Created ${transactions.length} transaction records\n`)

// ========================================================================
// STEP 5: Insert into Supabase
// ========================================================================

console.log('🔄 Inserting into database...\n')

let inserted = 0
const BATCH_SIZE = 50

for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
  const batch = transactions.slice(i, i + BATCH_SIZE)

  const { error } = await supabase
    .from('transactions')
    .insert(batch)

  if (error) {
    console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
  } else {
    inserted += batch.length
    console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} rows inserted`)
  }
}

console.log(`\n✅ Total inserted: ${inserted}/${transactions.length}\n`)

// ========================================================================
// STEP 6: Verify with Analytics
// ========================================================================

console.log('📊 Verifying with Analytics...\n')

const { data: stats } = await supabase
  .from('transactions')
  .select('amount, currency, status', { count: 'exact' })
  .eq('status', 'confirmed')

if (stats) {
  const totalAmount = stats.reduce((sum, t) => sum + (t.amount || 0), 0)
  console.log(`Total confirmed transactions: ${stats.length}`)
  console.log(`Total value: €${totalAmount.toFixed(2)}`)
}

console.log('\n✨ IMPORT COMPLETE!\n')

process.exit(0)
