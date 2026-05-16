/**
 * Seed homepage singleton w Sanity z treściami wyciągniętymi z Figmy
 * (frame "SEZAM - Landing Page", 676:1500).
 *
 * Uruchomienie (Node 22.22+):
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-homepage.ts
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

const homepage = {
  _id: 'homepage',
  _type: 'homepage',
  hero: {
    _type: 'hero',
    headline: ls(
      'Twoje wyjątkowe chwile w rodzinnej atmosferze',
      'Your exceptional moments in a family atmosphere',
    ),
    subheadline: lt(
      'Kompleksowa organizacja imprez okolicznościowych w Stalowej Woli. Sala, restauracja, sauna i nocleg dla 70 osób pod jednym dachem.',
      'Comprehensive event organization in Stalowa Wola. Hall, restaurant, sauna and accommodation for 70 guests under one roof.',
    ),
    primaryCtaLabel: ls('Zarezerwuj termin', 'Book your date'),
    // image — uzupełnij w Studio (Hero / Zdjęcie hero).
  },
  aboutSection: {
    intro: lt(
      'SEZAM to rodzinne miejsce z sercem od 2000 roku, gdzie tradycja łączy się z doświadczeniem. Zapewniamy kompleksową organizację wydarzeń bez stresu i dodatkowych formalności.',
      'SEZAM is a heartfelt family-run venue since 2000, where tradition meets experience. We deliver comprehensive event organization without stress or extra formalities.',
    ),
    stats: [
      { _key: 's1', value: '5000+', label: ls('zorganizowanych imprez', 'events organized') },
      { _key: 's2', value: '1000+', label: ls('zadowolonych klientów', 'happy customers') },
      { _key: 's3', value: '70+', label: ls('miejsc noclegowych', 'beds available') },
      { _key: 's4', value: '25+', label: ls('lat doświadczenia', 'years of experience') },
    ],
  },
  servicesIntro: {
    eyebrow: ls('Nasze usługi', 'Our services'),
    title: ls('Odkryj Sezam', 'Discover Sezam'),
  },
  eventsBlock: {
    eyebrow: ls('Imprezy okolicznościowe', 'Events & celebrations'),
    title: ls('Świętuj bez stresu', 'Celebrate without stress'),
    description: lt(
      'W SEZAM wiemy, że organizacja wydarzeń często bywa stresująca. Dlatego my zajmujemy się wszystkim, od przygotowania przez serwowanie pysznych potraw po komfortowy nocleg dla gości, a wy możecie się cieszyć każdą chwilą.',
      'At SEZAM we know event planning can be stressful. We handle it all — from preparation through delicious meals to comfortable lodging — so you can enjoy every moment.',
    ),
    ctaLabel: ls('Czytaj więcej', 'Read more'),
  },
  restaurantBlock: {
    eyebrow: ls('Restauracja SEZAM', 'SEZAM Restaurant'),
    title: ls('Zjedz zdrowo i smacznie', 'Eat healthy and delicious'),
    description: lt(
      'W naszej restauracji stawiamy na składniki, które rosną blisko nas i powstają z sercem. Współpracujemy z lokalnymi dostawcami, bo wierzymy, że najlepszy smak kryje się w prostocie i świeżości.',
      'In our restaurant we choose ingredients grown nearby and made with care. We partner with local producers because we believe true flavour lies in simplicity and freshness.',
    ),
    ctaLabel: ls('Zobacz menu', 'See menu'),
  },
  hotelBlock: {
    eyebrow: ls('Hotel SEZAM', 'SEZAM Hotel'),
    title: ls('Miejsce, w którym odpoczniesz', 'A place to truly rest'),
    description: lt(
      'W SEZAM oferujemy 70 komfortowych miejsc noclegowych w pokojach jedno-, dwu- i trzyosobowych oraz w apartamentach. Każdy pokój został urządzony z myślą o spokoju i wygodzie gości, aby mogli w pełni odpocząć lub pracować w ciszy.',
      'SEZAM offers 70 comfortable beds in single, double and triple rooms plus apartments. Each room is designed for peace and comfort — to fully rest or work in quiet.',
    ),
    ctaLabel: ls('Zarezerwuj nocleg', 'Book a room'),
  },
  bistroBlock: {
    eyebrow: ls('Bistro SEZAM', 'SEZAM Bistro'),
    title: ls(
      'Świeżość, która czeka na Ciebie każdego dnia',
      'Freshness waiting for you every day',
    ),
    description: lt(
      'Znajdziesz u nas ciepłe, domowe dania serwowane na miejscu oraz wygodnie zapakowane na wynos. Dbamy o to, aby wszystko było gotowe szybko i zawsze smakowało naturalnie, świeżo i z sercem.',
      'Warm homestyle dishes served on the spot or packed to go. Everything is ready quickly and always tastes natural, fresh, and made with care.',
    ),
    ctaLabel: ls('Zobacz ofertę', 'See menu'),
  },
  reviewsBlock: {
    eyebrow: ls('Doświadczenie', 'Experience'),
    title: ls(
      'Sprawdź opinie, później przekonaj się sam',
      'Read the reviews, then experience it yourself',
    ),
    ratingValue: '4.4/5',
    ratingSource: 'Google',
    ratingCount: ls('Na podstawie 1100+ opinii.', 'Based on 1100+ reviews.'),
  },
  contactBlock: {
    eyebrow: ls('Rezerwacje', 'Reservations'),
    title: ls('Zaplanuj swój pobyt w Zajazd SEZAM', 'Plan your stay at Zajazd SEZAM'),
  },
  seo: {
    _type: 'seoMeta',
    metaTitle: {
      pl: 'Zajazd Sezam Stalowa Wola — hotel, restauracja, wesela',
      en: 'Zajazd Sezam Stalowa Wola — hotel, restaurant, weddings',
    },
    metaDescription: {
      pl: 'Hotel, restauracja i sala bankietowa pod jednym dachem w Stalowej Woli. Wesela, imprezy okolicznościowe, noclegi dla 70 osób.',
      en: 'Hotel, restaurant and banquet hall under one roof in Stalowa Wola. Weddings, celebrations, lodging for 70 guests.',
    },
    noIndex: false,
  },
}

const result = await client.createOrReplace(homepage)
console.log('✓ homepage zapisany:', result._id)
