/**
 * Patch hotelPage.quote z łamaniami linii (zachowywane przez whitespace-pre-line
 * w komponencie HotelQuote).
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-hotel-quote.ts
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

const pl = [
  'Cisza po długim dniu.',
  'Dobre jedzenie bez wychodzenia.',
  'Recepcja, która czeka na Ciebie o każdej porze.',
  '',
  'Hotel Sezam zaprasza.',
].join('\n')

const en = [
  'Quiet after a long day.',
  'Great food without leaving.',
  'A reception that’s here whenever you arrive.',
  '',
  'Hotel Sezam welcomes you.',
].join('\n')

async function main() {
  await client.patch('hotelPage').set({ quote: { pl, en } }).commit()
  console.log('✓ hotelPage.quote zaktualizowany')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
