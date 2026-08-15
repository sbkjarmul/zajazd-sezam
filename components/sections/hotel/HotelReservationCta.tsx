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
      data-header-theme="dark"
      className="text-text-inverse py-20 md:py-32"
      style={{ background: 'var(--color-primary)' }}
    >
      <div className="layout-container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col justify-center gap-10">
          <div className="flex flex-col gap-4">
            {eyebrow && (
              <p className="text-text-inverse wide:text-lg text-base tracking-normal uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text-inverse text-3xl leading-none font-light tracking-tight uppercase md:text-4xl md:tracking-[-0.03em] lg:text-[48px]">
                {title}
              </h2>
            )}
            {description && <p className="text-text-inverse max-w-xl text-lg">{description}</p>}
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

        <div className="relative aspect-square overflow-hidden">
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
