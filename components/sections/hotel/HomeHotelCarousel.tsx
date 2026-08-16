'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HOME_ROOM_TYPES_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Rooms = HOME_ROOM_TYPES_QUERY_RESULT

type Props = {
  rooms: Rooms
  locale: Locale
  ctaLabel: string | null | undefined
}

// Geometria 1:1 z Figma 1184:20 (frame 1512 px). Wszystko liczone jako % tej
// ramki, zeby uklad skalowal sie razem z layout-container (max 1512):
//
//   [ peek 324 ]<-24->[ duzy 641 ]<-24->[ peek 324 ]<-24->[ peek 324 ]
//   ^ -86 (uciety)     ^ 262              ^ 926              ^ 1274
//                                         kolumna info: 926 .. 1448
//
// Wysokosci tez jako % SZEROKOSCI ramki (padding-bottom) — proporcje trzymaja
// sie przy kazdej szerokosci, bez JS i bez skoku layoutu.
const ACTIVE_W = 42.4 // 641/1512
const ACTIVE_H = 31.42 // 475/1512
const PEEK_W = 21.43 // 324/1512
const PEEK_H = 14.75 // 223/1512
const GAP = 24
// Rzad startuje przed lewa krawedzia ramki, zeby pierwszy kadr byl ucieta
// "zajawka" — 262 (lewa krawedz duzego kadru) - 324 - 24.
const ROW_OFFSET = 17.33 - PEEK_W // % ramki; do tego -GAP px
const INFO_LEFT = 61.24 // 926/1512
const INFO_RIGHT = 4.23 // (1512-1448)/1512 — rowne paddingowi layout-container
// Wysokosc peeka wyrazona w % szerokosci kolumny info (522 px) — spacer, ktory
// spycha nazwe/opis dokladnie pod dolna krawedz peekow.
const INFO_SPACER_H = 42.72 // 223/522
// Wysokosc duzego kadru w % szerokosci kolumny info — minimalna wysokosc
// kolumny, dzieki ktorej CTA laduje rowno z dolem kadru.
const INFO_MIN_H = 90.99 // 475/522
// Info dzieli sie na dwie kolumny 1:1 z kadrami nad soba: nazwa/opis/CTA pod
// 3. kadrem, strzalki pod 4. Pierwsza kolumna ma szerokosc peeka wyrazona w %
// szerokosci kolumny info (324/522), reszta zostaje na strzalki.
const INFO_COL_1 = 62.06 // 324/522

// Kolejnosc slotow w rzedzie: 4 pierwsze zdjecia pokoju, od lewej do prawej.
// Drugi slot jest duzy — to on niesie kadr wiodacy.
const SLOTS = [
  { w: PEEK_W, h: PEEK_H },
  { w: ACTIVE_W, h: ACTIVE_H },
  { w: PEEK_W, h: PEEK_H },
  { w: PEEK_W, h: PEEK_H },
]

/**
 * Blok Hotel (desktop) — 4 kadry z galerii AKTYWNEGO pokoju + jego nazwa, opis
 * i CTA. Strzalki przelaczaja pokoj; zmiana to przenikanie (crossfade), nie
 * przesuniecie: wszystkie pokoje sa w DOM-ie, jeden na drugim, i steruje nimi
 * wylacznie opacity — dzieki temu nowy kadr nie "mryga" na czas doladowania.
 */
export function HomeHotelCarousel({ rooms, locale, ctaLabel }: Props) {
  const t = useTranslations('hotel')
  const count = rooms.length
  const [active, setActive] = useState(0)

  if (count === 0) return null

  const go = (dir: 1 | -1) => setActive((i) => (i + dir + count) % count)

  const activeRoom = rooms[active]
  const name = pickLocale(activeRoom?.name, locale)
  const description = pickLocale(activeRoom?.description, locale)

  // Ten sam rozmiar i obrys co standardowy button (DESIGN-RULES 5: h-[60px],
  // wariant outline-dark) — kolka nav nie moga byc wieksze od CTA obok.
  const arrowClass =
    'border-primary text-primary hover:bg-primary hover:text-primary-foreground flex size-[60px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-colors'

  return (
    /* Grid 1x1: rzad kadrow i kolumna info leza w tej samej komorce, wiec
       wysokosc bloku to max(wysokosc duzego kadru, wysokosc kolumny info) —
       nic nie wychodzi poza sekcje na wezszych desktopach. */
    <div className="mx-auto grid w-full max-w-[1512px] grid-cols-1">
      {/* Rzad kadrow — wrapper ma szerokosc ramki, wiec translateX w % liczy sie
          wzgledem ramki (a nie wzgledem przepelnionego rzedu). */}
      <div
        className="col-start-1 row-start-1 min-w-0 self-start"
        style={{ transform: `translateX(calc(${ROW_OFFSET}% - ${GAP}px))` }}
      >
        <ul className="flex items-start" style={{ gap: `${GAP}px` }}>
          {SLOTS.map((slot, slotIndex) => (
            <li
              key={slotIndex}
              className="relative shrink-0 overflow-hidden"
              style={{ width: `${slot.w}%`, paddingBottom: `${slot.h}%` }}
            >
              {rooms.map((room, roomIndex) => {
                const images = room.wideImages ?? []
                if (images.length === 0) return null
                // Pokoj moze miec mniej niz 4 zdjecia — wtedy sloty cykluja.
                const image = images[slotIndex % images.length]
                const isActive = roomIndex === active
                return (
                  <div
                    key={room._id}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <SanityImage
                      image={image}
                      locale={locale}
                      fill
                      sizes={slot.w === ACTIVE_W ? '45vw' : '25vw'}
                    />
                  </div>
                )
              })}
            </li>
          ))}
        </ul>
      </div>

      {/* Kolumna info — pod peekami, wyrownana do prawej krawedzi kontenera.
          Wewnatrz znowu grid 1x1: rozporka o wysokosci duzego kadru + tresc w
          tej samej komorce, wiec kolumna ma wysokosc max(kadr, tresc). Na 1512
          wygrywa kadr i CTA (mt-auto) siada rowno z jego dolem jak w Figmie; na
          wezszych desktopach, gdzie tekst 16 px nie skaluje sie razem z kadrem,
          wygrywa tresc i nic nie wychodzi poza sekcje. */}
      {/* relative z-10 jest KONIECZNE: rzad kadrow ma transform, wiec tworzy
          kontekst ukladania i maluje sie nad zwyklym blokiem — bez tego <ul>
          przykrywa strzalki i klikniecia do nich nie docieraja. */}
      <div
        className="relative z-10 col-start-1 row-start-1 grid min-w-0 grid-cols-1 self-start"
        style={{ marginLeft: `${INFO_LEFT}%`, marginRight: `${INFO_RIGHT}%` }}
      >
        <div
          aria-hidden
          className="col-start-1 row-start-1"
          style={{ paddingBottom: `${INFO_MIN_H}%` }}
        />
        <div className="col-start-1 row-start-1 flex min-w-0 flex-col">
          <div aria-hidden style={{ paddingBottom: `${INFO_SPACER_H}%` }} />
          {/* Info dziedziczy siatke kadrow nad soba: nazwa/opis/CTA siedza w
              kolumnie 3. kadru, strzalki w kolumnie 4. Rozporka wysokosci peeka
              jest WYZEJ (wspolna dla obu kolumn), wiec oba slupki startuja na
              tej samej wysokosci niezaleznie od szerokosci ekranu. */}
          <div
            className="grid flex-1"
            style={{ gridTemplateColumns: `${INFO_COL_1}% auto`, columnGap: `${GAP}px` }}
          >
            <div className="flex min-w-0 flex-col pt-6">
              {/* key={active} — remount odpala fade tak samo jak przy kadrach. */}
              <div key={active} className="animate-lb-fade-in flex flex-col gap-3">
                {name && <h3 className="text-text text-xl font-normal uppercase">{name}</h3>}
                {/* Opis zostaje w kanonicznych 16 px (DESIGN-RULES 1.1), ale
                    pokazujemy go dopiero od 1440 px. Nizej kolumna kadru jest
                    za waska: nazwa lamie sie na dwie linie, opis rosnie do 4-5
                    i CTA wypada ponizej dolnej krawedzi duzego kadru. Lepiej
                    schowac opis niz zmniejszac go pod skale podpisow. */}
                {description && (
                  <p className="text-text wide:block hidden text-base">{description}</p>
                )}
              </div>

              {ctaLabel && (
                /* mt-auto dosuwa CTA do dolu kolumny (rowno z dolem duzego
                   kadru); pt-3 to tylko minimalny odstep od opisu — przy
                   najdluzszym z opisow pokoi (4 linie) kolumna wciaz miesci
                   sie w kadrze. */
                <div className="mt-auto pt-3">
                  <ReservationCtaButton
                    tab="room"
                    variant="filled-dark"
                    className="min-w-[224px] whitespace-nowrap"
                  >
                    {ctaLabel}
                  </ReservationCtaButton>
                </div>
              )}
            </div>

            {/* Kolumna 2 — pod 4. kadrem. Strzalki do lewej krawedzi kolumny,
                czyli dokladnie pod lewa krawedzia tego kadru. */}
            {count > 1 && (
              <div className="flex h-fit gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t('prevRoom')}
                  className={arrowClass}
                >
                  <ChevronLeft className="size-6" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t('nextRoom')}
                  className={arrowClass}
                >
                  <ChevronRight className="size-6" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
