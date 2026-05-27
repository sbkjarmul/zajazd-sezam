/**
 * Seed strony Imprezy okolicznościowe (676:1079):
 *   - 4 typy imprez (eventType): wesele, komunia, urodziny, firma
 *   - 4 sale eventowe (eventHall): bankietowa, złota, szafirowa, wydzielona
 *   - eventsPage singleton z pełną treścią PL+EN wg Figmy
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-events.ts
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

// =============================================================================
// Event types
// =============================================================================

type EventTypeSeed = {
  slug: string
  order: number
  name: ReturnType<typeof ls>
  description: ReturnType<typeof lt>
}

const eventTypes: EventTypeSeed[] = [
  {
    slug: 'wesele',
    order: 10,
    name: ls('Wesela', 'Weddings'),
    description: lt(
      'Sala, menu i hotel w jednym kompleksie. Twoi goście z poza Stalowej Woli nie muszą martwić się powrotem.',
      'Hall, menu and hotel in one place. Out-of-town guests don’t need to worry about getting home.',
    ),
  },
  {
    slug: 'komunia',
    order: 20,
    name: ls('Komunie', 'First communions'),
    description: lt(
      'Spokojny, rodzinny dzień bez biegania między restauracją a kościołem. Dopasujemy menu do najmłodszych i dorosłych gości.',
      'A calm, family day without running between restaurant and church. Menu tailored for kids and adult guests alike.',
    ),
  },
  {
    slug: 'urodziny',
    order: 30,
    name: ls('Urodziny i jubileusze', 'Birthdays and anniversaries'),
    description: lt(
      'Świętuj swój dzień w wyjątkowym wnętrzu. Małe spotkanie czy wielka gala, dobierzemy salę i menu do skali wieczoru.',
      'Celebrate your day in a special space. Small gathering or grand gala, we’ll match the hall and menu to the scale.',
    ),
  },
  {
    slug: 'firma',
    order: 40,
    name: ls('Imprezy firmowe', 'Corporate events'),
    description: lt(
      'Konferencja, integracja albo wigilia firmowa. Dyskretne sale, profesjonalna obsługa i noclegi dla ekipy w jednym miejscu.',
      'Conference, integration, or company Christmas dinner. Discreet halls, professional service and lodging for the whole team.',
    ),
  },
]

// =============================================================================
// Event halls
// =============================================================================

type HallSeed = {
  slug: string
  order: number
  name: ReturnType<typeof ls>
  capacity: number
  description: ReturnType<typeof lt>
}

const halls: HallSeed[] = [
  {
    slug: 'sala-bankietowa',
    order: 10,
    name: ls('Sala Bankietowa', 'Banquet Hall'),
    capacity: 200,
    description: lt(
      'Przestronna, nowoczesna sala na wesela w Stalowej Woli. Eleganckie wnętrze, które Twoi goście zapamiętają.',
      'A spacious, modern hall for weddings in Stalowa Wola. Elegant interiors your guests will remember.',
    ),
  },
  {
    slug: 'sala-zlota',
    order: 20,
    name: ls('Sala Złota', 'Golden Hall'),
    capacity: 100,
    description: lt(
      'Wyjątkowa sala do świętowania w Stalowej Woli. Ciepłe złote detale tworzą atmosferę, którą zapamiętają wszyscy goście.',
      'A unique hall for celebrating in Stalowa Wola. Warm golden details create an atmosphere all guests will remember.',
    ),
  },
  {
    slug: 'sala-szafirowa',
    order: 30,
    name: ls('Sala Szafirowa', 'Sapphire Hall'),
    capacity: 20,
    description: lt(
      'Idealna sala do organizowania kameralnych spotkań w Stalowej Woli.',
      'The perfect hall for intimate gatherings in Stalowa Wola.',
    ),
  },
  {
    slug: 'sala-wydzielona',
    order: 40,
    name: ls('Sala wydzielona', 'Private Room'),
    capacity: 35,
    description: lt(
      'Ciepło Sezamu w mniejszym wydaniu. Przestrzeń dopasowana do małych uroczystości w Stalowej Woli.',
      'The warmth of Sezam in a smaller setting. A space tailored for small celebrations in Stalowa Wola.',
    ),
  },
]

// =============================================================================
// Seed
// =============================================================================

async function main() {
  console.log('Seedowanie 4 typów imprez…')
  for (const t of eventTypes) {
    await client.createOrReplace({
      _id: `eventType-${t.slug}`,
      _type: 'eventType',
      name: t.name,
      slug: { _type: 'slug', current: t.slug },
      description: t.description,
      order: t.order,
    })
  }
  console.log(`✓ ${eventTypes.length} typów imprez zapisanych`)

  console.log('Seedowanie 4 sal eventowych…')
  for (const h of halls) {
    await client.createOrReplace({
      _id: `eventHall-${h.slug}`,
      _type: 'eventHall',
      name: h.name,
      slug: { _type: 'slug', current: h.slug },
      capacity: h.capacity,
      description: h.description,
      order: h.order,
    })
  }
  console.log(`✓ ${halls.length} sal zapisanych`)

  console.log('Seedowanie eventsPage…')
  await client.createOrReplace({
    _id: 'eventsPage',
    _type: 'eventsPage',
    hero: {
      eyebrow: ls('Najlepsze imprezy', 'Best celebrations'),
      title: ls('Świętuj bez stresu.', 'Celebrate without the stress.'),
      subtitle: lt(
        'Ty cieszysz się każdą chwilą, my zajmujemy się resztą.',
        'You enjoy every moment — we handle the rest.',
      ),
      primaryCtaLabel: ls('Zarezerwuj termin', 'Book your date'),
      secondaryCtaLabel: ls('Zobacz sale', 'See halls'),
    },
    promiseSection: {
      leadText: lt(
        'Wiemy, jak bardzo organizacja wydarzeń potrafi stresować. Dlatego mamy prostą umowę.',
        'We know how stressful planning an event can be. That’s why our promise is simple.',
      ),
      highlightedText: lt(
        'Ty cieszysz się każdą chwilą i bawisz się z bliskimi, a my zajmujemy się wszystkim.',
        'You enjoy every moment with your loved ones, and we take care of everything.',
      ),
      tailText: lt(
        'Od przygotowania sali, przez pyszne jedzenie, po komfortowy nocleg dla Twoich gości.',
        'From setting the hall, through delicious food, to comfortable rooms for your guests.',
      ),
      leadTextMobile: lt(
        'Wiemy, jak bardzo organizacja wydarzeń potrafi stresować. Dlatego mamy prostą umowę.',
        'We know how stressful planning an event can be. That’s why our promise is simple.',
      ),
      highlightedTextMobile: lt(
        'Ty cieszysz się każdą chwilą i bawisz się z bliskimi, a my zajmujemy się wszystkim.',
        'You enjoy every moment with your loved ones, and we take care of everything.',
      ),
      ctaLabel: ls('Zarezerwuj termin', 'Book your date'),
    },
    eventTypesSection: {
      eyebrow: ls('Organizujemy', 'We host'),
      title: ls(
        'Każda okazja zasługuje na wyjątkowe świętowanie',
        'Every occasion deserves a memorable celebration',
      ),
      description: lt(
        'W Sezamie każda uroczystość ma swój klimat i swoją historię.',
        'At Sezam every celebration carries its own mood and story.',
      ),
    },
    eventTypes: eventTypes.map((t) => ({
      _type: 'reference',
      _ref: `eventType-${t.slug}`,
      _key: `etype-${t.slug}`,
    })),
    hallsSection: {
      eyebrow: ls('Atmosfera', 'Atmosphere'),
      title: ls(
        'Cztery sale na imprezy okolicznościowe w Stalowej Woli',
        'Four halls for celebrations in Stalowa Wola',
      ),
      description: lt(
        'Znajdziesz u nas przestrzeń dopasowaną do każdej uroczystości.',
        'You’ll find a space tailored to every kind of celebration.',
      ),
    },
    halls: halls.map((h) => ({
      _type: 'reference',
      _ref: `eventHall-${h.slug}`,
      _key: `hall-${h.slug}`,
    })),
    hotelUpsellSection: {
      eyebrow: ls('Nocleg na miejscu', 'Stay on-site'),
      title: ls('Goście z daleka? Zarezerwuj nocleg.', 'Out-of-town guests? Book their rooms.'),
      description: lt(
        'Zapomnij o logistyce i szukaniu noclegów. Dysponujemy 70 komfortowymi pokojami. Zarezerwuj salę, wyśmienite jedzenie oraz nocleg dla Twoich gości w Stalowej Woli.',
        'Forget the logistics of finding hotels. We have 70 comfortable rooms on-site. Book the hall, the food and the rooms for your guests in Stalowa Wola in one place.',
      ),
      ctaLabel: ls('Zarezerwuj nocleg', 'Book a room'),
    },
    cateringSection: {
      eyebrow: ls('Katering', 'Catering'),
      title: ls('Menu, które zachwyci Twoich gości', 'A menu your guests will love'),
      description: lt(
        'Gotujemy ze świeżych, naturalnych składników od lokalnych dostawców z okolic Stalowej Woli.\n\nMasz gości na diecie bezglutenowej lub wegetariańskiej? Żaden problem. Dopasujemy menu tak, żeby każdy przy stole czuł się zadbany.',
        'We cook with fresh, natural ingredients from local producers around Stalowa Wola.\n\nGuests on a gluten-free or vegetarian diet? No problem. We’ll adjust the menu so everyone at the table feels looked after.',
      ),
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
    stepsSection: {
      eyebrow: ls('Zaczynamy', 'How we begin'),
      title: ls('Prosty proces rezerwacji', 'A simple booking process'),
      steps: [
        {
          _key: 'step-1',
          text: lt(
            'Zadzwoń lub napisz. Ustalimy termin i szczegóły.',
            'Call or write. We’ll agree on the date and details.',
          ),
        },
        {
          _key: 'step-2',
          text: lt(
            'Dopasujemy ofertę do Twoich potrzeb i budżetu.',
            'We tailor the offer to your needs and budget.',
          ),
        },
        {
          _key: 'step-3',
          text: lt(
            'Przyjedź i świętuj. Resztą zajmuje się Sezam.',
            'Just arrive and celebrate. Sezam handles the rest.',
          ),
        },
      ],
    },
    reservationSection: {
      eyebrow: ls('Rezerwacja', 'Reservations'),
      title: ls(
        'Zarezerwuj salę na wesele w Stalowej Woli',
        'Book your wedding hall in Stalowa Wola',
      ),
      description: lt(
        'Zadzwoń, a my sprawdzimy dostępność i odpowiemy na wszystkie pytania.',
        'Give us a call — we’ll check availability and answer all your questions.',
      ),
      formInvitationTitle: ls('Wolisz napisać?', 'Prefer to write?'),
      formInvitationText: lt(
        'Wypełnij formularz, a my skontaktujemy się tego samego dnia.',
        'Fill in the form and we’ll get back to you the same day.',
      ),
      ctaLabel: ls('Zarezerwuj salę', 'Book the hall'),
    },
    seo: {
      _type: 'seoMeta',
      metaTitle: {
        pl: 'Sezam — imprezy, wesela, komunie i urodziny w Stalowej Woli',
        en: 'Sezam — weddings, communions, birthdays in Stalowa Wola',
      },
      metaDescription: {
        pl: 'Wesela do 200 osób, komunie, urodziny i imprezy firmowe w Zajeździe Sezam w Stalowej Woli. Cztery sale, autorska kuchnia i 70 pokoi w jednym kompleksie.',
        en: 'Weddings up to 200 guests, communions, birthdays and corporate events at Zajazd Sezam in Stalowa Wola. Four halls, in-house cuisine and 70 rooms in one place.',
      },
      noIndex: false,
    },
  })
  console.log('✓ eventsPage zapisany')
}

await main()
