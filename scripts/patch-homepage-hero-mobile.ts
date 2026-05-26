/**
 * One-off patch: homepage.hero.headlineMobile + subheadlineMobile (PL + EN).
 * Krótsze warianty dla < md (zgodne z Figma mobile).
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-homepage-hero-mobile.ts
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

const HEADLINE_MOBILE_PL = 'Wyjątkowe chwile w rodzinnej atmosferze'
const HEADLINE_MOBILE_EN = 'Unforgettable moments in a family atmosphere'

const SUBHEADLINE_MOBILE_PL =
  'Kompleksowa organizacja imprez okolicznościowych w Stalowej Woli.'
const SUBHEADLINE_MOBILE_EN =
  'End-to-end event hosting in Stalowa Wola.'

async function main() {
  console.log('Patch homepage.hero mobile variants…')
  const res = await client
    .patch('homepage')
    .set({
      'hero.headlineMobile': { pl: HEADLINE_MOBILE_PL, en: HEADLINE_MOBILE_EN },
      'hero.subheadlineMobile': { pl: SUBHEADLINE_MOBILE_PL, en: SUBHEADLINE_MOBILE_EN },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
