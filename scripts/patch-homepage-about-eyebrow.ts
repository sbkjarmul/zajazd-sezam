/**
 * One-off patch: homepage.aboutSection.eyebrow (PL + EN).
 * Eyebrow „O NAS" nad wprowadzeniem (Figma 930:40 / 934:9).
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-homepage-about-eyebrow.ts
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

const EYEBROW_PL = 'O nas'
const EYEBROW_EN = 'About us'

async function main() {
  console.log('Patch homepage.aboutSection.eyebrow…')
  const res = await client
    .patch('homepage')
    .set({
      'aboutSection.eyebrow': { pl: EYEBROW_PL, en: EYEBROW_EN },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
