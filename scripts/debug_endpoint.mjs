#!/usr/bin/env node

/**
 * Debug: Check why Market Intelligence returns empty data
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wyrmpddlhldjzoiwbshj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'
)

console.log('\n' + '='.repeat(100))
console.log('🔍 DEBUG: Why is Market Intelligence empty?')
console.log('='.repeat(100) + '\n')

// 1. Total count
const { count: totalCount } = await supabase
  .from('transactions')
  .select('*', { count: 'exact', head: true })

console.log(`📊 Total transactions: ${totalCount}`)

// 2. Confirmed only
const { data: confirmed, count: confirmedCount } = await supabase
  .from('transactions')
  .select('*', { count: 'exact' })
  .eq('status', 'confirmed')
  .limit(5)

console.log(`✅ Confirmed transactions: ${confirmedCount}`)
if (confirmed?.length > 0) {
  console.log(`   Sample ID: ${confirmed[0].id}`)
  console.log(`   Sample amount: €${confirmed[0].amount}`)
  console.log(`   Sample date: ${confirmed[0].created_at}`)
}

// 3. Last 30 days
const dateFilter = new Date()
dateFilter.setDate(dateFilter.getDate() - 30)

const { data: recent, count: recentCount } = await supabase
  .from('transactions')
  .select('id, amount, status, created_at', { count: 'exact' })
  .eq('status', 'confirmed')
  .gte('created_at', dateFilter.toISOString())
  .limit(5)

console.log(`\n📅 Confirmed (last 30 days): ${recentCount}`)
console.log(`   Filter date: ${dateFilter.toISOString()}`)
if (recent?.length > 0) {
  console.log(`   Most recent: ${recent[0].created_at}`)
  const sum = recent.reduce((a, b) => a + (b.amount || 0), 0)
  console.log(`   Sum: €${sum}`)
}

// 4. Check artworks
const { count: artworkCount } = await supabase
  .from('artworks')
  .select('*', { count: 'exact', head: true })

console.log(`\n🎨 Total artworks: ${artworkCount}`)

// 5. Test direct query like module does
console.log(`\n⚙️  Testing module's direct query logic:\n`)

const amounts = []
for (const tx of recent || []) {
  amounts.push(tx.amount)
}

if (amounts.length > 0) {
  amounts.sort((a, b) => a - b)
  const median = amounts[Math.floor(amounts.length / 2)]
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length
  console.log(`   Median: €${median}`)
  console.log(`   Average: €${avg.toFixed(2)}`)
  console.log(`   Sample size: ${amounts.length}`)
  console.log(`   ✅ Module SHOULD return data`)
} else {
  console.log(`   ❌ NO DATA FOUND - module will return null`)
}

console.log('\n' + '='.repeat(100) + '\n')

process.exit(0)
