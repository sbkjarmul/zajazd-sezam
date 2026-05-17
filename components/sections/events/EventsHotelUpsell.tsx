import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['hotelUpsellSection']
  locale: Locale
}

export function EventsHotelUpsell({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      className="text-text-inverse w-full py-24 md:py-40"
      style={{ background: 'var(--color-ruby)' }}
    >
      <div className="layout-container flex max-w-[1280px] flex-col items-center gap-10 text-center">
        <header className="flex flex-col items-center gap-3">
          {eyebrow && (
            <p className="text-text-inverse text-base tracking-normal uppercase">{eyebrow}</p>
          )}
          {title && (
            <h2 className="text-text-inverse max-w-3xl text-4xl leading-tight font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
              {title}
            </h2>
          )}
        </header>
        {description && (
          <p className="max-w-3xl text-lg leading-relaxed text-[#f6f5efcc]">{description}</p>
        )}
        {ctaLabel && (
          <ReservationCtaButton tab="room" variant="outline-light">
            {ctaLabel}
          </ReservationCtaButton>
        )}
      </div>
    </section>
  )
}
