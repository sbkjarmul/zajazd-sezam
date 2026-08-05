/**
 * One-off patch: homepage.eventsBlock.description (PL + EN).
 * Skrocenie opisu do dlugosci z makiety mobilnej (Figma 936:58) — dluzsza
 * wersja schodzila zbyt gleboko na zdjecie tla i traca czytelnosc.
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-events-description-mobile.ts
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

const DESCRIPTION_PL =
  'W SEZAM wiemy, że organizacja wydarzeń często bywa stresująca. Dlatego my zajmujemy się wszystkim, a wy możecie się cieszyć każdą chwilą.'
const DESCRIPTION_EN =
  'At SEZAM we know event planning can be stressful. We handle it all, so you can enjoy every moment.'

async function main() {
  console.log('Patch homepage.eventsBlock.description…')
  const res = await client
    .patch('homepage')
    .set({
      'eventsBlock.description': { _type: 'localeText', pl: DESCRIPTION_PL, en: DESCRIPTION_EN },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
