import type { BISTRO_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  text: NonNullable<BISTRO_PAGE_QUERY_RESULT>['centralBanner']
  locale: Locale
}

export function BistroBanner({ text, locale }: Props) {
  const value = pickLocale(text, locale)
  if (!value) return null

  return (
    <section className="bg-bg py-24 md:py-40">
      <div className="mx-auto w-full max-w-[1280px] px-6 text-center md:px-16">
        <p className="text-text text-4xl leading-tight font-light tracking-tight uppercase md:text-6xl lg:text-7xl">
          {value}
        </p>
      </div>
    </section>
  )
}
