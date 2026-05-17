import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['quote']
  locale: Locale
}

// Wg Figma 676:352 — bg-light, items-end justify-center, w-[1021px], py-[80px] px-[60px].
// Tekst 32px Inter Light uppercase, tracking-[-0.64px] (=-2%), right-aligned.
export function HotelQuote({ data, locale }: Props) {
  const value = pickLocale(data, locale)
  if (!value) return null

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="layout-container flex md:justify-end">
        <p className="text-text text-2xl leading-[1.2] font-light tracking-[-0.02em] uppercase md:max-w-[1021px] md:text-right md:text-[32px]">
          {value}
        </p>
      </div>
    </section>
  )
}
