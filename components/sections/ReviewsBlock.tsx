import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Quote } from 'lucide-react'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['reviewsBlock']
  locale: Locale
}

// Karty z prawdziwymi opiniami zostaną podpięte do Google Places API w F8
// (lib/googleReviews.ts). Na razie statyczna placeholder-karta-CTA.
export function ReviewsBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const ratingValue = data.ratingValue
  const ratingSource = data.ratingSource
  const ratingCount = pickLocale(data.ratingCount, locale)

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="layout-container flex flex-col gap-12">
        <header className="flex flex-col items-center gap-4 text-center">
          {eyebrow && <p className="text-accent text-sm tracking-normal uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="text-text max-w-3xl text-4xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em]">
              {title}
            </h2>
          )}
          {(ratingValue || ratingSource || ratingCount) && (
            <p className="text-text-muted mt-2 flex items-baseline gap-2 text-2xl">
              {ratingValue && <span className="text-text text-4xl font-light">{ratingValue}</span>}
              {ratingSource && <span className="text-text-muted text-2xl">{ratingSource}</span>}
              {ratingCount && <span className="text-text-muted text-base">· {ratingCount}</span>}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-surface flex flex-col gap-6 rounded-md p-8">
            <Quote className="text-accent size-10" aria-hidden />
            <p className="text-text text-2xl leading-[1.2]">
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
