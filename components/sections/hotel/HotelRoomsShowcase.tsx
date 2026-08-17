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
// Klasa nazwy pokoju. Element to <h2>, nie <h3>: sekcja pokoi nie ma wlasnego
// naglowka sekcji, wiec nazwy pokoi sa w niej najwyzszym poziomem i h3 tworzylo
// skok h1 -> h3 (Lighthouse heading-order). Nazwa klasy zostaje - to styl, nie tag.
// Mobile 24px (`text-xl`) - tyle samo, ile nazwa pokoju w slajderze na stronie
// glownej (HomeHotelMobileSlider). Wcześniej text-2xl (32px) wychodzil wieksze niz
// home przy tej samej roli. md+ bez zmian.
const H3_CLASS =
  'text-text text-xl leading-none font-light tracking-tight uppercase md:text-3xl md:tracking-[-0.03em] lg:text-[40px]'
const DESC_CLASS = 'text-text text-base leading-[1.2]'
const LI_CLASS = 'text-text text-base leading-[1.5]'
// Mobile: ciasniejszy interlinia listy - kwadratowa galeria zabiera pol ekranu,
// wiec dane pokoju musza zmiescic sie w reszcie panelu snapu.
const LI_MOBILE_CLASS = 'text-text text-base leading-[1.4]'

// Prezentacja pokoi na /hotel jako scroll-driven "scrollytelling":
//
// Desktop (lg+): galerie pokoi ułożone pionowo po lewej przewijają się razem ze
// stroną (każda to RoomImageSlider — strzałki/swipe jak wszędzie) i każda jest
// osobnym panelem snapu (100svh + snap-start/snap-always), więc scroll zawsze
// dociąga do jednego pokoju — tak samo jak na mobile. Po prawej
// przypięty (sticky) panel danych pokoju z tym samym layoutem co dawna karta:
// nazwa + opis u góry, CTA, udogodnienia dosunięte do prawej i na dół
// (items-end + mt-auto). Aktywny pokój wybiera IntersectionObserver (linia
// detekcji rootMargin -50%/-50% na środku ekranu). Przy zmianie aktywnego panel
// jest remountowany (key={active}), więc RevealText odgrywa reveal spod maski
// (jak na restauracji/bistro) — nie fade.
//
// Mobile: stacked — galeria, pod nią dane pokoju, pokój po pokoju. Każdy pokój
// to osobny panel snapu (h-[100svh] + snap-start/snap-always w obrębie
// .snap-panels), więc scroll zatrzymuje się dokładnie na jednym pokoju:
// galeria jest zawsze kwadratowa (aspect-square), a blok danych wypełnia resztę
// panelu (flex-1 + justify-between, lista udogodnień na dole).
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
      {/* Mobile: stacked — galeria + dane pokoju, jeden pokój = jeden ekran snapu */}
      <div className="flex flex-col lg:hidden">
        {rooms.map((room) => {
          const name = pickLocale(room.name, locale)
          const description = pickLocale(room.description, locale)
          const amenities = room.amenities ?? []
          return (
            <div key={room._id} className="flex h-[100svh] snap-start snap-always flex-col">
              {/* Galeria zawsze 1:1. Bez `shrink-0` - gdy ekran jest za niski na
                  kwadrat + dane, kwadrat oddaje nadmiar (min-h-0), zamiast
                  wypychac tresc poza panel snapu. */}
              <Reveal className="relative aspect-square min-h-0 w-full overflow-hidden">
                <RoomImageSlider
                  images={room.images ?? []}
                  locale={locale}
                  prevLabel={prevLabel}
                  nextLabel={nextLabel}
                />
              </Reveal>
              {/* flex-1 + justify-between: dane wypelniaja reszte ekranu, lista
                  udogodnien siada na dole panelu (jak w makiecie). */}
              <div className="bg-bg flex min-h-0 flex-1 flex-col justify-between gap-4 px-6 py-5 md:p-8">
                <div className="flex flex-col gap-3">
                  {name && (
                    <RevealText as="h2" className={H3_CLASS}>
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
                {/* Swiadomie div/span, nie ul/li: RevealText dzieli tresc na LINIE
                    i owija kazda we wlasny div z maska, co wsadzaloby obce dzieci
                    miedzy liste a jej pozycje i lamalo semantyke (Lighthouse:
                    `list` + `listitem`). Naprawa przez liste na zewnatrz wymagalaby
                    RevealText per pozycja, czyli zmiany animacji. Udogodnienia
                    czytaja sie tu jako ciag linii tekstu - wyglad i ruch bez zmian. */}
                {amenities.length > 0 && (
                  <RevealText as="div" className="flex flex-col items-end">
                    {amenities.map((a, i) => (
                      <span key={i} className={`block ${LI_MOBILE_CLASS}`}>
                        {pickLocale(a, locale)}
                      </span>
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
              /* Kazda galeria = punkt snapu takze na desktopie: scroll dosuwa
                 pokoj do pelnego ekranu, a przypiety panel po prawej pokazuje
                 wtedy dokladnie jego dane. */
              className="relative h-[100svh] w-full snap-start snap-always overflow-hidden"
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
                        <RevealText as="h2" start="top bottom" className={H3_CLASS}>
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
                    {/* div/span zamiast listy - patrz komentarz przy wariancie
                        mobilnym powyzej. */}
                    {amenities.length > 0 && (
                      <RevealText
                        as="div"
                        start="top bottom"
                        className="mt-auto flex flex-col items-end"
                      >
                        {amenities.map((a, j) => (
                          <span key={j} className={`block ${LI_CLASS}`}>
                            {pickLocale(a, locale)}
                          </span>
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
