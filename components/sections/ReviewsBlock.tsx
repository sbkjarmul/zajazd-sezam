import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { getGoogleReviews } from '@/lib/googleReviews'
import { Reveal } from '@/components/Reveal'
import { ReviewsCarousel } from './ReviewsCarousel'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['reviewsBlock']
  locale: Locale
}

// Wg Figma 676:1606: bg cream, py-80, gap-54 między header a carousel.
// Header text-center; eyebrow 24px, h2 64px tracking-[-3px], sub "4.4/5 Google · 1100+ opinii" 20px.
// Karuzela zaimplementowana jako client component (ReviewsCarousel) z scroll handlerami.
export async function ReviewsBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const reviews = await getGoogleReviews()

  const ratingLabel = locale === 'pl' ? 'Co mówią nasi goście?' : 'What our guests say?'
  const basedOnLabel =
    locale === 'pl'
      ? `Na podstawie ${reviews.userRatingsTotal}+ opinii.`
      : `Based on ${reviews.userRatingsTotal}+ reviews.`

  return (
    <section className="bg-bg py-16 md:py-20">
      <div className="layout-container flex flex-col gap-10 md:gap-[54px]">
        <Reveal>
          <header className="mx-auto flex max-w-[874px] flex-col items-center gap-3 text-center md:gap-4">
            {eyebrow && (
              <p className="text-text wide:text-lg text-base tracking-normal uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text text-2xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
            <div className="text-text mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-base md:text-xl">
              <span>{reviews.rating.toFixed(1)}/5</span>
              <span className="font-bold">Google</span>
              <span>{basedOnLabel}</span>
            </div>
          </header>
        </Reveal>

        <Reveal delay={120}>
          <ReviewsCarousel
            reviews={reviews.reviews}
            locale={locale}
            placeholderLabel={ratingLabel}
          />
        </Reveal>
      </div>
    </section>
  )
}
