/**
 * One-off patch: bistroPage.menuIntroBody (PL + EN).
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-bistro-intro.ts
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

const PL =
  'Oferujemy codziennie świeżą porcję garmażerki, wyrabianej z najwyższej jakości towarów.\n\nKorzystamy z produktów od lokalnych przedsiębiorców.\n\nSerwujemy ciepłe dania na miejscu i na wynos.'

const EN =
  'We serve a fresh portion of homemade specialties every day, made from premium ingredients.\n\nWe source our products from local producers.\n\nWe serve warm dishes for dine-in and takeout.'

async function main() {
  console.log('Patch bistroPage.menuIntroBody…')
  const res = await client
    .patch('bistroPage')
    .set({ menuIntroBody: { pl: PL, en: EN } })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
