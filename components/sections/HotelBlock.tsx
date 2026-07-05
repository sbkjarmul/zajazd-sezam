import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealImage } from '@/components/RevealImage'
import { RevealText } from '@/components/RevealText'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['hotelBlock']
  locale: Locale
}

// Desktop (lg+): 2 kolumny — tekst po lewej (eyebrow, tytuł, opis, CTA),
//   po prawej pozioma listwa kart pokoi, która wychodzi poza prawą krawędź
//   viewportu i scrolluje się poziomo (native overflow-x). Bleed w prawo przez
//   negative margin równy paddingowi layout-containera (64px = -mr-16).
// Tablet/mobile (<lg): jedna kolumna — tekst na górze, karty pod spodem jako
//   full-bleed pozioma listwa (px-4 scroll-padding, ostatnia karta ucieka
//   w prawo).
export function HotelBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const rooms = (data.rooms ?? []).filter((room) => room.image)

  return (
    <section className="bg-bg overflow-hidden pt-20 md:py-32">
      <div className="layout-container flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        {/* Text — lewa kolumna */}
        <Reveal className="flex flex-col gap-10 lg:w-[38%] lg:shrink-0 lg:pt-6">
          <div className="flex flex-col gap-4">
            {eyebrow && (
              <p className="text-text wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
            )}
            {title && (
              <RevealText
                as="h2"
                className="text-text text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl"
              >
                {title}
              </RevealText>
            )}
          </div>
          <div className="flex flex-col items-start gap-6">
            {description && (
              <p className="text-text-muted max-w-md text-base leading-[1.2] md:text-lg">
                {description}
              </p>
            )}
            {ctaLabel && (
              <Link
                href="/hotel"
                className="bg-primary text-primary-foreground border-primary hover:bg-primary-hover inline-flex h-[60px] w-full items-center justify-center rounded-full border-2 px-6 text-lg font-normal transition-colors md:w-auto"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </Reveal>

        {/* Karty pokoi — pozioma listwa uciekająca w prawo poza viewport */}
        {rooms.length > 0 && (
          <Reveal
            delay={150}
            className="-mx-4 min-w-0 lg:mx-0 lg:min-w-0 lg:flex-1"
          >
            <ul className="flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:gap-6 lg:-mr-16 lg:px-0 lg:pr-16 [&::-webkit-scrollbar]:hidden">
              {rooms.map((room) => (
                <li
                  key={room._id}
                  className="flex w-[260px] shrink-0 flex-col gap-4 md:w-[340px]"
                >
                  <div className="relative aspect-[340/560] overflow-hidden">
                    <RevealImage
                      image={room.image}
                      locale={locale}
                      sizes="(max-width: 768px) 260px, 340px"
                      start="top 90%"
                    />
                  </div>
                  <p className="text-text text-base tracking-wide uppercase md:text-lg">
                    {pickLocale(room.name, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  )
}
