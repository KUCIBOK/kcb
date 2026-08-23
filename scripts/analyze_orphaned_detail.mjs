#!/usr/bin/env node

/**
 * Detailed analysis of the 208 orphaned artworks
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyrmpddlhldjzoiwbshj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('\n📋 Analyzing 208 Orphaned Artworks in Detail\n')

// Get orphaned artworks
const { data: allArtworks } = await supabase
  .from('artworks')
  .select('id, kucibok_id, title, user_id, owner_id, status, category, created_at, visited')

const orphaned = allArtworks.filter((a) => !a.artist_id)

console.log(`Total: ${orphaned.length} artworks\n`)

// Get user info
const { data: users } = await supabase
  .from('users')
  .select('id, name, role')

const userMap = {}
users.forEach((u) => {
  userMap[u.id] = u
})

// ========================================================================
// Analysis 1: Group by status
// ========================================================================

console.log('='.repeat(60))
console.log('By Status')
console.log('='.repeat(60) + '\n')

const byStatus = {}
orphaned.forEach((art) => {
  const status = art.status || 'UNKNOWN'
  if (!byStatus[status]) byStatus[status] = []
  byStatus[status].push(art)
})

Object.entries(byStatus)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([status, arts]) => {
    console.log(`${status.padEnd(20)} : ${arts.length} artworks`)
  })

// ========================================================================
// Analysis 2: Group by owner/user
// ========================================================================

console.log('\n' + '='.repeat(60))
console.log('Top 20 Users with Orphaned Artworks')
console.log('='.repeat(60) + '\n')

const byUser = {}
orphaned.forEach((art) => {
  const userId = art.user_id || art.owner_id
  if (userId) {
    if (!byUser[userId]) {
      byUser[userId] = {
        user: userMap[userId],
        artworks: [],
      }
    }
    byUser[userId].artworks.push(art)
  }
})

Object.entries(byUser)
  .sort((a, b) => b[1].artworks.length - a[1].artworks.length)
  .slice(0, 20)
  .forEach(([userId, data]) => {
    const user = data.user || {}
    console.log(`\n${user.name?.padEnd(35) || '?'.padEnd(35)} (${user.role || '?'})`)
    console.log(`  ID: ${userId.substring(0, 12)}...`)
    console.log(`  Artworks: ${data.artworks.length}`)
    console.log(`  Sample: "${data.artworks[0].title.substring(0, 50)}"`)
  })

// ========================================================================
// Analysis 3: Sample orphaned artworks
// ========================================================================

console.log('\n\n' + '='.repeat(60))
console.log('Sample 10 Orphaned Artworks')
console.log('='.repeat(60) + '\n')

orphaned.slice(0, 10).forEach((art) => {
  const user = userMap[art.user_id || art.owner_id]
  console.log(`${art.kucibok_id.padEnd(15)} "${art.title.substring(0, 40).padEnd(40)}" [${art.status}]`)
  console.log(`  Owner: ${user?.name || '?'} (${user?.role || '?'})`)
  console.log()
})

console.log('\n✅ Analysis Complete!\n')

process.exit(0)
