import type { CONTACT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<CONTACT_PAGE_QUERY_RESULT>['finalCta']
  locale: Locale
}

export function ContactFinalCta({ data, locale }: Props) {
  if (!data) return null
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  if (!title && !ctaLabel) return null

  return (
    <section
      className="text-text-inverse w-full py-24 md:py-32"
      style={{ background: 'var(--color-dark)' }}
    >
      <div className="layout-container flex max-w-[1080px] flex-col items-center gap-8 text-center">
        {title && (
          <h2 className="text-text-inverse max-w-3xl text-4xl leading-none font-light tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="max-w-2xl text-lg leading-relaxed text-[#f6f5efcc]">{description}</p>
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
