import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['servicesIntro']
  locale: Locale
}

export function ServicesIntro({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)

  return (
    <section className="bg-bg pt-8 pb-12 md:pt-12 md:pb-16">
      <div className="layout-container text-center">
        {eyebrow && (
          <p className="text-accent wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
        )}
        {title && (
          <h2 className="text-text mt-4 text-4xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
            {title}
          </h2>
        )}
      </div>
    </section>
  )
}
