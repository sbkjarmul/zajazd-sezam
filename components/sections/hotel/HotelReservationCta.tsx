import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['reservationSection']
  locale: Locale
}

// Wg Figma 676:647: bg-dark, text-light, eyebrow 24px / title 64px / desc 24px,
// CTA outline-light w-[320px] h-[65px]. Image 500×514 po prawej, bez rounding.
export function HotelReservationCta({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      id="reservation"
      className="text-text-inverse scroll-mt-24 py-20 md:py-32"
      style={{ background: 'var(--color-primary)' }}
    >
      <div className="layout-container grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col justify-center gap-10">
          <div className="flex flex-col gap-6">
            {eyebrow && (
              <p className="text-text-inverse text-base tracking-normal uppercase md:text-2xl">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text-inverse text-4xl leading-none font-normal tracking-tight uppercase md:text-5xl md:tracking-[-0.03em] lg:text-[64px]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-text-inverse max-w-xl text-lg leading-[1.2] md:text-xl lg:text-2xl">
                {description}
              </p>
            )}
          </div>
          {ctaLabel && (
            <ReservationCtaButton
              tab="room"
              variant="outline-light"
              className="h-[65px] w-full md:w-[320px]"
            >
              {ctaLabel}
            </ReservationCtaButton>
          )}
        </div>

        <div className="relative hidden aspect-[4/3] overflow-hidden md:block md:aspect-auto md:min-h-[514px]">
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
