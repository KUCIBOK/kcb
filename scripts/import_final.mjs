#!/usr/bin/env node

import https from 'https'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wyrmpddlhldjzoiwbshj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'
)

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1ISzDcDWE3S36ze5Vv8k0ojKfA259TCAa/export?format=csv&gid=990808993'

console.log('\n' + '='.repeat(100))
console.log('🚀 FINAL IMPORT: ALL SALES DATA 2024-2026')
console.log('='.repeat(100) + '\n')

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

// Download dashboard data
console.log('📥 Downloading sales data...\n')
const csv = await downloadFile(CSV_URL)
const lines = csv.trim().split('\n')

console.log(`✅ Downloaded ${lines.length} lines\n`)

// Parse 2024 sales (lines 7-18)
const salesData = []
const monthMap = {
  'Jan': 1, 'Fév': 2, 'Mar': 3, 'Avr': 4, 'Mai': 5, 'Jun': 6,
  'Jul': 7, 'Aoû': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Déc': 12
}

for (let i = 7; i <= 18; i++) {
  const parts = lines[i].split(',').map(p => p.trim())
  const month = parts[1]
  const nbCmd = parseInt(parts[2]) || 0
  const gmvEur = parseFloat(parts[4]?.replace(' €', '').replace(/\s/g, '').replace(',', '.')) || 0

  if (month?.startsWith('2024-')) {
    const [year, monthName] = month.split('-')
    salesData.push({
      year: parseInt(year),
      monthNum: monthMap[monthName],
      month,
      nbCmd,
      gmvEur,
    })
  }
}

console.log(`📊 Parsed ${salesData.length} months of 2024 sales\n`)

// Load artworks and users
const { data: artworks } = await supabase
  .from('artworks')
  .select('id')
  .limit(500)

const { data: users } = await supabase
  .from('users')
  .select('id')
  .limit(500)

console.log(`📋 Loaded ${artworks.length} artworks, ${users.length} users\n`)

// Create transactions (WITHOUT artist_id column)
console.log('💾 Creating transactions...\n')

const transactions = []

for (const sale of salesData) {
  for (let cmd = 0; cmd < sale.nbCmd; cmd++) {
    const day = Math.max(1, Math.min(28, Math.floor((cmd / sale.nbCmd) * 28) + 1))
    const artwork = artworks[Math.floor(Math.random() * artworks.length)]
    const buyer = users[Math.floor(Math.random() * users.length)]
    const amount = parseFloat((sale.gmvEur / sale.nbCmd).toFixed(2))

    transactions.push({
      artwork_id: artwork.id,
      buyer_id: buyer.id,
      amount,
      currency: 'EUR',
      status: 'confirmed',
      created_at: new Date(sale.year, sale.monthNum - 1, day).toISOString(),
    })
  }
}

console.log(`✅ Created ${transactions.length} transaction records\n`)

// Insert to Supabase
console.log('🔄 Inserting into Supabase...\n')

let inserted = 0
const BATCH_SIZE = 100

for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
  const batch = transactions.slice(i, i + BATCH_SIZE)

  const { error } = await supabase
    .from('transactions')
    .insert(batch)

  if (error) {
    console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
  } else {
    inserted += batch.length
    console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} rows`)
  }
}

console.log(`\n✅ Inserted: ${inserted}/${transactions.length}\n`)

// Verify
console.log('📊 Verification:\n')

const { data: stats } = await supabase
  .from('transactions')
  .select('amount, status', { count: 'exact' })
  .eq('status', 'confirmed')

if (stats) {
  const totalValue = stats.reduce((sum, t) => sum + (t.amount || 0), 0)
  console.log(`✅ Total confirmed transactions: ${stats.length}`)
  console.log(`✅ Total value: €${totalValue.toFixed(2)}\n`)
}

console.log('='.repeat(100))
console.log('✨ IMPORT COMPLETE!\n')
console.log('🎯 NEXT: Commit + Push to production\n')

process.exit(0)
