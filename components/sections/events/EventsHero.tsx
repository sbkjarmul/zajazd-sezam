import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { HeroParallaxImage } from '@/components/sections/HeroParallaxImage'
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
        <HeroParallaxImage image={data.image} locale={locale} />
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
              <p className="text-text-inverse text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-text-inverse text-[64px] leading-none font-medium tracking-tight md:text-7xl md:tracking-[-0.03em] lg:text-[120px]">
                {title}
              </h1>
            )}
          </div>
          {subtitle && (
            <p className="text-text-inverse max-w-2xl text-base leading-[1.2] md:text-xl">
              {subtitle}
            </p>
          )}

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
