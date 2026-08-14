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
// Tytuł itemu: 32px font-normal Inter uppercase. Opis: 16px desktop / 14px mobile,
// kolor dark-gold (lżejszy, mniej dominujący niz tytul). Ikona 48×48 na dole.
//
// Ikony rezydują w /public/images/icons/{icon}.svg — nazwa z pola Sanity `icon`.
export function HotelAmenities({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const items = data.items ?? []

  return (
    <section
      id="amenities"
      data-header-theme="light"
      // Desktop (lg+): panel snapu = dokladnie 100svh (h-[100svh]!), 2-kolumnowa
      // siatka miesci sie w kadrze, tresc wysrodkowana w pionie (justify-content:center
      // z `.snap-panels > section`). Mobile/tablet (<lg): 6 itemow w 1 kolumnie
      // przekracza ekran, wiec naturalna wysokosc (min-h 100svh z globalnej reguly) +
      // pt-[120px] pod fixed headerem, bez clipowania.
      // Desktop: treść od GORY (justify-start! bije globalne `.snap-panels>section`
      // justify-center) z pt-[140px] — staly przeswit pod fixed headerem (~108px),
      // zamiast wysrodkowania, ktore wpychalo naglowek pod header. pb-0 + content
      // ~646px miesci sie w sztywnych 800px (h-100svh!) bez clipu overflow-hidden.
      className="bg-bg pt-[120px] pb-16 lg:h-[100svh]! lg:justify-start! lg:overflow-hidden lg:pt-[140px] lg:pb-0"
    >
      <div className="layout-container flex flex-col gap-10 lg:gap-20">
        <header className="flex flex-col items-center gap-4 text-center lg:flex-row lg:items-baseline lg:justify-between lg:gap-12 lg:text-left">
          {eyebrow && (
            <Reveal>
              <p className="text-text wide:text-lg text-base tracking-normal uppercase">
                {eyebrow}
              </p>
            </Reveal>
          )}
          {title && (
            <Reveal delay={100}>
              <h2 className="text-text text-3xl leading-none font-light tracking-tight uppercase md:text-4xl md:tracking-[-0.03em] lg:text-[48px]">
                {title}
              </h2>
            </Reveal>
          )}
        </header>

        <ul className="ml-auto grid w-full grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 md:gap-y-5 lg:max-w-[849px]">
          {items.map((item, i) => {
            const itemTitle = pickLocale(item.title, locale)
            const itemDesc = pickLocale(item.description, locale)
            return (
              <Reveal key={i} delay={i * 80}>
                <li className="border-gold flex flex-col items-start justify-between gap-3 border-b pb-4 md:min-h-0">
                  <div className="flex flex-col gap-3">
                    {itemTitle && (
                      <h3 className="text-text text-base font-light tracking-tight uppercase md:text-2xl md:leading-none md:tracking-[-0.03em] lg:text-[32px]">
                        {itemTitle}
                      </h3>
                    )}
                    {itemDesc && (
                      <p className="text-dark-gold text-[14px]/[1.2] md:text-base">{itemDesc}</p>
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
