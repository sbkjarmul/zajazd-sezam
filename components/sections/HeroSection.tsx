import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
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
      {data.image && (
        <SanityImage
          image={data.image}
          locale={locale}
          fill
          priority
          sizes="100vw"
          className="-z-10"
        />
      )}
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

      <div className="text-text-inverse mx-auto w-full max-w-[1384px] px-6 pt-32 pb-16 md:px-16 md:pt-40 md:pb-32">
        <div className="flex max-w-4xl flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3" aria-hidden>
              <span className="border-text-inverse/60 bg-gold size-10 rounded-full border-2" />
              <span className="border-text-inverse/60 bg-secondary size-10 rounded-full border-2" />
              <span className="border-text-inverse/60 bg-dark-ruby size-10 rounded-full border-2" />
            </div>
            <span className="text-base md:text-lg">{GUESTS_LABEL[locale]}</span>
          </div>

          {headline && (
            <h1 className="text-5xl leading-[1.05] font-normal tracking-tight md:text-6xl lg:text-[72px] lg:leading-[1]">
              {headline}
            </h1>
          )}

          {subheadline && (
            <p className="max-w-2xl text-lg leading-relaxed md:text-xl">{subheadline}</p>
          )}

          <div className="pt-2">
            <ReservationCtaButton tab="room" variant="filled-dark">
              {ctaLabel}
            </ReservationCtaButton>
          </div>
        </div>
      </div>
    </section>
  )
}
