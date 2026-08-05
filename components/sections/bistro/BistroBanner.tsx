import type { BISTRO_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealText } from '@/components/RevealText'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  text: NonNullable<BISTRO_PAGE_QUERY_RESULT>['centralBanner']
  hours?: NonNullable<BISTRO_PAGE_QUERY_RESULT>['hoursText']
  locale: Locale
}

// Redesign wg Figma 971:1214 — sekcja "Czekamy na ciebie!" na jasnym (kremowym)
// tle, wyśrodkowana: nagłówek ruby-light uppercase, pod nim godziny otwarcia.
// Animacje jak na restauracji: RevealText fade.
export function BistroBanner({ text, hours, locale }: Props) {
  const value = pickLocale(text, locale)
  const hoursValue = hours ? pickLocale(hours, locale) : ''
  if (!value && !hoursValue) return null

  return (
    <section
      data-header-theme="light"
      className="bg-bg text-ruby-light flex items-center justify-center py-24 md:py-36"
    >
      <div className="layout-container flex flex-col items-center gap-8 text-center md:gap-10">
        {value && (
          <RevealText
            as="p"
            mode="fade"
            className="text-ruby-light text-4xl leading-none font-black tracking-tight uppercase md:text-6xl md:tracking-[-0.03em] lg:text-[80px]"
          >
            {value}
          </RevealText>
        )}
        {hoursValue && (
          <RevealText
            as="p"
            mode="fade"
            delay={0.1}
            className="text-ruby-light/90 mx-auto max-w-2xl text-lg leading-[1.5] font-normal whitespace-pre-line md:text-xl"
          >
            {hoursValue}
          </RevealText>
        )}
      </div>
    </section>
  )
}
