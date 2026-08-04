/**
 * One-off patch: eventsPage.hotelUpsellSection.{eyebrow, title} (PL + EN).
 * Rozdziela dotychczasowy tytuł „Goście z daleka? Zarezerwuj nocleg." na:
 *  - eyebrow (accent): „Goście z daleka?"
 *  - title (główny):   „Zarezerwuj nocleg."
 * Zgodnie z redesignem sekcji noclegowej (pełnoekranowy hero + gradient).
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-events-hotel-upsell.ts
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

async function main() {
  console.log('Patch eventsPage.hotelUpsellSection {eyebrow, title}…')
  const res = await client
    .patch('eventsPage')
    .set({
      'hotelUpsellSection.eyebrow': { pl: 'Goście z daleka?', en: 'Out-of-town guests?' },
      'hotelUpsellSection.title': { pl: 'Zarezerwuj nocleg.', en: 'Book a room.' },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
