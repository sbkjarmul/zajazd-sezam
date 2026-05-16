/**
 * Seed siteSettings singleton w Sanity z danymi wyciągniętymi z Figmy (Footer).
 *
 * Wymaga: SANITY_API_TOKEN w .env.local (write/editor scope).
 * Token utwórz na: https://www.sanity.io/manage/personal/project/9a0pa99d/api → "Add API token" → Editor
 *
 * Uruchomienie (Node 22.22+):
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-site-settings.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) {
  throw new Error(
    'Missing SANITY_API_TOKEN in .env.local. Utwórz token (Editor scope) na sanity.io/manage.',
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-16',
  token,
  useCdn: false,
})

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  companyName: {
    _type: 'localeString',
    pl: 'Zajazd Sezam',
    en: 'Zajazd Sezam',
  },
  legalName: 'Zajazd Sezam',
  shortDescription: {
    _type: 'localeText',
    pl: 'Zajazd Sezam powstał po to, aby dawać gościom prawdziwe poczucie swobody i komfortu. Chcemy, aby każdy mógł tu spokojnie zjeść, świętować i odpocząć w jednym miejscu.',
    en: 'Zajazd Sezam was created to give guests a true sense of freedom and comfort. We want everyone to be able to eat, celebrate and rest peacefully in one place.',
  },
  address: {
    _type: 'address',
    street: 'ul. Komisji Edukacji Narodowej 51',
    postalCode: '37-450',
    city: 'Stalowa Wola',
    region: 'podkarpackie',
    country: 'PL',
  },
  phone: '+48156422106',
  receptionEmail: 'recepcja@zajazdsezam.pl',
  publicEmail: 'recepcja@zajazdsezam.pl',
  openingHoursRestaurant: [
    {
      _type: 'openingHoursEntry',
      _key: 'restaurant-all-week',
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '22:00',
    },
  ],
  openingHoursReception: [
    {
      _type: 'openingHoursEntry',
      _key: 'reception-24-7',
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
}

const result = await client.createOrReplace(siteSettings)
console.log('✓ siteSettings zapisany:', result._id)
