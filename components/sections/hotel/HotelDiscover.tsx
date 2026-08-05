import type { HOTEL_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOTEL_PAGE_QUERY_RESULT>['discoverSection']
  locale: Locale
}

// "Wszystko w jednym miejscu" — slider 4 kart cross-sell (Bistro, Imprezy,
// Restauracja, Sale konferencyjne). Wg Figma 676:606 — h-708, items-start.
export function HotelDiscover({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const cards = data.cards ?? []

  if (!cards.length) return null

  return (
    <section
      data-header-theme="light"
      // Panel snapu 100svh z trescia wysrodkowana w pionie (justify-content:center
      // z `.snap-panels > section`). Tresc jest nizsza niz ekran, wiec centrowanie
      // trzyma ja z dala od fixed headera - bez potrzeby gornego paddingu.
      className="bg-bg py-16 md:py-20"
    >
      <div className="layout-container flex flex-col gap-12 md:gap-20">
        <header className="flex flex-col items-start gap-4 md:flex-row md:items-baseline md:justify-between md:gap-12">
          {eyebrow && (
            <p className="text-text wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
          )}
          {title && (
            <h2 className="text-text max-w-3xl text-3xl leading-none font-normal tracking-tight uppercase md:text-4xl md:tracking-[-0.03em] lg:text-[48px]">
              {title}
            </h2>
          )}
        </header>

        {/* Poziomy slider: karty w jednym rzedzie, snap-x, swipe/scroll w poziomie.
            Szerokosci: mobile ~80% (podglad kolejnej), sm 45%, lg 4 karty na ekran
            (jak dawna siatka grid-cols-4, gap-6 = 1.5rem -> 3 przerwy = 4.5rem). */}
        <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          {cards.map((card, i) => {
            const cardEyebrow = pickLocale(card.eyebrow, locale)
            const cardDesc = pickLocale(card.description, locale)
            const cardCta = pickLocale(card.ctaLabel, locale)
            return (
              <article
                key={i}
                className="group flex w-[80%] shrink-0 snap-start flex-col gap-6 sm:w-[45%] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <SanityImage
                    image={card.image}
                    locale={locale}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="scale-[1.08] object-cover transition-transform duration-500 ease-out group-hover:scale-100"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  {cardEyebrow && (
                    <p className="text-text text-xl leading-none font-normal tracking-tight uppercase md:tracking-[-0.03em]">
                      {cardEyebrow}
                    </p>
                  )}
                  {cardDesc && <p className="text-text text-base leading-[1.2]">{cardDesc}</p>}
                </div>
                {cardCta && card.ctaHref && (
                  <a
                    href={card.ctaHref}
                    className="border-text text-text hover:bg-text hover:text-text-inverse inline-flex h-[48px] w-fit items-center justify-center rounded-full border-2 px-6 text-base transition-colors"
                  >
                    {cardCta}
                  </a>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
