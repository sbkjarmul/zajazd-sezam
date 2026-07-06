/**
 * Wgrywa do Sanity assety bistro pobrane z Figmy (971:1214):
 *  - logo SEZAM (wordmark) → bistroPage.headerLogo
 *  - dwa zdjęcia hero (krokiety + pierogi) → bistroPage.heroImages
 *
 * Pliki źródłowe leżą obok skryptu (sezam-logo.png, raw1.png, raw3.png).
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/upload-bistro-assets.ts
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
  _key: assetId,
  asset: { _type: 'reference', _ref: assetId },
  alt: ls(pl, en),
})

const logoId = await uploadImage('sezam-logo.png', 'sezam-logo.png')
const hero1Id = await uploadImage('raw1.png', 'bistro-hero-krokiety.png')
const hero2Id = await uploadImage('raw3.png', 'bistro-hero-pierogi.png')

await client
  .patch('bistroPage')
  .set({
    headerLogo: {
      _type: 'imageWithAlt',
      asset: { _type: 'reference', _ref: logoId },
      alt: ls('Zajazd Sezam', 'Zajazd Sezam'),
    },
    heroImages: [
      imageWithAlt(hero1Id, 'Chrupiące krokiety z bistro Sezam', 'Crispy croquettes from Sezam bistro'),
      imageWithAlt(hero2Id, 'Pierogi ze skwarkami z bistro Sezam', 'Dumplings with cracklings from Sezam bistro'),
    ],
  })
  .commit()

console.log('✓ bistroPage.headerLogo + heroImages ustawione')
