/**
 * Ustawia restaurantPage.reservationSection.image (Figma 967:203 — kwadratowe
 * zdjęcie obok telefonu). Reużywa istniejący asset wnętrza (ten sam co ambiance),
 * jako niezależne pole — do podmiany w Studio na dedykowane ujęcie sali.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-restaurant-reservation-image.ts
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
  apiVersion: '2026-05-16',
  token,
  useCdn: false,
})

async function main() {
  const doc = await client.getDocument('restaurantPage')
  const assetRef = doc?.ambianceSection?.image?.asset?._ref
  if (!assetRef) throw new Error('Brak ambianceSection.image do reużycia')

  await client
    .patch('restaurantPage')
    .set({
      'reservationSection.image': {
        _type: 'imageWithAlt',
        asset: { _type: 'reference', _ref: assetRef },
        alt: {
          _type: 'localeString',
          pl: 'Wnętrze Restauracji Sezam w Stalowej Woli',
          en: 'Interior of Sezam Restaurant in Stalowa Wola',
        },
      },
    })
    .commit()
  console.log('✓ reservationSection.image ustawiony')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
