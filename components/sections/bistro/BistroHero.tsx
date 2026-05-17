import type { BISTRO_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<BISTRO_PAGE_QUERY_RESULT>
  locale: Locale
}

// Wg Figma 676:3252 — hero 420px, jasne-ruby tło, white uppercase font-black 90px.
export function BistroHero({ data, locale }: Props) {
  const headline = pickLocale(data.heroHeadline, locale)

  return (
    <section
      className="text-text-inverse flex min-h-[420px] items-end pt-32 pb-10 md:min-h-[420px] md:pt-40 md:pb-16"
      style={{ background: '#1a2789' }}
    >
      <div className="layout-container">
        {headline && (
          <h1 className="text-text-inverse text-5xl leading-none font-black tracking-tight uppercase md:text-7xl md:tracking-[-0.03em] lg:text-[90px]">
            {headline}
          </h1>
        )}
      </div>
    </section>
  )
}
