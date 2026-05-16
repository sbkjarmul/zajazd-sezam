import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['reservationSection']
  locale: Locale
}

export function HotelReservationCta({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="mx-auto grid w-full max-w-[1384px] grid-cols-1 gap-10 px-6 md:grid-cols-2 md:px-16">
        <div className="flex flex-col justify-center gap-6">
          {eyebrow && <p className="text-accent text-sm tracking-widest uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="text-text text-4xl leading-tight font-light tracking-tight md:text-5xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-text-muted max-w-xl text-lg leading-relaxed">{description}</p>
          )}
          {ctaLabel && (
            <div className="pt-2">
              <ReservationCtaButton tab="room" variant="filled-dark">
                {ctaLabel}
              </ReservationCtaButton>
            </div>
          )}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-md md:aspect-auto md:min-h-[500px]">
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
