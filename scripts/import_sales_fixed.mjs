#!/usr/bin/env node

/**
 * Import Sales Data - FIXED VERSION
 */

import https from 'https'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1ISzDcDWE3S36ze5Vv8k0ojKfA259TCAa/export?format=csv&gid=990808993'

console.log('\n🚀 IMPORTING SALES DATA 2024-2025 (FIXED)\n')

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

// Download
const csv = await downloadFile(CSV_URL)
const lines = csv.trim().split('\n')

console.log(`📥 Downloaded ${lines.length} lines\n`)

// Parse 2024 sales (lines 7-18, columns 1-6)
const salesData = []

for (let i = 7; i <= 18; i++) {
  const parts = lines[i].split(',').map(p => p.trim())

  const month = parts[1] // 2024-Jan
  const nbCmd = parseInt(parts[2]) || 0
  const gmvEur = parseFloat(parts[4]?.replace(' €', '').replace(/\s/g, '').replace(',', '.')) || 0
  const caKucibok = parseFloat(parts[6]?.replace(' €', '').replace(/\s/g, '').replace(',', '.')) || 0

  if (month.startsWith('2024-')) {
    salesData.push({ month, nbCmd, gmvEur, caKucibok })
  }
}

console.log(`📊 Parsed ${salesData.length} months of sales\n`)

console.log('Sales Summary:')
console.log('─'.repeat(80))
salesData.forEach((s) => {
  console.log(`${s.month} | Cmds: ${s.nbCmd} | GMV: €${s.gmvEur.toFixed(2)} | CA: €${s.caKucibok.toFixed(2)}`)
})

const totalGmv = salesData.reduce((sum, s) => sum + s.gmvEur, 0)
const totalCmds = salesData.reduce((sum, s) => sum + s.nbCmd, 0)
console.log(`${'─'.repeat(80)}\nTOTAL: ${totalCmds} cmds | €${totalGmv.toFixed(2)}`)

// Load artworks and users
console.log('\n📋 Loading artworks and users...\n')

const { data: artworks } = await supabase
  .from('artworks')
  .select('id, artist_id')
  .limit(500)

const { data: users } = await supabase
  .from('users')
  .select('id')
  .limit(500)

console.log(`✅ Loaded ${artworks.length} artworks, ${users.length} users\n`)

if (artworks.length === 0 || users.length === 0) {
  console.error('❌ Not enough data')
  process.exit(1)
}

// Create transactions
console.log('💾 Creating transactions...\n')

const transactions = []

for (const sale of salesData) {
  const [year, month] = sale.month.split('-')

  // Distribute commandes across the month
  for (let cmd = 0; cmd < sale.nbCmd; cmd++) {
    const day = Math.max(1, Math.floor((cmd / sale.nbCmd) * 28) + 1)

    const artwork = artworks[Math.floor(Math.random() * artworks.length)]
    const buyer = users[Math.floor(Math.random() * users.length)]
    const amount = parseFloat((sale.gmvEur / sale.nbCmd).toFixed(2))

    const createdAt = new Date(parseInt(year), monthMap[month] - 1, day).toISOString()

    transactions.push({
      artwork_id: artwork.id,
      buyer_id: buyer.id,
      artist_id: artwork.artist_id || null,
      amount,
      currency: 'EUR',
      status: 'confirmed',
      created_at: createdAt,
    })
  }
}

console.log(`✅ Created ${transactions.length} transaction records\n`)

// Insert
console.log('🔄 Inserting into database...\n')

let inserted = 0
const BATCH_SIZE = 100

for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
  const batch = transactions.slice(i, i + BATCH_SIZE)

  const { error, data } = await supabase
    .from('transactions')
    .insert(batch)

  if (error) {
    console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
  } else {
    inserted += batch.length
    console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} rows`)
  }
}

console.log(`\n✅ Total inserted: ${inserted}/${transactions.length}\n`)

// Verify
console.log('📊 Verification:')
const { data: confirmed } = await supabase
  .from('transactions')
  .select('amount, currency, status', { count: 'exact' })
  .eq('status', 'confirmed')

if (confirmed) {
  const totalValue = confirmed.reduce((sum, t) => sum + (t.amount || 0), 0)
  console.log(`Confirmed transactions: ${confirmed.length}`)
  console.log(`Total value: €${totalValue.toFixed(2)}`)
}

console.log('\n✨ IMPORT COMPLETE!\n')

process.exit(0)
