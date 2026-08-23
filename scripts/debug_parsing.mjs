#!/usr/bin/env node

import https from 'https'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1ISzDcDWE3S36ze5Vv8k0ojKfA259TCAa/export?format=csv&gid=990808993'

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

const csv = await downloadFile(CSV_URL)
const lines = csv.trim().split('\n')

console.log('All lines:')
lines.forEach((line, i) => {
  console.log(`${i}: ${line.substring(0, 100)}`)
})

console.log('\n\nSearching for patterns:')
lines.forEach((line, i) => {
  if (line.includes('2024-')) {
    console.log(`Line ${i}: ${line}`)
  }
})
