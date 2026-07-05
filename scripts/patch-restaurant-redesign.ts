/**
 * Patch restaurantPage z nowym designem (Figma 967:35):
 *  - nagłówki z akcentem kursywą Westbourne (marker *tekst*),
 *  - sekcja FAQ (7 pytań PL+EN),
 *  - hasło dekoracyjne w stopce ("*Zjedz zdrowo*").
 *
 * Patch (nie createOrReplace) — zachowuje zdjęcia wgrane w Studio.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-restaurant-redesign.ts
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

const faqItems = [
  {
    _type: 'object',
    question: ls(
      'Gdzie znajduje się Restauracja Sezam w Stalowej Woli i czy dysponuje parkingiem?',
      'Where is Sezam Restaurant in Stalowa Wola and is there parking?',
    ),
    answer: lt(
      'Restauracja Sezam mieści się w dogodnej lokalizacji w Stalowej Woli przy ul. Komisji Edukacji Narodowej 51. Dla komfortu naszych gości zapewniamy duży, bezpłatny parking bezpośrednio przy lokalu, co ułatwia dojazd z każdej części miasta oraz okolic.',
      'Sezam Restaurant is conveniently located in Stalowa Wola at ul. Komisji Edukacji Narodowej 51. For our guests’ comfort we provide a large, free car park right by the venue, making it easy to reach us from anywhere in the city and the surrounding area.',
    ),
  },
  {
    _type: 'object',
    question: ls(
      'Jakie potrawy są specjalnością Restauracji Sezam?',
      'What dishes are the specialty of Sezam Restaurant?',
    ),
    answer: lt(
      'Specjalizujemy się w klasycznej kuchni polskiej przygotowywanej na bazie naturalnych składników od lokalnych dostawców. W karcie znajdziecie sezonowe sałatki, dania mięsne, zupy oraz domowe desery — wszystko gotowane świeżo, każdego dnia.',
      'We specialise in classic Polish cuisine prepared from natural ingredients sourced from local suppliers. Our menu features seasonal salads, meat dishes, soups and homemade desserts — all cooked fresh, every day.',
    ),
  },
  {
    _type: 'object',
    question: ls(
      'Czy w Restauracji Sezam w Stalowej Woli można zorganizować imprezę okolicznościową?',
      'Can I organise a special event at Sezam Restaurant in Stalowa Wola?',
    ),
    answer: lt(
      'Tak. Organizujemy przyjęcia okolicznościowe — komunie, chrzciny, urodziny, stypy oraz spotkania firmowe. Dysponujemy salami o różnej pojemności, a nasz zespół pomoże dobrać menu i oprawę do charakteru wydarzenia. Szczegóły ustalimy telefonicznie.',
      'Yes. We host special occasions — communions, christenings, birthdays, wakes and corporate gatherings. We have rooms of varying capacity, and our team will help tailor the menu and setting to the character of your event. We arrange the details by phone.',
    ),
  },
  {
    _type: 'object',
    question: ls(
      'Czy Restauracja Sezam oferuje jedzenie na dowóz na terenie Stalowej Woli?',
      'Does Sezam Restaurant offer food delivery in Stalowa Wola?',
    ),
    answer: lt(
      'Wybrane dania z naszej karty dostępne są na wynos — wystarczy złożyć zamówienie telefonicznie. Zasięg oraz aktualną ofertę dowozu na terenie Stalowej Woli potwierdzi nasza obsługa podczas rozmowy.',
      'Selected dishes from our menu are available for takeaway — simply place an order by phone. Our staff will confirm the delivery range and current offer within Stalowa Wola during the call.',
    ),
  },
  {
    _type: 'object',
    question: ls(
      'Czy Sezam to restauracja przyjazna dzieciom?',
      'Is Sezam a family-friendly restaurant?',
    ),
    answer: lt(
      'Zdecydowanie tak. Jesteśmy miejscem przyjaznym rodzinom — mamy przestronne wnętrze, wygodne miejsca dla najmłodszych oraz dania, które smakują również dzieciom. Chętnie przygotujemy mniejsze porcje na życzenie.',
      'Absolutely. We are a family-friendly venue — with a spacious interior, comfortable seating for the little ones and dishes children enjoy too. We are happy to prepare smaller portions on request.',
    ),
  },
  {
    _type: 'object',
    question: ls(
      'Czy w menu Restauracji Sezam znajdę dania wegetariańskie lub bezglutenowe?',
      'Are there vegetarian or gluten-free dishes on the Sezam menu?',
    ),
    answer: lt(
      'Tak. W naszej karcie nie brakuje propozycji wegetariańskich, a wybrane dania możemy przygotować w wersji bezglutenowej. O składzie i możliwych modyfikacjach chętnie poinformuje obsługa przy zamówieniu.',
      'Yes. Our menu includes plenty of vegetarian options, and selected dishes can be prepared gluten-free. Our staff will gladly advise on ingredients and possible adjustments when you order.',
    ),
  },
  {
    _type: 'object',
    question: ls(
      'Czy do Restauracji Sezam w Stalowej Woli można przyjść z psem?',
      'Are dogs allowed at Sezam Restaurant in Stalowa Wola?',
    ),
    answer: lt(
      'Zapraszamy gości z grzecznymi czworonogami — w sezonie najwygodniej odpoczniecie razem na naszym ogródku. Prosimy jedynie o wcześniejszy kontakt telefoniczny, aby przygotować dla Was odpowiednie miejsce.',
      'We welcome guests with well-behaved dogs — in season the garden terrace is the most comfortable spot to relax together. We only ask that you call ahead so we can prepare the right table for you.',
    ),
  },
]

async function main() {
  await client
    .patch('restaurantPage')
    .set({
      heroHeadline: ls('*Zjedz* w Sezamie', '*Eat* at Sezam'),
      'pitchSection.text': lt(
        'Robimy *najlepsze sałatki* w mieście.\nWpadnij z ekipą i przekonajcie się sami!',
        'We make *the best salads* in town.\nCome with your crew and see for yourself!',
      ),
      'craftSection.title': ls(
        '*Kulinarna sztuka*\nz lokalnych składników',
        '*Culinary craft*\nfrom local ingredients',
      ),
      'ambianceSection.title': ls(
        'Przytulne wnętrze oraz *cudowna atmosfera*',
        'A cosy interior and *a wonderful atmosphere*',
      ),
      'reservationSection.title': ls(
        'Zarezerwuj stolik dla\n*niezapomnianych chwil*',
        'Book a table for\n*unforgettable moments*',
      ),
      'reservationSection.description': lt(
        'Zadzwoń, a nasz zespół znajdzie dla Ciebie odpowiedni stolik.',
        'Call us and our team will find the right table for you.',
      ),
      faqSection: {
        _type: 'object',
        heading: ls('Znajdź *odpowiedzi*\nna Wasze pytania', 'Find *answers*\nto your questions'),
        items: faqItems,
      },
      footerTagline: ls('*Zjedz zdrowo*', '*Eat well*'),
    })
    .commit()
  console.log('✓ restaurantPage — redesign content zaktualizowany')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
