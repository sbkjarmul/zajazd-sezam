import type { MENU_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<MENU_PAGE_QUERY_RESULT>['pageIntro']
  locale: Locale
}

export function MenuHero({ data, locale }: Props) {
  if (!data) return null
  const title = pickLocale(data.title, locale)
  if (!title) return null

  return (
    <section data-header-theme="light" className="bg-bg text-ruby pt-40 pb-8 md:pt-48 md:pb-12">
      <div className="layout-container flex justify-center">
        <h1 className="font-accent text-ruby text-center text-[clamp(72px,13vw,180px)] tracking-normal italic">
          {title}
        </h1>
      </div>
    </section>
  )
}
