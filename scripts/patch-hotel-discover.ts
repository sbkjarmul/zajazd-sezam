/**
 * One-off patch: hotelPage.discoverSection.cards[] (PL + EN).
 * - big title (`eyebrow`) = nazwa kategorii (mały label usunięty z UI),
 * - opisy skrócone do jednego zdania.
 * Patch po `_key` (keyed paths) — NIE dotyka `image`/`ctaHref` kart.
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-hotel-discover.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const ls = (pl: string, en: string) => ({ _type: 'localeString', pl, en })
const lt = (pl: string, en: string) => ({ _type: 'localeText', pl, en })

const k = (key: string, field: string) => `discoverSection.cards[_key=="${key}"].${field}`

async function main() {
  console.log('Patch hotelPage.discoverSection.cards[] {eyebrow, description}…')
  const res = await client
    .patch('hotelPage')
    .set({
      [k('card-bistro', 'eyebrow')]: ls('Bistro', 'Bistro'),
      [k('card-bistro', 'description')]: lt(
        'Ciepłe, domowe jedzenie gotowe wtedy, kiedy go potrzebujesz.',
        'Warm, home-style food ready whenever you need it.',
      ),
      [k('card-events', 'eyebrow')]: ls('Imprezy', 'Events'),
      [k('card-events', 'description')]: lt(
        'Najważniejsze momenty w życiu zasługują na oprawę.',
        'Life’s most important moments deserve a fitting setting.',
      ),
      [k('card-restaurant', 'eyebrow')]: ls('Restauracja', 'Restaurant'),
      [k('card-restaurant', 'description')]: lt(
        'Gotujemy w oparciu o naturalne produkty od lokalnych dostawców.',
        'We cook with natural produce from local suppliers.',
      ),
      [k('card-conferences', 'eyebrow')]: ls('Sale konferencyjne', 'Conference rooms'),
      [k('card-conferences', 'description')]: lt(
        'Dobrze wyposażone sale konferencyjne, pełne zaplecze techniczne i catering.',
        'Well-equipped conference rooms, full technical facilities and catering.',
      ),
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
