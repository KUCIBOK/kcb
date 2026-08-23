#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wyrmpddlhldjzoiwbshj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'
)

console.log('\n📋 Transactions Table Schema:\n')

const { data } = await supabase
  .from('transactions')
  .select('*')
  .limit(1)

if (data && data.length > 0) {
  const row = data[0]
  console.log('Columns:')
  Object.keys(row).forEach((col) => {
    const type = typeof row[col]
    console.log(`  • ${col.padEnd(30)} (${type})`)
  })
}

console.log('\n')
process.exit(0)
