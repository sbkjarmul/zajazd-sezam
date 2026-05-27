/**
 * One-off patch: eventsPage.promiseSection.{leadTextMobile, highlightedTextMobile} (PL + EN).
 * Skrócona wersja na mobile — kończy się na highlight ("...my zajmujemy się wszystkim.").
 * Pomija tail ("Od przygotowania sali...") — `tailTextMobile` zostaje unset.
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-events-promise-mobile.ts
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

const LEAD_MOBILE_PL =
  'Wiemy, jak bardzo organizacja wydarzeń potrafi stresować. Dlatego mamy prostą umowę.'
const LEAD_MOBILE_EN =
  'We know how stressful planning an event can be. That’s why our promise is simple.'

const HIGHLIGHT_MOBILE_PL =
  'Ty cieszysz się każdą chwilą i bawisz się z bliskimi, a my zajmujemy się wszystkim.'
const HIGHLIGHT_MOBILE_EN =
  'You enjoy every moment with your loved ones, and we take care of everything.'

async function main() {
  console.log('Patch eventsPage.promiseSection mobile fields…')
  const res = await client
    .patch('eventsPage')
    .set({
      'promiseSection.leadTextMobile': { pl: LEAD_MOBILE_PL, en: LEAD_MOBILE_EN },
      'promiseSection.highlightedTextMobile': {
        pl: HIGHLIGHT_MOBILE_PL,
        en: HIGHLIGHT_MOBILE_EN,
      },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
