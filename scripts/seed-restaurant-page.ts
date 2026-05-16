/**
 * Seed restaurantPage singleton z treściami z Figmy (frame 676:2181).
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-restaurant-page.ts
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
  _id: 'restaurantPage',
  _type: 'restaurantPage',
  heroHeadline: ls('Zjedz w Sezamie.', 'Eat at Sezam.'),
  pitchSection: {
    text: lt(
      'Robimy najlepsze sałatki w mieście. Wpadnij z ekipą i przekonajcie się sami!',
      'We make the best salads in town. Come with your crew and see for yourself!',
    ),
    ctaLabel: ls('Zobacz menu', 'See menu'),
  },
  craftSection: {
    title: ls('Kulinarna sztuka z lokalnych składników', 'Culinary craft from local ingredients'),
    description: lt(
      'W SEZAM gotujemy w oparciu o naturalne składniki od lokalnych dostawców.',
      'At SEZAM we cook with natural ingredients sourced from local suppliers.',
    ),
    ctaLabel: ls('Zobacz menu', 'See menu'),
  },
  ambianceSection: {
    title: ls('Wnętrze oraz atmosfera', 'Interior and atmosphere'),
    tagline: lt(
      'Z nami spędzisz wieczory, które po prostu się udają.',
      'Spend evenings with us that simply turn out right.',
    ),
    ctaLabel: ls('Zarezerwuj stolik', 'Book a table'),
  },
  reservationSection: {
    title: ls('Zarezerwuj stolik w restauracji Sezam', 'Book a table at Sezam restaurant'),
    description: lt(
      'Zadzwoń, a nasz zespół znajdzie dla Ciebie najlepszy stolik.',
      'Call us — our team will find the best table for you.',
    ),
  },
  seo: {
    _type: 'seoMeta',
    metaTitle: {
      pl: 'Restauracja Sezam Stalowa Wola — polska kuchnia, lokalne składniki',
      en: 'Sezam Restaurant Stalowa Wola — Polish cuisine, local ingredients',
    },
    metaDescription: {
      pl: 'Restauracja Zajazdu Sezam w Stalowej Woli. Polska kuchnia z lokalnych składników, codziennie 12:00–22:00. Rezerwacja stolika telefoniczna.',
      en: 'Restaurant at Zajazd Sezam, Stalowa Wola. Polish cuisine from local ingredients, open daily 12:00–22:00. Table reservation by phone.',
    },
    noIndex: false,
  },
}

const result = await client.createOrReplace(doc)
console.log('✓ restaurantPage zapisany:', result._id)
