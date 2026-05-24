import type { RESTAURANT_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['ambianceSection']
  settings: SITE_SETTINGS_QUERY_RESULT | null
  locale: Locale
}

export function RestaurantAmbiance({ data, settings, locale }: Props) {
  if (!data) return null
  const title = pickLocale(data.title, locale)
  const tagline = pickLocale(data.tagline, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const phone = settings?.phone

  return (
    <section className="bg-bg pt-32 md:pt-40 md:pb-20">
      <div className="layout-container flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            {title && (
              <h2 className="text-dark-ruby text-4xl leading-none font-bold tracking-tight whitespace-pre-line uppercase md:text-6xl md:tracking-[-0.03em] lg:text-[80px]">
                {title}
              </h2>
            )}
          </div>
          <div className="flex flex-col items-start gap-6 md:col-span-5 md:items-end md:text-right">
            {tagline && (
              <p className="text-dark-ruby max-w-sm text-xl leading-[normal]">{tagline}</p>
            )}
            {ctaLabel && phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="border-dark-ruby text-dark-ruby hover:bg-dark-ruby hover:text-text-inverse inline-flex h-[60px] w-full items-center justify-center rounded-full border-2 px-6 text-lg transition-colors md:w-auto"
              >
                {ctaLabel}
              </a>
            )}
          </div>
        </div>

        <div className="relative -mx-4 aspect-square w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:aspect-[2/1] md:w-full">
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
