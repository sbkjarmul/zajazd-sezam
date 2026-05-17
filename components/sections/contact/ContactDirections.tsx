import type { CONTACT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<CONTACT_PAGE_QUERY_RESULT>['directionsSection']
  locale: Locale
}

export function ContactDirections({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const content = pickLocale(data.content, locale)
  if (!content && !title) return null

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="layout-container grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="flex flex-col gap-4 md:col-span-5">
          {eyebrow && <p className="text-accent text-sm tracking-normal uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="text-text text-3xl leading-tight font-light tracking-tight md:text-4xl md:tracking-[-0.03em] lg:text-5xl">
              {title}
            </h2>
          )}
        </div>
        {content && (
          <p className="text-text text-lg leading-relaxed whitespace-pre-line md:col-span-7">
            {content}
          </p>
        )}
      </div>
    </section>
  )
}
