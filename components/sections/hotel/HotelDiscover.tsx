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
    <section className="bg-bg py-20 md:py-32">
      <div className="layout-container flex flex-col gap-12 md:gap-20">
        <header className="flex flex-col items-start gap-4 md:flex-row md:items-baseline md:justify-between md:gap-12">
          {eyebrow && (
            <p className="text-text text-base tracking-normal uppercase md:text-2xl">{eyebrow}</p>
          )}
          {title && (
            <h2 className="text-text max-w-3xl text-3xl leading-none font-normal tracking-tight uppercase md:text-4xl md:tracking-[-0.03em] lg:text-[48px]">
              {title}
            </h2>
          )}
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.map((card, i) => {
            const cardEyebrow = pickLocale(card.eyebrow, locale)
            const cardTitle = pickLocale(card.title, locale)
            const cardDesc = pickLocale(card.description, locale)
            const cardCta = pickLocale(card.ctaLabel, locale)
            return (
              <article key={i} className="group flex flex-col gap-6">
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
                    <p className="text-text text-2xl leading-none font-normal tracking-tight uppercase md:tracking-[-0.03em]">
                      {cardEyebrow}
                    </p>
                  )}
                  {cardTitle && (
                    <p className="text-text text-base tracking-normal uppercase">{cardTitle}</p>
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
