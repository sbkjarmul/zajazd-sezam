import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['hotelBlock']
  locale: Locale
}

export function HotelBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const images = data.images ?? []
  const [hero, second, third] = images

  return (
    <section className="bg-bg py-16 md:py-32">
      <div className="layout-container grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-36">
        {/* Title — mobile pos 1, desktop col 2 row 1 (top) */}
        <div className="flex flex-col gap-4 md:col-start-2 md:row-start-1 md:self-start">
          {eyebrow && (
            <p className="text-text wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
          )}
          {title && (
            <h2 className="text-text text-4xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em]">
              {title}
            </h2>
          )}
        </div>

        {/* Images — mobile pos 2, desktop col 1 row 1+2 */}
        <div className="flex flex-col gap-4 md:col-start-1 md:row-span-2 md:row-start-1 md:self-center">
          <div className="relative aspect-[2/1] overflow-hidden">
            <SanityImage
              image={hero}
              locale={locale}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square overflow-hidden">
              <SanityImage
                image={second}
                locale={locale}
                fill
                sizes="(max-width: 768px) 50vw, 22vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden">
              <SanityImage
                image={third}
                locale={locale}
                fill
                sizes="(max-width: 768px) 50vw, 22vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Description + CTA — mobile pos 3, desktop col 2 row 2 (bottom) */}
        <div className="flex flex-col items-start gap-6 md:col-start-2 md:row-start-2 md:self-end">
          {description && <p className="text-text text-lg leading-[1.2]">{description}</p>}
          {ctaLabel && (
            <ReservationCtaButton tab="room" variant="filled-dark" className="w-full md:w-auto">
              {ctaLabel}
            </ReservationCtaButton>
          )}
        </div>
      </div>
    </section>
  )
}
