/**
 * Usuwa pauzy (em dash "—") z odpowiedzi FAQ na /restauracja, /hotel
 * i /imprezy-okolicznosciowe. Kazde zdanie przepisane recznie, zeby czytalo
 * sie naturalnie bez myslnika (kropka / przecinek / dwukropek zaleznie od roli,
 * jaka pelnila pauza), a nie mechanicznym replace.
 *
 * NIE rusza polpauzy w zakresach liczbowych ("1-4 osoby" zapisane jako 1–4) —
 * to prawidlowy znak zakresu, nie pauza retoryczna.
 *
 * Bezpieczenstwo: kazdy wpis ma `from` (dokladna aktualna wartosc) i `to`.
 * Jesli tresc w Sanity nie zgadza sie co do znaku, skrypt przerywa bez zapisu —
 * nic nie nadpisuje na slepo.
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-faq-remove-em-dashes.ts
 *   (dopisz --dry, zeby tylko zobaczyc diff bez zapisu)
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
const dryRun = process.argv.includes('--dry')

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, apiVersion: '2026-05-16', token, useCdn: false })

type Edit = { doc: string; index: number; locale: 'pl' | 'en'; from: string; to: string }

const edits: Edit[] = [
  // --- eventsPage ---
  {
    doc: 'eventsPage',
    index: 0,
    locale: 'pl',
    from: 'Dysponujemy czterema salami różnej wielkości — organizujemy wesela nawet do 200 osób, a także komunie, chrzciny, urodziny, stypy i imprezy firmowe.',
    to: 'Dysponujemy czterema salami różnej wielkości. Organizujemy wesela nawet do 200 osób, a także komunie, chrzciny, urodziny, stypy i imprezy firmowe.',
  },
  {
    doc: 'eventsPage',
    index: 0,
    locale: 'en',
    from: 'We have four halls of different sizes — we host weddings for up to 200 guests, as well as communions, christenings, birthdays, wakes and corporate events.',
    to: 'We have four halls of different sizes. We host weddings for up to 200 guests, as well as communions, christenings, birthdays, wakes and corporate events.',
  },
  {
    doc: 'eventsPage',
    index: 2,
    locale: 'pl',
    from: 'Tak — potrawy przygotowuje nasza autorska kuchnia. Menu przyjęcia ustalamy indywidualnie, z uwzględnieniem Waszych preferencji.',
    to: 'Tak, potrawy przygotowuje nasza autorska kuchnia. Menu przyjęcia ustalamy indywidualnie, z uwzględnieniem Waszych preferencji.',
  },
  {
    doc: 'eventsPage',
    index: 2,
    locale: 'en',
    from: 'Yes — dishes are prepared by our in-house kitchen. We arrange the event menu individually, taking your preferences into account.',
    to: 'Yes, dishes are prepared by our in-house kitchen. We arrange the event menu individually, taking your preferences into account.',
  },
  {
    doc: 'eventsPage',
    index: 4,
    locale: 'pl',
    from: 'Zadzwoń do nas lub wypełnij formularz zapytania o event — odezwiemy się z wolnymi terminami i wyceną dopasowaną do Twojej imprezy.',
    to: 'Zadzwoń do nas lub wypełnij formularz zapytania o event. Odezwiemy się z wolnymi terminami i wyceną dopasowaną do Twojej imprezy.',
  },
  {
    doc: 'eventsPage',
    index: 4,
    locale: 'en',
    from: "Call us or fill in the event inquiry form — we'll get back to you with available dates and a quote tailored to your event.",
    to: "Call us or fill in the event inquiry form. We'll get back to you with available dates and a quote tailored to your event.",
  },

  // --- hotelPage ---
  {
    doc: 'hotelPage',
    index: 2,
    locale: 'pl',
    from: 'Dysponujemy 70 komfortowymi miejscami noclegowymi — od pokoi Standard i Komfort (1–4 osoby) po apartament. Każdy pokój ma własną łazienkę i WiFi.',
    to: 'Dysponujemy 70 komfortowymi miejscami noclegowymi, od pokoi Standard i Komfort (1–4 osoby) po apartament. Każdy pokój ma własną łazienkę i WiFi.',
  },
  {
    doc: 'hotelPage',
    index: 2,
    locale: 'en',
    from: 'We offer 70 comfortable beds — from Standard and Comfort rooms (1–4 guests) to an apartment. Every room has a private bathroom and WiFi.',
    to: 'We offer 70 comfortable beds, from Standard and Comfort rooms (1–4 guests) to an apartment. Every room has a private bathroom and WiFi.',
  },
  {
    doc: 'hotelPage',
    index: 4,
    locale: 'pl',
    from: 'Tak — w kompleksie działają restauracja i bistro, więc śniadanie, obiad czy kolację zjesz bez wychodzenia z hotelu.',
    to: 'Tak, w kompleksie działają restauracja i bistro, więc śniadanie, obiad czy kolację zjesz bez wychodzenia z hotelu.',
  },
  {
    doc: 'hotelPage',
    index: 4,
    locale: 'en',
    from: 'Yes — the complex has a restaurant and a bistro, so you can have breakfast, lunch or dinner without leaving the hotel.',
    to: 'Yes, the complex has a restaurant and a bistro, so you can have breakfast, lunch or dinner without leaving the hotel.',
  },
  {
    doc: 'hotelPage',
    index: 5,
    locale: 'pl',
    from: 'Do dyspozycji gości jest sauna, bezpłatne WiFi w całym obiekcie oraz parking — idealne warunki na wypoczynek i spokojną pracę.',
    to: 'Do dyspozycji gości jest sauna, bezpłatne WiFi w całym obiekcie oraz parking. To idealne warunki na wypoczynek i spokojną pracę.',
  },
  {
    doc: 'hotelPage',
    index: 5,
    locale: 'en',
    from: 'Guests can use the sauna, free WiFi throughout the property and parking — ideal for both rest and quiet work.',
    to: 'Guests can use the sauna, free WiFi throughout the property and parking. These are ideal conditions for both rest and quiet work.',
  },

  // --- restaurantPage ---
  {
    doc: 'restaurantPage',
    index: 1,
    locale: 'pl',
    from: 'Specjalizujemy się w klasycznej kuchni polskiej przygotowywanej na bazie naturalnych składników od lokalnych dostawców. W karcie znajdziecie sezonowe sałatki, dania mięsne, zupy oraz domowe desery — wszystko gotowane świeżo, każdego dnia.',
    to: 'Specjalizujemy się w klasycznej kuchni polskiej przygotowywanej na bazie naturalnych składników od lokalnych dostawców. W karcie znajdziecie sezonowe sałatki, dania mięsne, zupy oraz domowe desery. Wszystko gotowane świeżo, każdego dnia.',
  },
  {
    doc: 'restaurantPage',
    index: 1,
    locale: 'en',
    from: 'We specialise in classic Polish cuisine prepared from natural ingredients sourced from local suppliers. Our menu features seasonal salads, meat dishes, soups and homemade desserts — all cooked fresh, every day.',
    to: 'We specialise in classic Polish cuisine prepared from natural ingredients sourced from local suppliers. Our menu features seasonal salads, meat dishes, soups and homemade desserts. All cooked fresh, every day.',
  },
  {
    doc: 'restaurantPage',
    index: 2,
    locale: 'pl',
    from: 'Tak. Organizujemy przyjęcia okolicznościowe — komunie, chrzciny, urodziny, stypy oraz spotkania firmowe. Dysponujemy salami o różnej pojemności, a nasz zespół pomoże dobrać menu i oprawę do charakteru wydarzenia. Szczegóły ustalimy telefonicznie.',
    to: 'Tak. Organizujemy przyjęcia okolicznościowe: komunie, chrzciny, urodziny, stypy oraz spotkania firmowe. Dysponujemy salami o różnej pojemności, a nasz zespół pomoże dobrać menu i oprawę do charakteru wydarzenia. Szczegóły ustalimy telefonicznie.',
  },
  {
    doc: 'restaurantPage',
    index: 2,
    locale: 'en',
    from: 'Yes. We host special occasions — communions, christenings, birthdays, wakes and corporate gatherings. We have rooms of varying capacity, and our team will help tailor the menu and setting to the character of your event. We arrange the details by phone.',
    to: 'Yes. We host special occasions: communions, christenings, birthdays, wakes and corporate gatherings. We have rooms of varying capacity, and our team will help tailor the menu and setting to the character of your event. We arrange the details by phone.',
  },
  {
    doc: 'restaurantPage',
    index: 3,
    locale: 'pl',
    from: 'Wybrane dania z naszej karty dostępne są na wynos — wystarczy złożyć zamówienie telefonicznie. Zasięg oraz aktualną ofertę dowozu na terenie Stalowej Woli potwierdzi nasza obsługa podczas rozmowy.',
    to: 'Wybrane dania z naszej karty dostępne są na wynos. Wystarczy złożyć zamówienie telefonicznie, a zasięg oraz aktualną ofertę dowozu na terenie Stalowej Woli potwierdzi nasza obsługa podczas rozmowy.',
  },
  {
    doc: 'restaurantPage',
    index: 3,
    locale: 'en',
    from: 'Selected dishes from our menu are available for takeaway — simply place an order by phone. Our staff will confirm the delivery range and current offer within Stalowa Wola during the call.',
    to: 'Selected dishes from our menu are available for takeaway. Simply place an order by phone and our staff will confirm the delivery range and current offer within Stalowa Wola during the call.',
  },
  {
    doc: 'restaurantPage',
    index: 4,
    locale: 'pl',
    from: 'Zdecydowanie tak. Jesteśmy miejscem przyjaznym rodzinom — mamy przestronne wnętrze, wygodne miejsca dla najmłodszych oraz dania, które smakują również dzieciom. Chętnie przygotujemy mniejsze porcje na życzenie.',
    to: 'Zdecydowanie tak. Jesteśmy miejscem przyjaznym rodzinom: mamy przestronne wnętrze, wygodne miejsca dla najmłodszych oraz dania, które smakują również dzieciom. Chętnie przygotujemy mniejsze porcje na życzenie.',
  },
  {
    doc: 'restaurantPage',
    index: 4,
    locale: 'en',
    from: 'Absolutely. We are a family-friendly venue — with a spacious interior, comfortable seating for the little ones and dishes children enjoy too. We are happy to prepare smaller portions on request.',
    to: 'Absolutely. We are a family-friendly venue with a spacious interior, comfortable seating for the little ones and dishes children enjoy too. We are happy to prepare smaller portions on request.',
  },
  {
    doc: 'restaurantPage',
    index: 6,
    locale: 'pl',
    from: 'Zapraszamy gości z grzecznymi czworonogami — w sezonie najwygodniej odpoczniecie razem na naszym ogródku. Prosimy jedynie o wcześniejszy kontakt telefoniczny, aby przygotować dla Was odpowiednie miejsce.',
    to: 'Zapraszamy gości z grzecznymi czworonogami. W sezonie najwygodniej odpoczniecie razem na naszym ogródku. Prosimy jedynie o wcześniejszy kontakt telefoniczny, aby przygotować dla Was odpowiednie miejsce.',
  },
  {
    doc: 'restaurantPage',
    index: 6,
    locale: 'en',
    from: 'We welcome guests with well-behaved dogs — in season the garden terrace is the most comfortable spot to relax together. We only ask that you call ahead so we can prepare the right table for you.',
    to: 'We welcome guests with well-behaved dogs. In season the garden terrace is the most comfortable spot to relax together. We only ask that you call ahead so we can prepare the right table for you.',
  },
]

type FaqDoc = { _id: string; faqSection?: { items?: { _key: string }[] } }

async function main() {
  const docIds = [...new Set(edits.map((e) => e.doc))]
  const docs: FaqDoc[] = await client.fetch('*[_id in $ids]{_id, faqSection}', { ids: docIds })
  const byId = new Map(docs.map((d) => [d._id, d]))

  // Walidacja PRZED jakimkolwiek zapisem: kazdy `from` musi zgadzac sie co do znaku.
  const tx = client.transaction()
  for (const e of edits) {
    const doc = byId.get(e.doc)
    if (!doc) throw new Error(`Brak dokumentu ${e.doc}`)
    const item = doc.faqSection?.items?.[e.index] as
      | { _key: string; answer?: Record<string, string> }
      | undefined
    if (!item) throw new Error(`Brak items[${e.index}] w ${e.doc}`)
    const current = item.answer?.[e.locale]
    if (current !== e.from) {
      throw new Error(
        `Niezgodna tresc ${e.doc} items[${e.index}].answer.${e.locale}\n  w Sanity: ${current}\n  oczekiwano: ${e.from}`,
      )
    }
    if (e.to.includes('—')) throw new Error(`Docelowy tekst nadal ma pauze: ${e.to}`)

    console.log(`${e.doc} [${e.index}] ${e.locale}`)
    console.log(`  - ${e.from}`)
    console.log(`  + ${e.to}\n`)

    tx.patch(e.doc, (p) =>
      p.set({ [`faqSection.items[_key=="${item._key}"].answer.${e.locale}`]: e.to }),
    )
  }

  if (dryRun) {
    console.log(`DRY RUN — ${edits.length} zmian gotowych, nic nie zapisano.`)
    return
  }

  await tx.commit()
  console.log(`Zapisano ${edits.length} zmian w ${docIds.length} dokumentach.`)
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
