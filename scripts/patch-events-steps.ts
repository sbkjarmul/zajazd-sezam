/**
 * One-off patch: eventsPage.stepsSection.steps[] (PL + EN).
 * Redesign sekcji "Proces rezerwacji" (Figma 1060:107): każdy krok rozdzielony
 * na `title` (accent, widoczny domyślnie) + `text` (opis, odsłaniany na hover).
 * Dochodzi nowy krok 2 "Odzwonimy do Ciebie".
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-events-steps.ts
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

const ls = (pl: string, en: string) => ({ _type: 'localeString', pl, en })
const lt = (pl: string, en: string) => ({ _type: 'localeText', pl, en })

const steps = [
  {
    _key: 'step-1',
    _type: 'step',
    title: ls('Zadzwoń lub napisz', 'Call or write'),
    text: lt('Ustalimy termin i szczegóły.', 'We’ll agree on the date and details.'),
  },
  {
    _key: 'step-2',
    _type: 'step',
    title: ls('Odzwonimy do Ciebie', 'We’ll call you back'),
    text: lt(
      'Dopasujemy ofertę do Twoich potrzeb i budżetu.',
      'We tailor the offer to your needs and budget.',
    ),
  },
  {
    _key: 'step-3',
    _type: 'step',
    title: ls('Zarezerwuj i świętuj', 'Book and celebrate'),
    text: lt(
      'Przyjedź na gotowe. Resztą zajmuje się Sezam.',
      'Just arrive — Sezam handles the rest.',
    ),
  },
]

async function main() {
  console.log('Patch eventsPage.stepsSection.steps[] {title, text}…')
  const res = await client.patch('eventsPage').set({ 'stepsSection.steps': steps }).commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
