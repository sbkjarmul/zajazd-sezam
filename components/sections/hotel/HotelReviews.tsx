import { Quote } from 'lucide-react'
import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['reviewsSection']
  locale: Locale
}

// F8 podepnie prawdziwe Google Reviews (lib/googleReviews.ts).
// Layout zgodny z Figma 676:555 — 4 review cards w rzędzie, ostatnia z roundedem.
export function HotelReviews({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const ratingValue = data.ratingValue
  const ratingSource = data.ratingSource
  const ratingCount = pickLocale(data.ratingCount, locale)

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="layout-container flex flex-col gap-12 md:gap-14">
        <header className="flex flex-col items-center gap-4 text-center">
          {eyebrow && <p className="text-text text-base tracking-normal uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="text-text max-w-3xl text-4xl leading-[1.1] font-light tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-[64px]">
              {title}
            </h2>
          )}
          {(ratingValue || ratingSource || ratingCount) && (
            <p className="text-text-muted mt-2 flex flex-wrap items-baseline justify-center gap-2 text-2xl">
              {ratingValue && <span className="text-text text-4xl font-light">{ratingValue}</span>}
              {ratingSource && <span className="text-text-muted text-2xl">{ratingSource}</span>}
              {ratingCount && <span className="text-text-muted text-base">· {ratingCount}</span>}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="bg-surface flex flex-col gap-6 rounded-md p-8">
            <Quote className="text-accent size-10" aria-hidden />
            <p className="text-text text-2xl leading-tight">
              {locale === 'pl' ? 'Co mówią nasi goście?' : 'What our guests say'}
            </p>
            <p className="text-text-muted text-sm">
              {locale === 'pl'
                ? 'Sekcja opinii zostanie zasilona z Google Reviews — zobaczysz najnowsze opinie 4★+.'
                : 'Reviews will populate from Google Reviews — you’ll see latest 4★+ entries.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
