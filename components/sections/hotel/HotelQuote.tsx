import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['quote']
  locale: Locale
}

// Cytat wycentrowany pionowo i poziomo w sekcji h-800, opacity-fade-in
// (Reveal) gdy wjeżdża w viewport. Tekst z Sanity z łamaniami linii (\n),
// `whitespace-pre-line` je zachowuje.
export function HotelQuote({ data, locale }: Props) {
  const value = pickLocale(data, locale)
  if (!value) return null

  return (
    <section className="bg-bg flex items-center justify-center py-20 md:min-h-[800px] md:py-0">
      <div className="layout-container">
        <Reveal>
          <p className="text-text mx-auto max-w-[1021px] text-2xl leading-[normal] font-light tracking-[-0.02em] whitespace-pre-line uppercase md:text-[32px]">
            {value}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
