import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['hero']
  locale: Locale
}

export function HotelHero({ data, locale }: Props) {
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
            background:
              'linear-gradient(180deg, var(--color-dark-ruby) 0%, var(--color-ruby) 100%)',
          }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(31,31,28,0) 50%, rgba(31,31,28,0.65) 100%)',
        }}
      />

      <div className="text-text-inverse mx-auto w-full max-w-[1384px] px-6 pt-32 pb-16 md:px-16 md:pt-40 md:pb-32">
        <div className="flex max-w-4xl flex-col gap-6">
          {eyebrow && <p className="text-accent text-sm tracking-widest uppercase">{eyebrow}</p>}
          {title && (
            <h1 className="text-5xl leading-[1.05] font-normal tracking-tight md:text-6xl lg:text-[88px] lg:leading-[1]">
              {title}
            </h1>
          )}
          {subtitle && <p className="max-w-xl text-lg md:text-xl">{subtitle}</p>}

          <div className="mt-2 flex flex-wrap gap-3">
            {primaryCta && (
              <ReservationCtaButton tab="room" variant="filled-dark">
                {primaryCta}
              </ReservationCtaButton>
            )}
            {secondaryCta && (
              <a
                href="#rooms"
                className="border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text inline-flex h-[60px] items-center justify-center rounded-full border-2 px-6 text-lg transition-colors"
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
