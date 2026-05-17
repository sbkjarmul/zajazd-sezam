import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['amenitiesSection']
  locale: Locale
}

// Wg Figma 676:483: bg-light, header eyebrow 24px lewo + title 48px prawo na jednej linii;
// siatka 2×3, gap-40, każdy item flex-col justify-between z border-b dark u dołu, pb-24.
// Tytuł itemu: 32px font-normal Inter. Opis: 20px text-dark.
export function HotelAmenities({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const items = data.items ?? []

  return (
    <section id="amenities" className="bg-bg scroll-mt-24 py-20 md:py-32">
      <div className="layout-container flex flex-col gap-12 md:gap-20">
        <header className="flex flex-col items-start gap-4 md:flex-row md:items-baseline md:justify-between md:gap-12">
          {eyebrow && (
            <p className="text-text text-base uppercase tracking-normal md:text-2xl">{eyebrow}</p>
          )}
          {title && (
            <h2 className="text-text text-3xl leading-none font-normal tracking-tight uppercase md:text-4xl md:tracking-[-0.03em] lg:text-[48px]">
              {title}
            </h2>
          )}
        </header>

        <div className="mx-auto grid w-full grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 md:gap-y-10 lg:max-w-[849px]">
          {items.map((item, i) => (
            <div
              key={i}
              className="border-border flex flex-col justify-between gap-6 border-b pb-6 md:min-h-[182px]"
            >
              <h3 className="text-text text-2xl leading-none font-normal tracking-tight uppercase md:tracking-[-0.03em] lg:text-[32px]">
                {pickLocale(item.title, locale)}
              </h3>
              <p className="text-text text-base leading-[1.2] md:text-lg lg:text-xl">
                {pickLocale(item.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
