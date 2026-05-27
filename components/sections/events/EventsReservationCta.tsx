import type { EVENTS_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['reservationSection']
  settings: SITE_SETTINGS_QUERY_RESULT
  locale: Locale
}

export function EventsReservationCta({ data, settings, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const formTitle = pickLocale(data.formInvitationTitle, locale)
  const formText = pickLocale(data.formInvitationText, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const phone = settings?.phone

  return (
    <section className="bg-bg w-full py-24 md:py-40">
      <div className="layout-container flex max-w-[1280px] flex-col items-center gap-10 px-4 text-center md:!px-4">
        <Reveal>
          <header className="flex flex-col items-center gap-4">
            {eyebrow && (
              <p className="text-accent text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text max-w-4xl text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </header>
        </Reveal>

        {description && (
          <Reveal delay={100}>
            <p className="text-text-muted max-w-3xl text-base leading-[1.2] md:text-lg">{description}</p>
          </Reveal>
        )}

        {phone && (
          <Reveal delay={180}>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="text-text hover:text-accent text-[40px] font-semibold whitespace-nowrap tracking-[-0.03em] transition-colors sm:text-5xl md:text-6xl lg:text-[96px] lg:leading-none"
            >
              {phone}
            </a>
          </Reveal>
        )}

        {(formTitle || formText) && (
          <Reveal delay={260}>
            <div className="flex flex-col items-center gap-1">
              {formTitle && (
                <p className="text-text text-2xl leading-[normal] tracking-[-0.03em]">
                  {formTitle}
                </p>
              )}
              {formText && (
                <p className="text-text-muted text-base leading-[1.2] md:text-lg">{formText}</p>
              )}
            </div>
          </Reveal>
        )}

        {ctaLabel && (
          <Reveal delay={340}>
            <ReservationCtaButton
              tab="event"
              variant="filled-dark"
              className="!bg-accent !text-text !border-accent"
            >
              {ctaLabel}
            </ReservationCtaButton>
          </Reveal>
        )}
      </div>
    </section>
  )
}
