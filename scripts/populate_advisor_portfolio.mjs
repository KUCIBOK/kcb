#!/usr/bin/env node

/**
 * Populate Advisor Portfolio with Sample Data
 * Creates realistic holdings for testing portfolio features
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wyrmpddlhldjzoiwbshj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'
)

console.log('\n' + '='.repeat(100))
console.log('🎨 POPULATING ADVISOR PORTFOLIO DATA')
console.log('='.repeat(100) + '\n')

// 1. Get advisor user
console.log('1️⃣  Finding advisor user...')
const { data: advisors, error: advisorErr } = await supabase
  .from('users')
  .select('id')
  .eq('role', 'advisor')
  .limit(1)

if (advisorErr || !advisors?.[0]) {
  console.error('❌ No advisor user found. Create one first!')
  process.exit(1)
}

const advisorId = advisors[0].id
console.log(`✅ Found advisor: ${advisorId}\n`)

// 2. Get artworks to add to portfolio
console.log('2️⃣  Loading artworks...')
const { data: artworks, error: artworksErr } = await supabase
  .from('artworks')
  .select('id, title, price, medium, artist')
  .eq('status', 'approved')
  .limit(30)

if (artworksErr || !artworks?.length) {
  console.error('❌ No artworks found!')
  process.exit(1)
}

console.log(`✅ Found ${artworks.length} artworks\n`)

// 3. Create portfolio holdings
console.log('3️⃣  Creating portfolio holdings...')

const holdings = artworks.slice(0, 15).map((artwork, idx) => {
  // Simulate purchase prices (with some variance)
  const purchasePrice = (artwork.price || 10000) * (0.8 + Math.random() * 0.4)
  const currentPrice = purchasePrice * (1 + (Math.random() - 0.3) * 0.3) // -30% to +30% gain/loss

  return {
    advisor_id: advisorId,
    artwork_id: artwork.id,
    purchase_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    purchase_price: Math.round(purchasePrice),
    quantity: 1,
    acquisition_cost: Math.round(purchasePrice),
    current_valuation: Math.round(currentPrice),
    notes: `Acquired: ${artwork.title}`,
  }
})

let created = 0
let failed = 0

for (const holding of holdings) {
  try {
    const { error } = await supabase.from('advisor_holdings').insert([holding])

    if (error) {
      if (!error.message.includes('duplicate')) {
        console.log(`❌ ${holding.notes}: ${error.message}`)
        failed++
      }
    } else {
      console.log(`✅ ${holding.notes}`)
      created++
    }
  } catch (err) {
    console.log(`❌ ${holding.notes}: ${err.message}`)
    failed++
  }
}

console.log(`\n✅ Created: ${created}/${holdings.length}`)
if (failed > 0) console.log(`⚠️  Failed: ${failed}`)

// 4. Create initial portfolio snapshot
console.log('\n4️⃣  Creating portfolio snapshot...')

const totalValue = holdings.reduce((sum, h) => sum + h.current_valuation, 0)
const totalCost = holdings.reduce((sum, h) => sum + h.acquisition_cost, 0)
const gains = totalValue - totalCost

const { error: snapshotErr } = await supabase.from('advisor_portfolio_snapshots').insert([
  {
    advisor_id: advisorId,
    snapshot_date: new Date().toISOString(),
    total_value: totalValue,
    total_cost: totalCost,
    realized_gains: 0,
    unrealized_gains: gains,
    yoy_growth: ((gains / totalCost) * 100).toFixed(1),
    holdings_count: created,
    diversity_score: Math.min(100, (created / 15) * 100),
    risk_score: Math.random() * 60 + 20, // 20-80
    metadata: {
      segments: 'Diversified',
      mediums: [...new Set(holdings.map((h) => h.notes))],
    },
  },
])

if (snapshotErr) {
  console.log(`⚠️  Snapshot error: ${snapshotErr.message}`)
} else {
  console.log('✅ Portfolio snapshot created')
}

// 5. Summary
console.log('\n' + '='.repeat(100))
console.log('📊 PORTFOLIO SUMMARY')
console.log('='.repeat(100) + '\n')
console.log(`📈 Total Value: €${totalValue.toLocaleString()}`)
console.log(`💰 Total Cost: €${totalCost.toLocaleString()}`)
console.log(`📈 Unrealized Gains: €${gains.toLocaleString()}`)
console.log(`📊 ROI: ${((gains / totalCost) * 100).toFixed(1)}%`)
console.log(`🎨 Holdings: ${created} artworks`)
console.log(`\n✅ Advisor portfolio populated!\n`)

process.exit(0)
