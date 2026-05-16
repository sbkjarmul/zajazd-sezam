import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['quote']
  locale: Locale
}

export function HotelQuote({ data, locale }: Props) {
  const value = pickLocale(data, locale)
  if (!value) return null

  return (
    <section className="bg-bg py-24 md:py-40">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-16">
        <p className="text-text text-2xl leading-relaxed font-light tracking-tight uppercase md:text-4xl lg:text-5xl">
          {value}
        </p>
      </div>
    </section>
  )
}
