/**
 * Ujednolica komunikat o pojemnosci noclegowej na "70 osob / 70 miejsc noclegowych"
 * (decyzja: NIE "70 pokoi" — 70 to liczba miejsc, nie pokoi). Poprawia niespojne
 * miejsca: eventsPage (hotelUpsellSection + seo.metaDescription) i hotelPage
 * (seo.metaTitle.pl). Nieniszczaco — patchuje tylko te pola.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-capacity-copy.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, apiVersion: '2026-05-16', token, useCdn: false })

async function main() {
  await client
    .patch('eventsPage')
    .set({
      'hotelUpsellSection.description.pl':
        'Zapomnij o logistyce i szukaniu noclegów. Dysponujemy 70 komfortowymi miejscami noclegowymi. Zarezerwuj salę, wyśmienite jedzenie oraz nocleg dla Twoich gości w Stalowej Woli.',
      'hotelUpsellSection.description.en':
        'Forget the logistics of finding hotels. We have 70 comfortable beds on-site. Book the hall, the food and the rooms for your guests in Stalowa Wola in one place.',
      'seo.metaDescription.pl':
        'Wesela do 200 osób, komunie, urodziny i imprezy firmowe w Zajeździe Sezam w Stalowej Woli. Cztery sale, autorska kuchnia i nocleg dla 70 osób.',
      'seo.metaDescription.en':
        'Weddings up to 200 guests, communions, birthdays and corporate events at Zajazd Sezam in Stalowa Wola. Four halls, in-house cuisine and lodging for 70 guests.',
    })
    .commit()
  console.log('✓ eventsPage: copy pojemnosci ujednolicone')

  await client
    .patch('hotelPage')
    .set({ 'seo.metaTitle.pl': 'Hotel Sezam Stalowa Wola — 70+ miejsc, sauna, recepcja 24/7' })
    .commit()
  console.log('✓ hotelPage: metaTitle.pl ujednolicony')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
