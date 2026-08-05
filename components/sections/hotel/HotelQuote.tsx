import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ColorizeText } from '@/components/ColorizeText'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['quote']
  locale: Locale
}

// Cytat wycentrowany pionowo i poziomo w sekcji h-800. Animacja ColorizeText
// (jak EventsPromise/About): fala kolorowania znak po znaku (gray -> text) gdy
// sekcja wjezdza w viewport; na < md pelen kolor od razu. Tekst z Sanity z
// lamaniami linii (\n) — `whitespace-pre-line` je zachowuje (dziedziczone przez
// spany ColorizeText).
export function HotelQuote({ data, locale }: Props) {
  const value = pickLocale(data, locale)
  if (!value) return null

  return (
    <section
      data-header-theme="light"
      className="bg-bg flex min-h-[800px] items-center justify-center"
    >
      <div className="layout-container">
        <p className="mx-auto max-w-[1021px] text-xl leading-[normal] font-light tracking-[-0.02em] whitespace-pre-line uppercase md:text-[32px]">
          <ColorizeText text={value} />
        </p>
      </div>
    </section>
  )
}
