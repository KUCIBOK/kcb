#!/usr/bin/env node

/**
 * Check artworks table schema
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n🔍 Checking artworks table schema...\n')

// Fetch first row to see what columns exist
const { data, error } = await supabase.from('artworks').select('*').limit(1)

if (error) {
  console.error('❌ Error:', error)
  process.exit(1)
}

if (data && data.length > 0) {
  console.log('✅ Columns in artworks table:')
  const row = data[0]
  Object.keys(row).forEach((col) => {
    const value = row[col]
    const type = typeof value
    const preview = String(value).substring(0, 50)
    console.log(`  • ${col.padEnd(25)} (${type.padEnd(10)}) = ${preview}`)
  })
} else {
  console.log('ℹ️  Table is empty, checking via introspection...')

  // Try alternate query
  const { data: info, error: err2 } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type')
    .eq('table_name', 'artworks')

  if (err2) {
    console.log('Cannot access information_schema')
  } else if (info) {
    console.log('Columns:')
    info.forEach((col) => {
      console.log(`  • ${col.column_name.padEnd(25)} ${col.data_type}`)
    })
  }
}

console.log('\nDone!\n')
