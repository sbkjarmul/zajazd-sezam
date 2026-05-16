import type { BISTRO_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<BISTRO_PAGE_QUERY_RESULT>
  locale: Locale
}

export function BistroHero({ data, locale }: Props) {
  const headline = pickLocale(data.heroHeadline, locale)

  return (
    <section className="bg-bg flex min-h-[60vh] items-center px-6 pt-32 pb-12 md:px-16 md:pt-40">
      {headline && (
        <h1 className="text-text text-5xl leading-tight font-light tracking-tight uppercase md:text-7xl lg:text-[120px]">
          {headline}
        </h1>
      )}
    </section>
  )
}
