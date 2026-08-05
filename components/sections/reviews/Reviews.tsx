import type {
  HOMEPAGE_QUERY_RESULT,
  HOTEL_PAGE_QUERY_RESULT,
  EVENTS_PAGE_QUERY_RESULT,
} from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { getGoogleReviews } from '@/lib/googleReviews'
import { Reveal } from '@/components/Reveal'
import { RevealText } from '@/components/RevealText'
import { ReviewsTrack } from './ReviewsTrack'

// Wspolny ksztalt sekcji opinii z Sanity — identyczny na homepage (`reviewsBlock`)
// oraz hotelu / imprezach (`reviewsSection`). Naglowek + podsumowanie oceny;
// pojedyncze opinie pochodza z Google (mock `getGoogleReviews`, F8: prawdziwe API).
type ReviewsData =
  | NonNullable<HOMEPAGE_QUERY_RESULT>['reviewsBlock']
  | NonNullable<HOTEL_PAGE_QUERY_RESULT>['reviewsSection']
  | NonNullable<EVENTS_PAGE_QUERY_RESULT>['reviewsSection']

type Props = {
  data: ReviewsData
  locale: Locale
}

// Jeden komponent opinii dla calej strony (Figma 1134:43). Naglowek wysrodkowany
// z Sanity, pod nim pelnoszerokosciowa tasma kart, ktora sama przesuwa sie w
// prawo w zapetlonej animacji (ReviewsTrack). Zastapil osobne ReviewsBlock /
// HotelReviews / EventsReviews.
export async function Reviews({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const reviews = await getGoogleReviews()

  if (reviews.reviews.length === 0 && !title) return null

  // Podsumowanie oceny: preferuj tresc z Sanity, w razie braku wylicz z mocka.
  const ratingValue = data.ratingValue || `${reviews.rating.toFixed(1)}/5`
  const ratingSource = data.ratingSource || 'Google'
  const ratingCount =
    pickLocale(data.ratingCount, locale) ||
    (locale === 'pl'
      ? `Na podstawie ${reviews.userRatingsTotal}+ opinii.`
      : `Based on ${reviews.userRatingsTotal}+ reviews.`)

  return (
    <section data-header-theme="light" className="bg-bg py-16 md:py-20">
      <div className="flex flex-col gap-10 md:gap-[54px]">
        <Reveal>
          <div className="layout-container">
            <header className="mx-auto flex max-w-[874px] flex-col items-center gap-3 text-center md:gap-4">
              {eyebrow && (
                <p className="text-text wide:text-lg text-base tracking-normal uppercase leading-[normal]">
                  {eyebrow}
                </p>
              )}
              {title && (
                <RevealText
                  as="h2"
                  className="text-text text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl"
                >
                  {title}
                </RevealText>
              )}
              <div className="text-text mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-base md:text-xl">
                <span>{ratingValue}</span>
                <span className="font-bold">{ratingSource}</span>
                <span>{ratingCount}</span>
              </div>
            </header>
          </div>
        </Reveal>

        {/* Pelnoszerokosciowa tasma opinii — przesuwa sie sama w prawo. */}
        <Reveal delay={120}>
          <ReviewsTrack reviews={reviews.reviews} locale={locale} />
        </Reveal>
      </div>
    </section>
  )
}
