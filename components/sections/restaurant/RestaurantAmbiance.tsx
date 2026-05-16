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
    <section className="bg-bg py-20 md:py-32">
      <div className="mx-auto flex w-full max-w-[1384px] flex-col gap-12 px-6 md:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            {title && (
              <h2 className="text-text text-4xl leading-tight font-light tracking-tight uppercase md:text-6xl">
                {title}
              </h2>
            )}
          </div>
          <div className="flex flex-col items-start gap-6 md:col-span-5 md:items-end md:text-right">
            {tagline && (
              <p className="text-text-muted max-w-md text-xl leading-relaxed">{tagline}</p>
            )}
            {ctaLabel && phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-[60px] items-center justify-center rounded-full border-2 border-transparent px-6 text-lg transition-colors"
              >
                {ctaLabel}
              </a>
            )}
          </div>
        </div>

        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-md">
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
