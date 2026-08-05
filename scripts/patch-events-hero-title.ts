/**
 * One-off patch: eventsPage.hero.title (PL + EN) — dodaje markery `*...*` na
 * akcent Westbourne Serif Italic (Figma 997:28: „Świętuj *bez stresu.*").
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-events-hero-title.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

async function main() {
  console.log('Patch eventsPage.hero.title {pl, en}…')
  const res = await client
    .patch('eventsPage')
    .set({
      'hero.title': {
        _type: 'localeString',
        pl: 'Świętuj *bez stresu.*',
        en: 'Celebrate *without the stress.*',
      },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
