#!/usr/bin/env node

/**
 * Apply Migration 025 (Fix Analytics RPC Bugs) directly to Supabase
 */

import fs from 'fs'
import https from 'https'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

console.log('\n🚀 Applying Migration 025: Fix Analytics RPC Bugs\n')

// Read migration file
const migrationPath = '/c/Users/Moctar Sidibe/Downloads/Kucibok/Kucibok/supabase/migrations/025_fix_analytics_rpc_bugs.sql'
const sql = fs.readFileSync(migrationPath, 'utf-8')

console.log(`📄 Read migration file (${sql.length} bytes)\n`)

// Split into statements (simple split by ;)
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'))

console.log(`📝 Found ${statements.length} SQL statements\n`)

// Execute via REST API
console.log('🔄 Executing statements...\n')

let executed = 0
for (const statement of statements) {
  const query = statement + ';'

  const postData = JSON.stringify({
    query,
  })

  const options = {
    hostname: 'wyrmpddlhldjzoiwbshj.supabase.co',
    port: 443,
    path: '/rest/v1/rpc/execute_sql',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          resolve({ status: res.statusCode, data })
        })
      })
      req.on('error', reject)
      req.write(postData)
      req.end()
    })

    if (response.status === 200) {
      executed++
      console.log(`✅ Statement ${executed}/${statements.length}`)
    } else {
      console.log(`⚠️  Statement ${executed + 1}: Status ${response.status}`)
      try {
        const parsed = JSON.parse(response.data)
        console.log(`   Error: ${parsed.message || response.data}`)
      } catch (e) {
        console.log(`   Response: ${response.data.substring(0, 100)}`)
      }
    }
  } catch (err) {
    console.error(`❌ Error executing statement: ${err.message}`)
  }
}

console.log(`\n✅ Executed ${executed}/${statements.length} statements\n`)

console.log('='.repeat(100))
console.log('✨ Migration 025 Applied!')
console.log('='.repeat(100) + '\n')

process.exit(0)
