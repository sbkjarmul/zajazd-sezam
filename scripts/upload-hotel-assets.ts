/**
 * Wgrywa do Sanity assety sekcji Hotel na stronie głównej (Figma 930:86):
 *  - duże zdjęcie pokoju (łóżko)   → homepage.hotelBlock.mainImage
 *  - małe zdjęcie (żyrandol/wnętrze) → homepage.hotelBlock.sideImage
 *
 * Pliki źródłowe leżą obok skryptu (hotel-bed.png, hotel-chandelier.png).
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/upload-hotel-assets.ts
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
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

const here = dirname(fileURLToPath(import.meta.url))

const ls = (pl: string, en: string) => ({ _type: 'localeString', pl, en })

async function uploadImage(file: string, filename: string) {
  const buffer = readFileSync(join(here, file))
  const asset = await client.assets.upload('image', buffer, { filename })
  const d = asset.metadata?.dimensions
  console.log(`✓ asset ${filename}:`, asset._id, `${d?.width}×${d?.height}`)
  return asset._id
}

const imageWithAlt = (assetId: string, pl: string, en: string) => ({
  _type: 'imageWithAlt',
  asset: { _type: 'reference', _ref: assetId },
  alt: ls(pl, en),
})

const mainId = await uploadImage('hotel-bed.png', 'hotel-pokoj-lozko.png')
const sideId = await uploadImage('hotel-chandelier.png', 'hotel-wnetrze.png')

await client
  .patch('homepage')
  .set({
    'hotelBlock.mainImage': imageWithAlt(
      mainId,
      'Przytulny pokój w Hotelu Sezam z podwójnym łóżkiem',
      'Cozy room at Hotel Sezam with a double bed',
    ),
    'hotelBlock.sideImage': imageWithAlt(
      sideId,
      'Eleganckie wnętrze Hotelu Sezam',
      'Elegant interior of Hotel Sezam',
    ),
  })
  .commit()

console.log('✓ homepage.hotelBlock.mainImage + sideImage ustawione')
