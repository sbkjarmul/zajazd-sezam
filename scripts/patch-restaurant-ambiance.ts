/**
 * Patch restaurantPage.ambianceSection.title z łamaniami linii (zachowywane
 * przez whitespace-pre-line w komponencie RestaurantAmbiance).
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-restaurant-ambiance.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const pl = ['Wnętrze', 'oraz', 'atmosfera'].join('\n')
const en = ['Interior', 'and', 'atmosphere'].join('\n')

async function main() {
  await client.patch('restaurantPage').set({ 'ambianceSection.title': { pl, en } }).commit()
  console.log('✓ restaurantPage.ambianceSection.title zaktualizowany')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
