/**
 * One-off cleanup: unset orphaned fields on contactPage after schema reduction.
 * Removes: hero, mapSection, directionsSection, finalCta,
 *          contactSection.restaurantHoursLabel, contactSection.receptionHoursLabel.
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-contact-cleanup.ts
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
  console.log('Cleanup contactPage orphaned fields…')
  const res = await client
    .patch('contactPage')
    .unset([
      'hero',
      'mapSection',
      'directionsSection',
      'finalCta',
      'contactSection.restaurantHoursLabel',
      'contactSection.receptionHoursLabel',
    ])
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
