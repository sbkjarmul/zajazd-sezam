import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['hero']
  locale: Locale
}

export function EventsHero({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const subtitle = pickLocale(data.subtitle, locale)
  const primaryCta = pickLocale(data.primaryCtaLabel, locale)
  const secondaryCta = pickLocale(data.secondaryCtaLabel, locale)

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-end overflow-hidden">
      {data.image ? (
        <SanityImage
          image={data.image}
          locale={locale}
          fill
          priority
          sizes="100vw"
          className="-z-10"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background: 'linear-gradient(180deg, var(--color-gold) 0%, var(--color-dark) 100%)',
          }}
        />
      )}
      {/* Dark overlay — subtelnie przyciemnia hero, żeby cream text był czytelny */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(31,31,28,0.35) 0%, rgba(31,31,28,0.65) 100%)',
        }}
      />

      <div className="text-text-inverse layout-container pt-32 pb-16 md:pt-40 md:pb-32">
        <div className="flex max-w-5xl flex-col gap-6 md:gap-10">
          <div className="flex flex-col gap-3 md:gap-4">
            {eyebrow && (
              <p className="text-text-inverse text-base tracking-normal uppercase md:text-xl">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-text-inverse text-[64px] leading-[1.0] font-medium tracking-tight md:text-7xl md:tracking-[-0.03em] lg:text-[120px]">
                {title}
              </h1>
            )}
          </div>
          {subtitle && <p className="text-text-inverse max-w-2xl text-lg md:text-xl">{subtitle}</p>}

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:flex-wrap">
            {primaryCta && (
              <ReservationCtaButton tab="event" variant="filled-light" className="w-full md:w-auto">
                {primaryCta}
              </ReservationCtaButton>
            )}
            {secondaryCta && (
              <a
                href="#halls"
                className="border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text inline-flex h-[65px] w-full items-center justify-center rounded-full border-2 px-6 text-lg transition-colors md:h-[60px] md:w-auto"
              >
                {secondaryCta}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
