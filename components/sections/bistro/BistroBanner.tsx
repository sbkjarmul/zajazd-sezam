import type { BISTRO_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  text: NonNullable<BISTRO_PAGE_QUERY_RESULT>['centralBanner']
  locale: Locale
}

// Wg Figma 676:3357 — banner h-800 jasne-ruby tło, white uppercase 90px font-black centered.
export function BistroBanner({ text, locale }: Props) {
  const value = pickLocale(text, locale)
  if (!value) return null

  return (
    <section
      className="text-text-inverse flex items-center justify-center py-24 md:py-32 lg:min-h-[800px]"
      style={{ background: '#1a2789' }}
    >
      <div className="layout-container text-center">
        <p className="text-text-inverse text-4xl leading-none font-black tracking-[-0.033em] uppercase md:text-6xl lg:text-[90px]">
          {value}
        </p>
      </div>
    </section>
  )
}
