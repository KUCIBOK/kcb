#!/usr/bin/env node

import https from 'https'

const SHEET_ID = '1ISzDcDWE3S36ze5Vv8k0ojKfA259TCAa'
const GID = '990808993'
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

console.log('\n📊 Fetching VENTES & LOGISTIQUE data...\n')

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

try {
  const csv = await downloadFile(CSV_URL)
  const lines = csv.trim().split('\n')
  
  console.log(`✅ Downloaded ${csv.length} bytes, ${lines.length} lines\n`)
  
  // Simple parse
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  console.log(`📋 Columns (${headers.length}):`)
  headers.forEach((h, i) => {
    console.log(`  ${i + 1}. "${h}"`)
  })
  
  console.log(`\n📊 Data rows: ${lines.length - 1}\n`)
  
  // Show first 5 data rows
  console.log('Sample data:')
  console.log('─'.repeat(100))
  for (let i = 1; i < Math.min(6, lines.length); i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    console.log(`\nRow ${i}:`)
    headers.forEach((h, j) => {
      console.log(`  ${h}: ${values[j] || '(empty)'}`)
    })
  }
  
  console.log('\n✅ Ready to import!\n')
} catch (err) {
  console.error('❌ Error:', err.message)
  process.exit(1)
}
