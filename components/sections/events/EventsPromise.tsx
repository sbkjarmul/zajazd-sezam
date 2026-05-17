import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['promiseSection']
  locale: Locale
}

export function EventsPromise({ data, locale }: Props) {
  if (!data) return null
  const lead = pickLocale(data.leadText, locale)
  const highlight = pickLocale(data.highlightedText, locale)
  const tail = pickLocale(data.tailText, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  if (!lead && !highlight && !tail) return null

  return (
    <section className="bg-surface flex w-full justify-end py-20 md:py-32">
      <div className="layout-container flex flex-col gap-10">
        <p className="text-text text-3xl leading-tight font-light tracking-tight md:text-5xl">
          {lead} {highlight && <span className="font-medium">{highlight}</span>} {tail}
        </p>
        {ctaLabel && (
          <div>
            <ReservationCtaButton tab="event" variant="outline-dark">
              {ctaLabel}
            </ReservationCtaButton>
          </div>
        )}
      </div>
    </section>
  )
}
