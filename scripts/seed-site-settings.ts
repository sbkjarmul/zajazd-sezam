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

// Logo domyslne = DOKLADNIE to samo co na stronie glownej (homepage.headerLogo).
// Uzywaja go wszystkie podstrony bez wlasnego headerLogo (Regulamin, Polityka
// prywatnosci). Bez tego pola Logo.tsx rysuje zaszyty wordmark zamiast SVG z
// Sanity. Ten sam asset bierze EMAIL_LOGO_QUERY. Przy podmianie logo strony
// glownej zmien tez ten _ref.
const HOMEPAGE_LOGO_REF = 'image-82818311467dab9cfa91874f5098f362c9d15b8f-255x39-svg'

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  defaultHeaderLogo: {
    _type: 'imageWithAlt',
    asset: { _type: 'reference', _ref: HOMEPAGE_LOGO_REF },
    alt: {
      _type: 'localeString',
      pl: 'Zajazd Sezam — restauracja, hotel i sale weselne w Stalowej Woli',
      en: 'Zajazd Sezam — restaurant, hotel and wedding venues in Stalowa Wola',
    },
  },
  companyName: {
    _type: 'localeString',
    pl: 'Zajazd Sezam',
    en: 'Zajazd Sezam',
  },
  legalName: 'Zajazd Sezam',
  shortDescription: {
    _type: 'localeText',
    pl: 'Chcemy, aby każdy mógł dobrze zjeść, świętować i odpocząć.',
    en: 'We want everyone to be able to eat well, celebrate and rest.',
  },
  address: {
    _type: 'address',
    street: 'ul. Komisji Edukacji Narodowej 51',
    postalCode: '37-450',
    city: 'Stalowa Wola',
    region: 'podkarpackie',
    country: 'PL',
    // Geo-pin obiektu — GeoCoordinates w Schema.org (silny sygnal SEO lokalnego).
    latitude: 50.569069946242486,
    longitude: 22.0381256459378,
  },
  phone: '+48156422106', // Recepcja / główny (Hotel, Imprezy, Kontakt, stopka domyślna)
  phoneRestaurant: '+48156422104', // Bezpośrednia linia Restauracji
  phoneBistro: '+48156422102', // Bezpośrednia linia Bistro
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
  // Wizytowka Google → sameAs w Schema.org (powiazanie strony z profilem lokalnym).
  googleBusinessProfileUrl: 'https://share.google/JU9WU9Wq2y2irrfpC',
  // Domyslne SEO — siatka bezpieczenstwa dla stron bez wlasnego pola `seo`
  // (galeria, menu, strony prawne). ogImage dokladany osobno po wgraniu grafiki OG.
  defaultSeo: {
    _type: 'seoMeta',
    metaTitle: {
      _type: 'localeString',
      pl: 'Zajazd Sezam Stalowa Wola — hotel, restauracja, imprezy',
      en: 'Zajazd Sezam Stalowa Wola — hotel, restaurant, events',
    },
    metaDescription: {
      _type: 'localeText',
      pl: 'Hotel, restauracja, bistro i sale na imprezy pod jednym dachem w Stalowej Woli. Noclegi, wesela i uroczystości rodzinne w jednym miejscu.',
      en: 'Hotel, restaurant, bistro and event halls under one roof in Stalowa Wola. Lodging, weddings and family celebrations in one place.',
    },
    noIndex: false,
  },
}

const result = await client.createOrReplace(siteSettings)
console.log('✓ siteSettings zapisany:', result._id)
