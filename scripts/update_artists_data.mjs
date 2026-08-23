#!/usr/bin/env node

/**
 * Update Artists Table with Complete Information
 * Fills in tier, years_experience, disciplines, artistic_statement
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wyrmpddlhldjzoiwbshj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs'
)

console.log('\n' + '='.repeat(100))
console.log('🎨 UPDATING ARTISTS TABLE WITH COMPLETE DATA')
console.log('='.repeat(100) + '\n')

// Artist data from the reference sheet
const artistsData = [
  {
    name: 'Cheickh Sallah Diebkilé',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture', 'Sculpture'],
    years_experience: 43,
    tier: 'Tier 1 — Vitrine int.',
    artistic_statement: 'Technique unique au doigt — silhouettes fantomatiques'
  },
  {
    name: 'Dioman Mamadou Doudou Diallo',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture'],
    years_experience: 40,
    tier: 'Tier 1 — Vitrine int.',
    artistic_statement: 'Autodidacte, influence Basquiat, symbole ampoule'
  },
  {
    name: 'Latifa Pouye',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture intuitive'],
    years_experience: 32,
    tier: 'Tier 1 — Vitrine int.',
    artistic_statement: 'Née 1975 Dakar, pratique depuis 2003, ateliers communautaires'
  },
  {
    name: 'Abel Toh Bi',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture'],
    years_experience: 29,
    tier: 'Tier 1 — Vitrine int.',
    artistic_statement: 'Identité, société, émotions humaines'
  },
  {
    name: 'Gaetan Rapaccioli',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture', 'Sculpture'],
    years_experience: 14,
    tier: 'Tier 1 — Vitrine int.',
    artistic_statement: 'Vision contemporaine engagée'
  },
  {
    name: 'Jean Baptiste Aloyse Ndao',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture', 'Street art', 'Design'],
    years_experience: 10,
    tier: 'Tier 1 — Vitrine int.',
    artistic_statement: 'Multidisciplinaire — toiles, murs, vêtements'
  },
  {
    name: 'TOURE KAFFOUO JUNIOR',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture'],
    years_experience: 7,
    tier: 'Tier 1 — Vitrine int.',
    artistic_statement: 'Art ivoirien contemporain'
  },
  {
    name: 'Jizréel Diabaté',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Arts plastiques'],
    years_experience: 6,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Exploration identitaire, médiums variés'
  },
  {
    name: 'Bacary Gueye',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture'],
    years_experience: 6,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'BAK\'ART — âme africaine entre tradition et modernité'
  },
  {
    name: 'Mouhamed Loum',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture'],
    years_experience: 6,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'LOUM\'ART — mémoire, combat, lumière'
  },
  {
    name: 'Koua Houphouet Marie Angela',
    country: '🇺🇸 États-Unis',
    disciplines: ['Peinture'],
    years_experience: 6,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Diaspora CIV/USA — projet \'L\'Envers du Décor\''
  },
  {
    name: 'MARTIAL KOUASSI KOUAKOU',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture'],
    years_experience: 5,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Vision africaine contemporaine'
  },
  {
    name: 'Frederic N\'DA',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture'],
    years_experience: 5,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Créateur ivoirien émergent'
  },
  {
    name: 'Francel DAGBÉTO',
    country: '🇧🇯 Bénin',
    disciplines: ['Arts plastiques'],
    years_experience: 5,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Voix béninoise émergente'
  },
  {
    name: 'Anagbo Do Rock',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture'],
    years_experience: 4,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Exploration des formes contemporaines'
  },
  {
    name: 'D_nond (Emmanuella)',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture', 'Numérique'],
    years_experience: 4,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'INSAAC — addictions numériques, société hyperconnectée'
  },
  {
    name: 'Sinzé Axel Angenor Bamouin',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Arts plastiques'],
    years_experience: 4,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Innovation + traditions africaines'
  },
  {
    name: 'Goumbo Diagne',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture'],
    years_experience: 3,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Compositions vibrantes, identité culturelle'
  },
  {
    name: 'Chabanel Zoumenou',
    country: '🇧🇯 Bénin',
    disciplines: ['Photographie', 'Performance'],
    years_experience: 3,
    tier: 'Tier 2 — Montée en puissance',
    artistic_statement: 'Zoomstreet Culture — Afrique créative et connectée'
  },
  {
    name: 'YOUAN BI PIERRE AIMÉ',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Arts plastiques'],
    years_experience: 3,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Exploration créative contemporaine'
  },
  {
    name: 'Kouame Ndri Fulgence',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture'],
    years_experience: 3,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Approche contemporaine ivoirienne'
  },
  {
    name: 'Kissa Coulibaly',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture'],
    years_experience: 3,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'De Katiola — personnages en ascension'
  },
  {
    name: 'Arabi TRAORE',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture'],
    years_experience: 2,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Née 2000, réchauffement climatique, impressionnisme & futurisme'
  },
  {
    name: 'Bamba Djakaridja arts',
    country: '🇦🇩 Andorre',
    disciplines: ['Arts plastiques'],
    years_experience: 2,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Diaspora africaine en Europe'
  },
  {
    name: 'Okou OBODOU Aimée Marie fidèle',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Peinture'],
    years_experience: 2,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Autodidacte, naïveté et abstraction'
  },
  {
    name: 'Koffi prodige (Œil d\'Horus)',
    country: '🇨🇮 Côte d\'Ivoire',
    disciplines: ['Photographie'],
    years_experience: 2,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Lumière, silence, émotion — éveil spirituel'
  },
  {
    name: 'Thioye Nalla',
    country: '🇸🇳 Sénégal',
    disciplines: ['Arts plastiques'],
    years_experience: 1,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Créateur sénégalais émergent'
  },
  {
    name: 'Ibrahima samate',
    country: '🇸🇳 Sénégal',
    disciplines: ['Arts plastiques'],
    years_experience: 1,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Créateur émergent sénégalais'
  },
  {
    name: 'Maurice Modou Tine',
    country: '🇸🇳 Sénégal',
    disciplines: ['Peinture'],
    years_experience: 1,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Alias Momoti — spiritualité, identité, Rastafari'
  },
  {
    name: 'Cheikh Saadbouh Seck',
    country: '🇸🇳 Sénégal',
    disciplines: ['Arts plastiques'],
    years_experience: 1,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Créateur sénégalais contemporain'
  },
  {
    name: 'Kalissa Mamayimbé kir',
    country: '🇸🇳 Sénégal',
    disciplines: ['Photographie'],
    years_experience: 1,
    tier: 'Tier 3 — Incubation',
    artistic_statement: 'Lauréate Oscars Photo Africaine Lomé'
  }
]

console.log(`📊 Updating ${artistsData.length} artists...\n`)

let updated = 0
let failed = 0

for (const artistData of artistsData) {
  try {
    // Find artist by name
    const { data: artist, error: fetchError } = await supabase
      .from('artists')
      .select('id')
      .eq('name', artistData.name)
      .single()

    if (fetchError || !artist) {
      console.log(`⚠️  ${artistData.name}: Not found`)
      failed++
      continue
    }

    // Update artist record
    const { error: updateError } = await supabase
      .from('artists')
      .update({
        tier: artistData.tier,
        years_experience: artistData.years_experience,
        disciplines: artistData.disciplines,
        artistic_statement: artistData.artistic_statement,
        market_presence: 'ABAC.art', // Default for now
      })
      .eq('id', artist.id)

    if (updateError) {
      console.log(`❌ ${artistData.name}: ${updateError.message}`)
      failed++
    } else {
      console.log(`✅ ${artistData.name}`)
      updated++
    }
  } catch (err) {
    console.log(`❌ ${artistData.name}: ${err.message}`)
    failed++
  }
}

console.log(`\n` + '='.repeat(100))
console.log(`✨ UPDATE COMPLETE`)
console.log('='.repeat(100))
console.log(`✅ Updated: ${updated}/${artistsData.length}`)
console.log(`❌ Failed: ${failed}/${artistsData.length}\n`)

process.exit(failed > 0 ? 1 : 0)
