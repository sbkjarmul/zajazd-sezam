/**
 * Wgrywa zdjęcie hero budynku (public/images/hero-sezam.jpg) do Sanity jako
 * asset i podpina je pod homepage.hero.image (z altem PL/EN).
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/upload-homepage-hero.ts
 */

import { readFileSync } from 'node:fs'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-16',
  token,
  useCdn: false,
})

async function main() {
  const buffer = readFileSync('public/images/hero-sezam.jpg')
  const asset = await client.assets.upload('image', buffer, {
    filename: 'hero-sezam.jpg',
  })
  console.log('✓ asset wgrany:', asset._id, `${asset.metadata?.dimensions?.width}×${asset.metadata?.dimensions?.height}`)

  await client
    .patch('homepage')
    .set({
      'hero.image': {
        _type: 'imageWithAlt',
        asset: { _type: 'reference', _ref: asset._id },
        alt: {
          _type: 'localeString',
          pl: 'Zajazd Sezam — budynek restauracji i hotelu w Stalowej Woli',
          en: 'Sezam Inn — restaurant and hotel building in Stalowa Wola',
        },
      },
    })
    .commit()
  console.log('✓ homepage.hero.image ustawiony')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
