import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
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
    <section className="bg-surface flex min-h-[800px] w-full items-center justify-end py-20 md:py-32">
      <div className="layout-container flex flex-col gap-10">
        <Reveal>
          <p className="text-text text-[32px] leading-tight font-normal tracking-[-0.03em]">
            {lead} {highlight && <span className="font-bold">{highlight}</span>} {tail}
          </p>
        </Reveal>
        {ctaLabel && (
          <Reveal delay={150}>
            <ReservationCtaButton tab="event" variant="outline-dark" className="w-full md:w-auto">
              {ctaLabel}
            </ReservationCtaButton>
          </Reveal>
        )}
      </div>
    </section>
  )
}
