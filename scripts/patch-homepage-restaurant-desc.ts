/**
 * One-off patch: homepage.restaurantBlock.description (PL + EN).
 * Nowy, krótszy tekst do przeprojektowanej sekcji restauracji.
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-homepage-restaurant-desc.ts
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

const DESC_PL = 'Współpracujemy z lokalnymi dostawcami, stawiamy na jakość i świeżość.'
const DESC_EN = 'We work with local suppliers, focused on quality and freshness.'

async function main() {
  console.log('Patch homepage.restaurantBlock.description…')
  const res = await client
    .patch('homepage')
    .set({
      'restaurantBlock.description': { pl: DESC_PL, en: DESC_EN },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
