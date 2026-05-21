import Image from 'next/image'
import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['amenitiesSection']
  locale: Locale
}

// Wg Figma 676:483: bg-light, header eyebrow 24px lewo + title 48px prawo na jednej linii;
// siatka 2×3, gap-40, każdy item flex-col justify-between z border-b dark u dołu, pb-24.
// Tytuł itemu: 32px font-normal Inter uppercase. Opis: 20px. Ikona 48×48 na dole.
//
// Ikony rezydują w /public/images/icons/{icon}.svg — nazwa z pola Sanity `icon`.
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
            <Reveal>
              <p className="text-text wide:text-lg text-base tracking-normal uppercase">
                {eyebrow}
              </p>
            </Reveal>
          )}
          {title && (
            <Reveal delay={100}>
              <h2 className="text-text text-3xl leading-none font-normal tracking-tight uppercase md:text-4xl md:tracking-[-0.03em] lg:text-[48px]">
                {title}
              </h2>
            </Reveal>
          )}
        </header>

        <ul className="ml-auto grid w-full grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 md:gap-y-10 lg:max-w-[849px]">
          {items.map((item, i) => {
            const itemTitle = pickLocale(item.title, locale)
            const itemDesc = pickLocale(item.description, locale)
            return (
              <Reveal key={i} delay={i * 80}>
                <li className="border-text flex flex-col items-start justify-between gap-6 border-b pb-6 md:min-h-[182px]">
                  <div className="flex flex-col gap-3">
                    {itemTitle && (
                      <h3 className="text-text text-xl leading-none font-normal tracking-tight uppercase md:text-2xl md:tracking-[-0.03em] lg:text-[32px]">
                        {itemTitle}
                      </h3>
                    )}
                    {itemDesc && (
                      <p className="text-text text-base leading-[1.2] md:text-lg lg:text-xl">
                        {itemDesc}
                      </p>
                    )}
                  </div>
                  {item.icon && (
                    <Image
                      src={`/images/icons/${item.icon}`}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 object-contain"
                      aria-hidden
                    />
                  )}
                </li>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
