#!/usr/bin/env node

/**
 * Check what tables exist and their schemas
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n📋 Checking Tables & Schemas\n')

const tables = ['artworks', 'artists', 'users', 'profiles', 'galleries']

for (const table of tables) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Table: ${table}`)
  console.log(`${'='.repeat(60)}`)

  // Try to get first row
  const { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact' })
    .limit(1)

  if (error) {
    console.log(`❌ Error: ${error.message}`)
    continue
  }

  console.log(`Row count: ${count}`)

  // Get columns if we have data
  if (data && data.length > 0) {
    console.log(`\nColumns:`)
    Object.keys(data[0]).forEach((col) => {
      const value = data[0][col]
      console.log(`  • ${col.padEnd(25)} = ${typeof value} (${String(value).substring(0, 30)})`)
    })
  } else {
    console.log('(No data in table)')
  }
}

console.log('\n')
process.exit(0)
