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
    identifier: 'double-comfort',
    order: 20,
    name: ls('Pokój dwuosobowy Komfort', 'Comfort Double Room'),
    description: lt(
      'Dla dwojga lub osoby ceniącej przestrzeń. Klimatyzacja, wygodny materac, zestaw powitalny.',
      'For two, or anyone who values space. AC, comfortable mattress, welcome set.',
    ),
    capacity: 2,
    tier: 'comfort',
  },
  {
    identifier: 'triple-comfort',
    order: 30,
    name: ls('Pokój trzyosobowy Komfort', 'Comfort Triple Room'),
    description: lt(
      'Idealny dla rodzin lub grupy znajomych. Trzy wygodne miejsca, klimatyzacja i pełne wyposażenie.',
      'Perfect for families or small groups. Three comfortable beds, AC, fully equipped.',
    ),
    capacity: 3,
    tier: 'comfort',
  },
  {
    identifier: 'quad-comfort',
    order: 40,
    name: ls('Pokój czteroosobowy Komfort', 'Comfort Quad Room'),
    description: lt(
      'Dla większej rodziny lub ekipy w podróży służbowej. Cztery miejsca z pełnym wyposażeniem Komfort.',
      'For larger families or business teams. Four beds with the full Comfort kit.',
    ),
    capacity: 4,
    tier: 'comfort',
  },
  {
    identifier: 'single-comfort-single-bed',
    order: 50,
    name: ls('Pokój jednoosobowy Komfort — łóżko pojedyncze', 'Single Comfort — single bed'),
    description: lt(
      'Spokojny pokój dla pojedynczego gościa. Łóżko pojedyncze, klimatyzacja i pełne wyposażenie Komfort.',
      'Calm room for a single guest. Single bed, AC, full Comfort kit.',
    ),
    capacity: 1,
    tier: 'comfort',
  },
  {
    identifier: 'single-comfort-king',
    order: 60,
    name: ls('Pokój jednoosobowy Komfort — łóżko King Size', 'Single Comfort — King size bed'),
    description: lt(
      'Dla wymagających gości. Szerokie łóżko King Size, klimatyzacja i pełen pakiet Komfort.',
      'For demanding guests. Wide King size bed, AC, full Comfort package.',
    ),
    capacity: 1,
    tier: 'comfort',
  },
  {
    identifier: 'single-standard',
    order: 70,
    name: ls('Pokój jednoosobowy Standard', 'Standard Single Room'),
    description: lt(
      'Wygodny nocleg w rozsądnej cenie. Dokładnie to czego szukasz na krótki pobyt.',
      'Comfortable stay at a sensible price. Exactly what you need for a short visit.',
    ),
    capacity: 1,
    tier: 'standard',
  },
  {
    identifier: 'double-standard',
    order: 80,
    name: ls('Pokój dwuosobowy Standard', 'Standard Double Room'),
    description: lt(
      'Praktyczny wybór dla dwóch osób. Wszystko czego potrzeba, bez zbędnych dodatków.',
      'A practical choice for two. Everything you need, no unnecessary extras.',
    ),
    capacity: 2,
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
        pl: 'Hotel Sezam Stalowa Wola — 70+ miejsc noclegowych, sauna, recepcja 24/7',
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
