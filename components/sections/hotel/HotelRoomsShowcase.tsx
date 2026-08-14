'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ALL_ROOM_TYPES_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RoomImageSlider } from './RoomImageSlider'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { RevealText } from '@/components/RevealText'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Rooms = ALL_ROOM_TYPES_QUERY_RESULT

type Props = {
  rooms: Rooms
  locale: Locale
}

// Klasy 1:1 z pierwotnego HotelRoomCard (Figma 676:357) — te same rozmiary,
// tracking, leading i odstępy, żeby layout/typografia zostały bez zmian.
const H3_CLASS =
  'text-text text-2xl leading-none font-light tracking-tight uppercase md:text-3xl md:tracking-[-0.03em] lg:text-[40px]'
const DESC_CLASS = 'text-text text-base leading-[1.2]'
const LI_CLASS = 'text-text text-base leading-[1.5]'

// Prezentacja pokoi na /hotel jako scroll-driven "scrollytelling":
//
// Desktop (lg+): galerie pokoi ułożone pionowo po lewej przewijają się razem ze
// stroną (każda to RoomImageSlider — strzałki/swipe jak wszędzie). Po prawej
// przypięty (sticky) panel danych pokoju z tym samym layoutem co dawna karta:
// nazwa + opis u góry, CTA, udogodnienia dosunięte do prawej i na dół
// (items-end + mt-auto). Aktywny pokój wybiera IntersectionObserver (linia
// detekcji rootMargin -50%/-50% na środku ekranu). Przy zmianie aktywnego panel
// jest remountowany (key={active}), więc RevealText odgrywa reveal spod maski
// (jak na restauracji/bistro) — nie fade.
//
// Mobile: stacked — galeria, pod nią dane pokoju, pokój po pokoju.
export function HotelRoomsShowcase({ rooms, locale }: Props) {
  const t = useTranslations('hotel')
  const [active, setActive] = useState(0)
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])

  const prevLabel = t('prevImage')
  const nextLabel = t('nextImage')
  const ctaLabel = t('bookRoom')

  useEffect(() => {
    const panels = panelsRef.current.filter((p): p is HTMLDivElement => p !== null)
    if (panels.length === 0) return

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const idx = Number((entry.target as HTMLElement).dataset.index)
          if (!Number.isNaN(idx)) setActive(idx)
        }
      },
      // Linia detekcji na środku ekranu: aktywna jest galeria, która ją zakrywa.
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    panels.forEach((p) => obs.observe(p))
    return () => obs.disconnect()
  }, [rooms.length])

  const activeRoom = rooms[active]

  return (
    <>
      {/* Mobile: stacked — galeria + dane pokoju, pokój po pokoju */}
      <div className="flex flex-col lg:hidden">
        {rooms.map((room) => {
          const name = pickLocale(room.name, locale)
          const description = pickLocale(room.description, locale)
          const amenities = room.amenities ?? []
          return (
            <div key={room._id} className="grid grid-cols-1">
              <Reveal className="relative aspect-square overflow-hidden">
                <RoomImageSlider
                  images={room.images ?? []}
                  locale={locale}
                  prevLabel={prevLabel}
                  nextLabel={nextLabel}
                />
              </Reveal>
              <div className="bg-bg flex flex-col gap-6 p-6 md:p-8">
                <div className="flex flex-col gap-4">
                  {name && (
                    <RevealText as="h3" className={H3_CLASS}>
                      {name}
                    </RevealText>
                  )}
                  {description && (
                    <RevealText as="p" className={DESC_CLASS}>
                      {description}
                    </RevealText>
                  )}
                </div>
                <Reveal delay={150}>
                  <ReservationCtaButton
                    tab="room"
                    variant="outline-dark"
                    className="w-full md:w-auto"
                  >
                    {ctaLabel}
                  </ReservationCtaButton>
                </Reveal>
                {amenities.length > 0 && (
                  <RevealText as="ul" className="flex flex-col items-end pt-2">
                    {amenities.map((a, i) => (
                      <li key={i} className={LI_CLASS}>
                        {pickLocale(a, locale)}
                      </li>
                    ))}
                  </RevealText>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop: scrollytelling */}
      <div className="hidden lg:grid lg:grid-cols-2">
        {/* Lewa: galerie na całą wysokość ekranu, jedna pod drugą (bez paddingów) */}
        <div className="flex flex-col">
          {rooms.map((room, i) => (
            <div
              key={room._id}
              data-index={i}
              ref={(el) => {
                panelsRef.current[i] = el
              }}
              className="relative h-screen w-full overflow-hidden"
            >
              <RoomImageSlider
                images={room.images ?? []}
                locale={locale}
                prevLabel={prevLabel}
                nextLabel={nextLabel}
              />
            </div>
          ))}
        </div>

        {/* Prawa: przypięty panel danych; key={active} → reveal spod maski */}
        <div className="relative">
          {/* pt-[140px]: fixed header ma ~108px — tekst startuje pod nim (+gap),
              żeby tytuł nigdy nie chował się pod headerem. */}
          <div className="sticky top-0 h-screen px-8 pt-[140px] pb-[8vh] xl:px-16">
            {activeRoom &&
              (() => {
                const name = pickLocale(activeRoom.name, locale)
                const description = pickLocale(activeRoom.description, locale)
                const amenities = activeRoom.amenities ?? []
                return (
                  <div key={active} className="flex h-full flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      {name && (
                        <RevealText as="h3" start="top bottom" className={H3_CLASS}>
                          {name}
                        </RevealText>
                      )}
                      {description && (
                        <RevealText
                          as="p"
                          start="top bottom"
                          className={`${DESC_CLASS} max-w-[460px]`}
                        >
                          {description}
                        </RevealText>
                      )}
                    </div>
                    <Reveal delay={150}>
                      <ReservationCtaButton
                        tab="room"
                        variant="outline-dark"
                        className="min-w-[224px] self-start whitespace-nowrap"
                      >
                        {ctaLabel}
                      </ReservationCtaButton>
                    </Reveal>
                    {amenities.length > 0 && (
                      <RevealText
                        as="ul"
                        start="top bottom"
                        className="mt-auto flex flex-col items-end"
                      >
                        {amenities.map((a, j) => (
                          <li key={j} className={LI_CLASS}>
                            {pickLocale(a, locale)}
                          </li>
                        ))}
                      </RevealText>
                    )}
                  </div>
                )
              })()}
          </div>
        </div>
      </div>
    </>
  )
}
