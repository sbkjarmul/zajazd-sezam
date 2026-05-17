/**
 * Seed strony Hotel z Figmy (676:305):
 *   - hotelPage singleton (hero, quote, amenities, reservation CTA)
 *   - 8 typów pokoi (roomType) wg ARCHITECTURE.md sekcja 7.1
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-hotel.ts
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

// === Amenities per tier ===
const COMFORT_AMENITIES = [
  ls('Herbata i kawa', 'Tea and coffee'),
  ls('Woda mineralna', 'Mineral water'),
  ls('Klimatyzacja', 'Air conditioning'),
  ls('Suszarka do włosów', 'Hairdryer'),
  ls('Ręczniki kąpielowe', 'Bath towels'),
  ls('Kosmetyki hotelowe', 'Hotel toiletries'),
  ls('Prysznic', 'Shower'),
  ls('Sejf', 'Safe'),
]

const STANDARD_AMENITIES = [
  ls('Herbata i kawa', 'Tea and coffee'),
  ls('Woda mineralna', 'Mineral water'),
  ls('Ręczniki kąpielowe', 'Bath towels'),
  ls('Kosmetyki hotelowe', 'Hotel toiletries'),
  ls('Prysznic', 'Shower'),
]

type RoomSeed = {
  identifier: string
  order: number
  name: ReturnType<typeof ls>
  description: ReturnType<typeof lt>
  capacity: number
  tier: 'comfort' | 'standard'
}

const rooms: RoomSeed[] = [
  {
    identifier: 'apartment-comfort',
    order: 10,
    name: ls('Apartament Komfort', 'Comfort Apartment'),
    description: lt(
      'Najbardziej przestronny wybór dla par i rodzin. Salon, sypialnia, klimatyzacja, wygodny materac i zestaw powitalny.',
      'The most spacious choice for couples and families. Living room, bedroom, AC, comfortable mattress, and welcome set.',
    ),
    capacity: 4,
    tier: 'comfort',
  },
  {
    identifier: 'comfort-room',
    order: 20,
    name: ls('Pokój Komfort', 'Comfort Room'),
    description: lt(
      'Wygodny pokój z pełnym wyposażeniem Komfort. Klimatyzacja, wygodny materac, zestaw powitalny. Recepcja dobierze konfigurację łóżek do liczby gości.',
      'Comfortable room with the full Comfort kit. AC, comfortable mattress, welcome set. Reception will match bed configuration to your party size.',
    ),
    capacity: 4,
    tier: 'comfort',
  },
  {
    identifier: 'standard-room',
    order: 30,
    name: ls('Pokój Standard', 'Standard Room'),
    description: lt(
      'Wygodny nocleg w rozsądnej cenie. Wszystko czego potrzeba, bez zbędnych dodatków. Recepcja dobierze konfigurację łóżek do liczby gości.',
      'Comfortable stay at a sensible price. Everything you need, no extras. Reception will match bed configuration to your party size.',
    ),
    capacity: 4,
    tier: 'standard',
  },
]

async function main() {
  console.log('Seedowanie 8 typów pokoi…')
  for (const r of rooms) {
    const amenities = r.tier === 'comfort' ? COMFORT_AMENITIES : STANDARD_AMENITIES
    await client.createOrReplace({
      _id: `roomType-${r.identifier}`,
      _type: 'roomType',
      name: r.name,
      identifier: r.identifier,
      description: r.description,
      capacity: r.capacity,
      amenities: amenities.map((a, i) => ({ ...a, _key: `${r.identifier}-am${i}` })),
      order: r.order,
    })
  }
  console.log(`✓ ${rooms.length} pokoi zapisanych`)

  console.log('Seedowanie hotelPage…')
  await client.createOrReplace({
    _id: 'hotelPage',
    _type: 'hotelPage',
    hero: {
      eyebrow: ls('70+ miejsc noclegowych', '70+ beds available'),
      title: ls('Miejsce, w którym odpoczniesz', 'A place to truly rest'),
      subtitle: lt('Zostań na jedną noc. Albo dłużej.', 'Stay one night. Or longer.'),
      primaryCtaLabel: ls('Zarezerwuj termin', 'Book your date'),
      secondaryCtaLabel: ls('Zobacz pokoje', 'See rooms'),
    },
    quote: lt(
      'Cisza po długim dniu. Dobre jedzenie bez wychodzenia. Recepcja, która czeka na Ciebie o każdej porze. Hotel Sezam zaprasza.',
      'Quiet after a long day. Great food without leaving. A reception that’s here whenever you arrive. Hotel Sezam welcomes you.',
    ),
    amenitiesSection: {
      eyebrow: ls('Dlaczego Hotel Sezam', 'Why Hotel Sezam'),
      title: ls('Gwarancja wygody', 'Comfort guaranteed'),
      items: [
        {
          _key: 'a1',
          title: ls('Recepcja 24/7', 'Reception 24/7'),
          description: lt(
            'Ktoś zawsze jest na miejscu. Nieważne, o której przyjeżdżasz.',
            'Someone is always here. No matter when you arrive.',
          ),
        },
        {
          _key: 'a2',
          title: ls('Sauna', 'Sauna'),
          description: lt(
            'Relaks na zakończenie długiego dnia. Bez wychodzenia z hotelu.',
            'Relax at the end of a long day. Without leaving the hotel.',
          ),
        },
        {
          _key: 'a3',
          title: ls('Łóżeczka dziecięce', 'Cribs available'),
          description: lt(
            'Przyjeżdżasz z maluchem? Łóżeczko czeka, nie musisz nic przynosić.',
            'Traveling with a baby? The crib is ready — bring nothing.',
          ),
        },
        {
          _key: 'a4',
          title: ls('Lokalizacja', 'Location'),
          description: lt(
            'Strategiczne miejsce na wjeździe do Stalowej Woli. Bezpłatny parking na miejscu.',
            'Strategic spot at the entry to Stalowa Wola. Free on-site parking.',
          ),
        },
        {
          _key: 'a5',
          title: ls('Restauracja do 22:00', 'Restaurant until 22:00'),
          description: lt(
            'Nie musisz szukać jedzenia po mieście. Ciepłe danie czeka na miejscu.',
            'No need to hunt for food around town. A warm meal is waiting on-site.',
          ),
        },
        {
          _key: 'a6',
          title: ls('Pralnia hotelowa', 'Hotel laundry'),
          description: lt(
            'Zadbamy o Twoje rzeczy podczas pobytu. Idealne na dłuższe wyjazdy.',
            'We’ll take care of your clothes during your stay. Perfect for longer trips.',
          ),
        },
      ],
    },
    reviewsSection: {
      eyebrow: ls('Doświadczenie', 'Experience'),
      title: ls(
        'Sprawdź opinie, później przekonaj się sam',
        'Read the reviews, then experience it yourself',
      ),
      ratingValue: '4.4/5',
      ratingSource: 'Google',
      ratingCount: ls('Na podstawie 1100+ opinii.', 'Based on 1100+ reviews.'),
    },
    discoverSection: {
      eyebrow: ls('Odkryj Sezam', 'Discover Sezam'),
      title: ls('Wszystko w jednym miejscu', 'Everything in one place'),
      cards: [
        {
          _key: 'card-bistro',
          eyebrow: ls('Smak, który znasz z domu', 'Taste you know from home'),
          title: ls('Bistro', 'Bistro'),
          description: lt(
            'Ciepłe, domowe jedzenie gotowe wtedy, kiedy go potrzebujesz. Na miejscu lub na wynos, zawsze świeże i bez pośpiechu.',
            'Warm homestyle food ready when you need it. Eat in or take away, always fresh and unhurried.',
          ),
          ctaLabel: ls('Dowiedz się więcej', 'Learn more'),
          ctaHref: '/bistro',
        },
        {
          _key: 'card-events',
          eyebrow: ls('Radosne chwile z najbliższymi', 'Joyful moments with loved ones'),
          title: ls('Imprezy okolicznościowe', 'Celebrations'),
          description: lt(
            'Najważniejsze momenty w życiu zasługują na oprawę. W Sezamie zajmujemy się wszystkim, żebyś mógł cieszyć się czasem z bliskimi.',
            'Life’s most important moments deserve a setting. At Sezam we handle everything so you can enjoy time with loved ones.',
          ),
          ctaLabel: ls('Dowiedz się więcej', 'Learn more'),
          ctaHref: '/imprezy-okolicznosciowe',
        },
        {
          _key: 'card-restaurant',
          eyebrow: ls('Naturalne składniki, wyjątkowy smak', 'Natural ingredients, unique taste'),
          title: ls('Restauracja', 'Restaurant'),
          description: lt(
            'Gotujemy w oparciu o naturalne produkty od lokalnych dostawców. Każde danie to chwila, przy której warto zwolnić i cieszyć się jedzeniem.',
            'We cook with natural produce from local suppliers. Every dish is a moment worth slowing down for.',
          ),
          ctaLabel: ls('Dowiedz się więcej', 'Learn more'),
          ctaHref: '/restauracja',
        },
        {
          _key: 'card-conferences',
          eyebrow: ls('Idealne miejsce spotkań', 'The perfect meeting place'),
          title: ls('Sale konferencyjne', 'Conference rooms'),
          description: lt(
            'Dobrze wyposażone sale konferencyjne, pełne zaplecze techniczne i catering na miejscu sprawiają, że możesz skupić się na biznesie.',
            'Well-equipped conference rooms, full tech setup, and on-site catering — focus on business while we handle the rest.',
          ),
          ctaLabel: ls('Dowiedz się więcej', 'Learn more'),
          ctaHref: '/kontakt',
        },
      ],
    },
    reservationSection: {
      eyebrow: ls('Rezerwacje', 'Reservations'),
      title: ls('Zarezerwuj nocleg w Stalowej Woli', 'Book your stay in Stalowa Wola'),
      description: lt(
        'Zadzwoń lub wypełnij formularz, a my potwierdzimy dostępność tego samego dnia.',
        'Call or fill in the form — we’ll confirm availability the same day.',
      ),
      ctaLabel: ls('Zarezerwuj nocleg', 'Book a room'),
    },
    seo: {
      _type: 'seoMeta',
      metaTitle: {
        pl: 'Hotel Sezam Stalowa Wola — 70+ pokoi, sauna, recepcja 24/7',
        en: 'Hotel Sezam Stalowa Wola — 70+ beds, sauna, 24/7 reception',
      },
      metaDescription: {
        pl: 'Hotel Zajazdu Sezam w Stalowej Woli: apartament, pokoje Komfort i Standard, sauna, restauracja, parking, recepcja 24/7.',
        en: 'Hotel at Zajazd Sezam, Stalowa Wola: apartment, Comfort and Standard rooms, sauna, restaurant, parking, 24/7 reception.',
      },
      noIndex: false,
    },
  })
  console.log('✓ hotelPage zapisany')
}

await main()
