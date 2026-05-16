import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['amenitiesSection']
  locale: Locale
}

export function HotelAmenities({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const items = data.items ?? []

  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="mx-auto flex w-full max-w-[1384px] flex-col gap-12 px-6 md:px-16">
        <header className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          {eyebrow && <p className="text-accent text-sm tracking-widest uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="text-text max-w-xl text-4xl leading-tight font-light tracking-tight uppercase md:text-5xl">
              {title}
            </h2>
          )}
        </header>

        <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 md:gap-y-14">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <h3 className="text-text text-2xl font-light tracking-tight">
                {pickLocale(item.title, locale)}
              </h3>
              <p className="text-text-muted text-base leading-relaxed">
                {pickLocale(item.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
