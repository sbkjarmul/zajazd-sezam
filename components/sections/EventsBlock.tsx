import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['eventsBlock']
  locale: Locale
}

export function EventsBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="mx-auto grid w-full max-w-[1384px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-16">
        <div className="relative aspect-[5/6] overflow-hidden rounded-md md:col-span-7">
          <SanityImage
            image={data.mainImage}
            locale={locale}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-8 md:col-span-5">
          <div className="flex flex-col gap-4">
            {eyebrow && <p className="text-accent text-sm tracking-widest uppercase">{eyebrow}</p>}
            {title && (
              <h2 className="text-text text-4xl font-light tracking-tight md:text-5xl">{title}</h2>
            )}
          </div>

          {data.secondaryImage && (
            <div className="relative aspect-square overflow-hidden rounded-md">
              <SanityImage
                image={data.secondaryImage}
                locale={locale}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
          )}

          {description && <p className="text-text-muted text-lg leading-relaxed">{description}</p>}

          {ctaLabel && (
            <div>
              <ReservationCtaButton tab="event" variant="outline-dark">
                {ctaLabel}
              </ReservationCtaButton>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
