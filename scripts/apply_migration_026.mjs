#!/usr/bin/env node

/**
 * Apply Migration 026 directly via Supabase SQL
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wyrmpddlhldjzoiwbshj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'
)

console.log('\n' + '='.repeat(100))
console.log('🔧 APPLYING MIGRATION 026: Enrich Artists Table')
console.log('='.repeat(100) + '\n')

// Individual statements to add columns one by one
const statements = [
  {
    name: 'Add tier column',
    sql: `ALTER TABLE artists ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Tier 3 — Incubation'`
  },
  {
    name: 'Add years_experience column',
    sql: `ALTER TABLE artists ADD COLUMN IF NOT EXISTS years_experience INTEGER`
  },
  {
    name: 'Add disciplines column',
    sql: `ALTER TABLE artists ADD COLUMN IF NOT EXISTS disciplines TEXT[]`
  },
  {
    name: 'Add artistic_statement column',
    sql: `ALTER TABLE artists ADD COLUMN IF NOT EXISTS artistic_statement TEXT`
  },
  {
    name: 'Add market_presence column',
    sql: `ALTER TABLE artists ADD COLUMN IF NOT EXISTS market_presence TEXT`
  },
  {
    name: 'Add location column',
    sql: `ALTER TABLE artists ADD COLUMN IF NOT EXISTS location TEXT`
  }
]

let success = 0
let failed = 0

console.log('Executing column additions...\n')

for (const stmt of statements) {
  try {
    // Use raw query via Supabase - this might not work for DDL
    // But we'll try the REST API endpoint for raw queries
    console.log(`⏳ ${stmt.name}...`)

    // Unfortunately, Supabase JS client doesn't support raw DDL easily
    // We'll note this and suggest manual application
    console.log(`   ⚠️  (Will apply manually in dashboard)`)
  } catch (err) {
    failed++
  }
}

console.log('\n' + '='.repeat(100))
console.log('⚠️  MANUAL STEPS REQUIRED')
console.log('='.repeat(100) + '\n')

console.log('Go to Supabase Dashboard SQL Editor and execute this SQL:\n')
console.log('---')
console.log(`
ALTER TABLE artists ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Tier 3 — Incubation';
ALTER TABLE artists ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS disciplines TEXT[];
ALTER TABLE artists ADD COLUMN IF NOT EXISTS artistic_statement TEXT;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS market_presence TEXT;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS location TEXT;
CREATE INDEX IF NOT EXISTS idx_artists_tier ON artists(tier);
CREATE INDEX IF NOT EXISTS idx_artists_country ON artists(country);
`)
console.log('---\n')

console.log('Then once applied, run: node scripts/update_artists_data.mjs\n')

process.exit(1)
