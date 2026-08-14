/**
 * Nieniszczaca aktualizacja siteSettings o dane SEO lokalnego, ktorych brakowalo:
 * geo (lat/long), googleBusinessProfileUrl oraz defaultSeo (fallback meta).
 * W przeciwienstwie do seed-site-settings.ts (createOrReplace) NIE nadpisuje calego
 * dokumentu — patchuje tylko wskazane pola, wiec zachowuje reczne zmiany ze Studio.
 *
 * geo/GBP: `set` (pola byly puste). defaultSeo: `setIfMissing` (nie klobruj recznego).
 * ogImage do defaultSeo dokladany osobno po wgraniu grafiki OG (Faza 4).
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-site-settings-seo.ts
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
  await client
    .patch('siteSettings')
    .set({
      'address.latitude': 50.569069946242486,
      'address.longitude': 22.0381256459378,
      googleBusinessProfileUrl: 'https://share.google/JU9WU9Wq2y2irrfpC',
    })
    .setIfMissing({
      defaultSeo: {
        _type: 'seoMeta',
        metaTitle: {
          _type: 'localeString',
          pl: 'Zajazd Sezam Stalowa Wola — hotel, restauracja, imprezy',
          en: 'Zajazd Sezam Stalowa Wola — hotel, restaurant, events',
        },
        metaDescription: {
          _type: 'localeText',
          pl: 'Hotel, restauracja, bistro i sale na imprezy pod jednym dachem w Stalowej Woli. Noclegi, wesela i uroczystości rodzinne w jednym miejscu.',
          en: 'Hotel, restaurant, bistro and event halls under one roof in Stalowa Wola. Lodging, weddings and family celebrations in one place.',
        },
        noIndex: false,
      },
    })
    .commit()
  console.log('✓ siteSettings: geo + googleBusinessProfileUrl + defaultSeo zaktualizowane')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
