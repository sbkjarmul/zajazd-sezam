import type { BISTRO_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  text: NonNullable<BISTRO_PAGE_QUERY_RESULT>['centralBanner']
  hours?: NonNullable<BISTRO_PAGE_QUERY_RESULT>['hoursText']
  locale: Locale
}

// Wg Figma 676:3357 — banner h-800 jasne-ruby tło, white uppercase 90px font-black centered.
// Godziny otwarcia (`hoursText`) renderujemy pod headlinem jako podtekst —
// poprzednia sekcja BistroHours została zwinięta do tej sekcji.
export function BistroBanner({ text, hours, locale }: Props) {
  const value = pickLocale(text, locale)
  const hoursValue = hours ? pickLocale(hours, locale) : ''
  if (!value && !hoursValue) return null

  return (
    <section
      className="text-text-inverse flex items-center justify-center py-24 md:py-32 lg:min-h-[800px]"
      style={{ background: '#1a2789' }}
    >
      <div className="layout-container flex flex-col items-center gap-8 text-center md:gap-12">
        {value && (
          <p className="text-text-inverse text-4xl leading-none font-black tracking-[-0.033em] uppercase md:text-6xl lg:text-[90px]">
            {value}
          </p>
        )}
        {hoursValue && (
          <p className="text-text-inverse mx-auto max-w-3xl text-lg leading-[1.4] font-light whitespace-pre-line md:text-2xl">
            {hoursValue}
          </p>
        )}
      </div>
    </section>
  )
}
