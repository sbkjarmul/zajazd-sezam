import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>
  locale: Locale
}

export function RestaurantHero({ data, locale }: Props) {
  const headline = pickLocale(data.heroHeadline, locale)

  return (
    <section className="bg-bg relative flex min-h-screen w-full flex-col">
      <div className="flex flex-1 items-end px-6 pt-40 pb-12 md:px-16 md:pt-48 md:pb-16">
        <h1 className="text-secondary text-6xl leading-none font-bold tracking-tight uppercase md:text-7xl md:tracking-[-0.03em] lg:text-[120px]">
          {headline}
        </h1>
      </div>
      <div className="relative aspect-[1512/359] w-full">
        <SanityImage
          image={data.heroImage}
          locale={locale}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  )
}
