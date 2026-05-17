import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['craftSection']
  locale: Locale
}

export function RestaurantCraft({ data, locale }: Props) {
  if (!data) return null
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section className="bg-bg py-10 md:py-16">
      <div className="layout-container grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-md">
          <SanityImage
            image={data.primaryImage}
            locale={locale}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-between gap-10">
          {title && (
            <h2 className="text-secondary text-4xl leading-[1.0] font-bold tracking-tight uppercase md:text-6xl md:tracking-[-0.03em] lg:text-[80px]">
              {title}
            </h2>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-6 md:col-span-2">
              {description && (
                <p className="text-secondary text-xl leading-relaxed">{description}</p>
              )}
              {ctaLabel && (
                <Link
                  href="/restauracja/menu"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground inline-flex h-[60px] w-fit items-center justify-center rounded-full border-2 px-6 text-lg transition-colors"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
            <div className="relative aspect-square overflow-hidden rounded-md">
              <SanityImage
                image={data.secondaryImage}
                locale={locale}
                fill
                sizes="(max-width: 768px) 100vw, 16vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
