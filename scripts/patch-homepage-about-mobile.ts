/**
 * One-off patch: homepage.aboutSection.introMobile (PL + EN).
 * Krótszy wariant dla < md (Figma mobile).
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-homepage-about-mobile.ts
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

const INTRO_MOBILE_PL =
  'SEZAM to rodzinne miejsce z sercem od 2000 roku, gdzie tradycja łączy się z doświadczeniem.'

const INTRO_MOBILE_EN =
  'SEZAM is a family place with heart since 2000, where tradition meets experience.'

async function main() {
  console.log('Patch homepage.aboutSection.introMobile…')
  const res = await client
    .patch('homepage')
    .set({
      'aboutSection.introMobile': { pl: INTRO_MOBILE_PL, en: INTRO_MOBILE_EN },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
