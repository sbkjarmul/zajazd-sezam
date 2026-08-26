/**
 * Opinie gości do taśmy na home / hotel / imprezy.
 *
 * Źródłem jest Sanity (typ dokumentu `review`), nie Google Places API.
 * Powód jest twardy: Places API oddaje maksymalnie 5 opinii i nie ma
 * paginacji — limit produktu, niezależny od klucza, billingu i weryfikacji
 * wizytówki. Dlatego opinie przepisujemy do CMS-u i traktujemy jak każdą inną
 * treść strony: redakcja panuje nad doborem, liczbą i kolejnością.
 *
 * Ten moduł zastąpił `lib/googleReviews.ts` (mock udający kształt odpowiedzi
 * Places API) — nazwa przestała cokolwiek znaczyć, skoro nic nie leci do Google.
 */

import { sanityClient } from '@/lib/sanity/client'
import { REVIEWS_QUERY } from '@/lib/sanity/queries'
import { relativeTimeDescription } from '@/lib/format/relativeTime'
import type { Locale } from '@/i18n/routing'

export type GuestReview = {
  authorName: string
  /** Profil Google recenzenta — gdy jest, nazwisko renderuje się jako link. */
  authorUrl?: string
  rating: number
  /** Gotowy podpis "2 miesiące temu" — liczony z `publishedAt` przy pobraniu. */
  relativeTimeDescription: Record<Locale, string>
  text: Record<Locale, string>
}

export async function getReviews(): Promise<GuestReview[]> {
  const docs = await sanityClient.fetch(REVIEWS_QUERY)

  // Jeden punkt odniesienia dla wszystkich kart — inaczej opinie wystawione
  // tego samego dnia mogłyby dostać różne podpisy, gdyby render przeciął północ.
  const now = Date.now()

  return docs.flatMap((doc) => {
    const textPl = doc.text?.pl?.trim()
    // Opinia bez autora, treści PL albo daty jest niekompletna — pomijamy ją
    // zamiast renderować pustą kartę w taśmie.
    if (!doc.authorName || !textPl || !doc.publishedAt) return []

    return [
      {
        authorName: doc.authorName,
        authorUrl: doc.authorUrl ?? undefined,
        rating: doc.rating ?? 5,
        relativeTimeDescription: relativeTimeDescription(doc.publishedAt, now),
        text: { pl: textPl, en: doc.text?.en?.trim() || textPl },
      },
    ]
  })
}
