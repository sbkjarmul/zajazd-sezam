/**
 * Dodaje faqSection (naglowek + realne pytania PL/EN, lokalne pod Stalowa Wole)
 * do hotelPage i eventsPage. Tresc grounded w znanych faktach (4 sale, 200 osob,
 * 70 miejsc, wlasna kuchnia, 24/7, check-in/out, sauna, parking, adres).
 *
 * Nieniszczaco: setIfMissing na faqSection (nie klobruje recznej edycji w Studio).
 * Wzorzec jak patch-restaurant-redesign.ts (FAQ restauracji tez trafil patchem).
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-faq-hotel-events.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, apiVersion: '2026-05-16', token, useCdn: false })

const ls = (pl: string, en: string) => ({ _type: 'localeString', pl, en })
const lt = (pl: string, en: string) => ({ _type: 'localeText', pl, en })
const qa = (key: string, qPl: string, qEn: string, aPl: string, aEn: string) => ({
  _key: key,
  question: ls(qPl, qEn),
  answer: lt(aPl, aEn),
})

const hotelFaq = {
  heading: ls('Masz *pytania*\no pobyt?', 'Got *questions*\nabout your stay?'),
  items: [
    qa(
      'h1',
      'Gdzie znajduje się hotel i czy jest parking?',
      'Where is the hotel and is there parking?',
      'Hotel Sezam mieści się przy ul. Komisji Edukacji Narodowej 51 w Stalowej Woli. Dla gości dostępny jest bezpłatny parking na miejscu.',
      'Hotel Sezam is at ul. Komisji Edukacji Narodowej 51 in Stalowa Wola. Free on-site parking is available for guests.',
    ),
    qa(
      'h2',
      'O której godzinie jest zameldowanie i wymeldowanie?',
      'What are the check-in and check-out times?',
      'Zameldowanie od godziny 14:00, wymeldowanie do 11:00. Recepcja jest czynna całą dobę, więc odbiór kluczy możliwy jest o dowolnej porze.',
      'Check-in from 2:00 PM, check-out by 11:00 AM. Reception is open 24/7, so you can pick up your keys at any time.',
    ),
    qa(
      'h3',
      'Jakie pokoje są dostępne?',
      'What rooms are available?',
      'Dysponujemy 70 komfortowymi miejscami noclegowymi — od pokoi Standard i Komfort (1–4 osoby) po apartament. Każdy pokój ma własną łazienkę i WiFi.',
      'We offer 70 comfortable beds — from Standard and Comfort rooms (1–4 guests) to an apartment. Every room has a private bathroom and WiFi.',
    ),
    qa(
      'h4',
      'Czy recepcja jest czynna całą dobę?',
      'Is the reception open around the clock?',
      'Tak, recepcja Zajazdu Sezam pracuje 24 godziny na dobę, 7 dni w tygodniu.',
      'Yes, the Zajazd Sezam reception is open 24 hours a day, 7 days a week.',
    ),
    qa(
      'h5',
      'Czy na miejscu można zjeść?',
      'Can I eat on-site?',
      'Tak — w kompleksie działają restauracja i bistro, więc śniadanie, obiad czy kolację zjesz bez wychodzenia z hotelu.',
      'Yes — the complex has a restaurant and a bistro, so you can have breakfast, lunch or dinner without leaving the hotel.',
    ),
    qa(
      'h6',
      'Czy hotel ma saunę i inne udogodnienia?',
      'Does the hotel have a sauna and other amenities?',
      'Do dyspozycji gości jest sauna, bezpłatne WiFi w całym obiekcie oraz parking — idealne warunki na wypoczynek i spokojną pracę.',
      'Guests can use the sauna, free WiFi throughout the property and parking — ideal for both rest and quiet work.',
    ),
  ],
}

const eventsFaq = {
  heading: ls('Masz *pytania*\no przyjęcie?', 'Got *questions*\nabout your event?'),
  items: [
    qa(
      'e1',
      'Na ile osób są sale i jakie imprezy organizujecie?',
      'How large are the halls and what events do you host?',
      'Dysponujemy czterema salami różnej wielkości — organizujemy wesela nawet do 200 osób, a także komunie, chrzciny, urodziny, stypy i imprezy firmowe.',
      'We have four halls of different sizes — we host weddings for up to 200 guests, as well as communions, christenings, birthdays, wakes and corporate events.',
    ),
    qa(
      'e2',
      'Czy zapewniacie nocleg dla gości przyjęcia?',
      'Do you provide lodging for event guests?',
      'Tak, na miejscu mamy 70 miejsc noclegowych, więc goście z daleka mogą zostać na noc bez szukania hotelu w okolicy.',
      'Yes, we have 70 beds on-site, so out-of-town guests can stay overnight without looking for another hotel nearby.',
    ),
    qa(
      'e3',
      'Czy macie własną kuchnię i catering?',
      'Do you have your own kitchen and catering?',
      'Tak — potrawy przygotowuje nasza autorska kuchnia. Menu przyjęcia ustalamy indywidualnie, z uwzględnieniem Waszych preferencji.',
      'Yes — dishes are prepared by our in-house kitchen. We arrange the event menu individually, taking your preferences into account.',
    ),
    qa(
      'e4',
      'Gdzie się znajdujecie i jak do Was dojechać?',
      'Where are you and how do I get there?',
      'Zajazd Sezam leży przy ul. Komisji Edukacji Narodowej 51 w Stalowej Woli, z dogodnym dojazdem z Niska, Tarnobrzega i okolic. Na miejscu jest parking.',
      'Zajazd Sezam is at ul. Komisji Edukacji Narodowej 51 in Stalowa Wola, with easy access from Nisko, Tarnobrzeg and the surrounding area. On-site parking is available.',
    ),
    qa(
      'e5',
      'Jak zarezerwować termin lub zapytać o ofertę?',
      'How do I book a date or ask for an offer?',
      'Zadzwoń do nas lub wypełnij formularz zapytania o event — odezwiemy się z wolnymi terminami i wyceną dopasowaną do Twojej imprezy.',
      "Call us or fill in the event inquiry form — we'll get back to you with available dates and a quote tailored to your event.",
    ),
    qa(
      'e6',
      'Z jakim wyprzedzeniem najlepiej rezerwować?',
      'How far in advance should I book?',
      'Popularne terminy weselne rezerwują się z dużym wyprzedzeniem, dlatego warto zapytać o dostępność jak najwcześniej. Mniejsze przyjęcia zorganizujemy też w krótszym terminie.',
      "Popular wedding dates book up well in advance, so it's best to ask about availability as early as possible. Smaller events can also be arranged on shorter notice.",
    ),
  ],
}

async function main() {
  await client.patch('hotelPage').setIfMissing({ faqSection: hotelFaq }).commit()
  console.log('✓ hotelPage.faqSection ustawiony')
  await client.patch('eventsPage').setIfMissing({ faqSection: eventsFaq }).commit()
  console.log('✓ eventsPage.faqSection ustawiony')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
