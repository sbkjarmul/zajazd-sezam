/**
 * Seed bistroPage singleton z treściami z Figmy (676:3251).
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-bistro-page.ts
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

const ls = (pl: string, en: string) => ({ _type: 'localeString', pl, en })

const doc = {
  _id: 'bistroPage',
  _type: 'bistroPage',
  heroHeadline: ls('Najlepsze bistro w Stalowej Woli!', 'The best bistro in Stalowa Wola!'),
  centralBanner: ls('Jesteśmy otwarci codziennie!', 'We’re open every day!'),
  seo: {
    _type: 'seoMeta',
    metaTitle: {
      pl: 'Bistro Sezam Stalowa Wola — szybki obiad, dania na wynos',
      en: 'Sezam Bistro Stalowa Wola — quick lunch, takeaway dishes',
    },
    metaDescription: {
      pl: 'Bistro Zajazdu Sezam w Stalowej Woli: ciepłe domowe dania na miejscu i na wynos, codziennie 12:00–22:00.',
      en: 'Bistro at Zajazd Sezam, Stalowa Wola: warm homestyle dishes on-site and takeaway, daily 12:00–22:00.',
    },
    noIndex: false,
  },
}

const result = await client.createOrReplace(doc)
console.log('✓ bistroPage zapisany:', result._id)
