/**
 * Seed contactPage singleton z treściami PL+EN.
 * NAP, godziny i Maps URL pobierane z siteSettings — tutaj tylko etykiety i copy.
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
const lt = (pl: string, en: string) => ({ _type: 'localeText', pl, en })

const doc = {
  _id: 'contactPage',
  _type: 'contactPage',
  hero: {
    eyebrow: ls('Zapraszamy do Stalowej Woli', 'Welcome to Stalowa Wola'),
    title: ls('Porozmawiajmy', 'Let’s talk'),
    subtitle: lt(
      'Zadzwoń, napisz albo wpadnij na kawę. Recepcja czeka 24 godziny na dobę, restauracja codziennie do 22:00.',
      'Call us, write to us, or drop by for a coffee. Reception is open 24/7, the restaurant runs daily until 22:00.',
    ),
  },
  contactSection: {
    eyebrow: ls('Skontaktuj się', 'Get in touch'),
    title: ls('Wszystkie sposoby na kontakt', 'Every way to reach us'),
    addressLabel: ls('Adres', 'Address'),
    phoneLabel: ls('Telefon', 'Phone'),
    emailLabel: ls('Email', 'Email'),
    restaurantHoursLabel: ls('Restauracja', 'Restaurant'),
    receptionHoursLabel: ls('Recepcja hotelu', 'Hotel reception'),
  },
  mapSection: {
    eyebrow: ls('Jak nas znaleźć', 'How to find us'),
    title: ls(
      'Strategiczna lokalizacja na wjeździe do miasta',
      'A strategic spot at the city’s gateway',
    ),
    googleMapsLinkLabel: ls('Otwórz w Mapach Google', 'Open in Google Maps'),
  },
  directionsSection: {
    eyebrow: ls('Dojazd', 'Getting here'),
    title: ls('Praktyczne wskazówki', 'Practical tips'),
    content: lt(
      'Zajazd Sezam znajdziesz przy ulicy Komisji Edukacji Narodowej, na wjeździe do Stalowej Woli od strony obwodnicy.\n\nBezpłatny parking jest dostępny bezpośrednio przy budynku — nie musisz szukać miejsca na ulicy. Goście weselni i konferencyjni mają zarezerwowane dodatkowe miejsca na tyłach.\n\nNajbliższy dworzec PKP to Stalowa Wola Rozwadów (ok. 4 km). Z dworca dojedziesz taksówką lub umówimy transport — wystarczy zadzwonić do recepcji.',
      'You’ll find Zajazd Sezam on Komisji Edukacji Narodowej street, right at the entrance to Stalowa Wola from the bypass.\n\nFree parking is available directly next to the building — no need to hunt for a spot on the street. Wedding and conference guests get extra reserved spots at the back.\n\nThe nearest train station is Stalowa Wola Rozwadów (~4 km). From the station you can grab a taxi, or we can arrange a transfer — just give reception a call.',
    ),
  },
  finalCta: {
    title: ls('Gotowy, żeby się u nas zatrzymać?', 'Ready to stay with us?'),
    description: lt(
      'Zarezerwuj nocleg, salę albo stolik w restauracji — recepcja potwierdzi dostępność tego samego dnia.',
      'Book a room, a hall, or a restaurant table — reception will confirm availability the same day.',
    ),
    ctaLabel: ls('Zarezerwuj termin', 'Book your date'),
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
