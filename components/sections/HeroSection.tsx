import { Star, StarHalf } from 'lucide-react'
import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { HeroParallaxImage } from './HeroParallaxImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['hero']
  locale: Locale
}

const GUESTS_LABEL: Record<Locale, string> = {
  pl: '1100+ zadowolonych gości',
  en: '1100+ happy guests',
}

export function HeroSection({ data, locale }: Props) {
  if (!data) return null
  const headline = pickLocale(data.headline, locale)
  const subheadline = pickLocale(data.subheadline, locale)
  const ctaLabel = pickLocale(data.primaryCtaLabel, locale) ?? GUESTS_LABEL[locale]

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-end overflow-hidden">
      {data.image && <HeroParallaxImage image={data.image} locale={locale} />}
      {!data.image && (
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background:
              'linear-gradient(180deg, var(--color-dark-ruby) 0%, var(--color-gold) 100%)',
          }}
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(212.806deg, rgba(164,146,102,0) 40.814%, rgba(164,146,102,1) 76.688%)',
        }}
      />

      <div className="text-text-inverse layout-container pt-32 pb-16 md:pt-40 md:pb-32">
        <div className="flex max-w-4xl flex-col gap-8 text-center md:text-left">
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
            {/* Mobile: 5 gwiazdek wycentrowane (Figma 676:2007) */}
            <div className="text-accent flex items-center gap-1 md:hidden" aria-hidden>
              <Star className="size-5 fill-current" />
              <Star className="size-5 fill-current" />
              <Star className="size-5 fill-current" />
              <Star className="size-5 fill-current" />
              <StarHalf className="size-5 fill-current" />
            </div>
            {/* Desktop: 3 avatary użytkowników z Google Reviews (Figma 676:1517).
                Placeholder do czasu F8 — kolorowe kółka z borderem. */}
            <div className="hidden -space-x-3 md:flex" aria-hidden>
              <span className="border-text-inverse/60 bg-gold size-10 rounded-full border-2" />
              <span className="border-text-inverse/60 bg-secondary size-10 rounded-full border-2" />
              <span className="border-text-inverse/60 bg-dark-ruby size-10 rounded-full border-2" />
            </div>
            <span className="text-base md:text-lg">{GUESTS_LABEL[locale]}</span>
          </div>

          {headline && (
            <h1 className="text-3xl leading-none font-normal tracking-tight md:text-6xl md:tracking-[-0.03em] lg:text-[72px]">
              {headline}
            </h1>
          )}

          {subheadline && (
            <p className="mx-auto max-w-2xl text-base leading-[1.2] md:mx-0 md:text-xl">
              {subheadline}
            </p>
          )}

          <div className="pt-2">
            <ReservationCtaButton tab="room" variant="filled-dark" className="w-full md:w-auto">
              {ctaLabel}
            </ReservationCtaButton>
          </div>
        </div>
      </div>
    </section>
  )
}
