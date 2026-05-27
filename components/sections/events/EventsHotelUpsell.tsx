import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
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
        <Reveal>
          <header className="flex flex-col items-center gap-4">
            {eyebrow && (
              <p className="text-text-inverse text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text-inverse max-w-3xl text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </header>
        </Reveal>
        {description && (
          <Reveal delay={100}>
            <p className="text-text-inverse/80 max-w-3xl text-base leading-[1.2] md:text-lg">
              {description}
            </p>
          </Reveal>
        )}
        {ctaLabel && (
          <Reveal delay={200}>
            <ReservationCtaButton tab="room" variant="outline-light">
              {ctaLabel}
            </ReservationCtaButton>
          </Reveal>
        )}
      </div>
    </section>
  )
}
