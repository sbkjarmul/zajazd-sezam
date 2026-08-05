/**
 * Seed contactPage singleton z treściami PL+EN.
 * NAP pobierany z siteSettings — tutaj tylko etykiety pól.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-contact-page.ts
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
  _id: 'contactPage',
  _type: 'contactPage',
  // To samo logo co na stronie glownej (homepage.headerLogo) — wspolny SVG.
  headerLogo: {
    _type: 'imageWithAlt',
    asset: {
      _type: 'reference',
      _ref: 'image-82818311467dab9cfa91874f5098f362c9d15b8f-255x39-svg',
    },
    alt: ls(
      'Zajazd Sezam — restauracja, hotel i sale weselne w Stalowej Woli',
      'Zajazd Sezam — restaurant, hotel and wedding venues in Stalowa Wola',
    ),
  },
  contactSection: {
    eyebrow: ls('Porozmawiajmy', "Let's talk"),
    title: ls('Skontaktuj się', 'Get in touch'),
    phoneLabel: ls('Telefony', 'Phones'),
    receptionLabel: ls('Recepcja', 'Reception'),
    restaurantLabel: ls('Restauracja', 'Restaurant'),
    bistroLabel: ls('Bistro', 'Bistro'),
    hotelLabel: ls('Hotel', 'Hotel'),
    eventsLabel: ls('Imprezy', 'Events'),
    addressLabel: ls('Adres', 'Address'),
    emailLabel: ls('Email', 'Email'),
  },
  seo: {
    _type: 'seoMeta',
    metaTitle: {
      pl: 'Kontakt — Zajazd Sezam Stalowa Wola | telefon, adres, mapa',
      en: 'Contact — Zajazd Sezam Stalowa Wola | phone, address, map',
    },
    metaDescription: {
      pl: 'Skontaktuj się z Zajazdem Sezam w Stalowej Woli. Adres, telefon, email i godziny otwarcia restauracji oraz recepcji 24/7.',
      en: 'Contact Zajazd Sezam in Stalowa Wola. Address, phone, email, plus restaurant hours and 24/7 hotel reception.',
    },
    noIndex: false,
  },
}

const result = await client.createOrReplace(doc)
console.log('✓ contactPage zapisany:', result._id)
