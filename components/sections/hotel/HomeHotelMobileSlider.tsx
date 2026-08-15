'use client'

import { useEffect, useRef } from 'react'
import type { HOME_ROOM_TYPES_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  rooms: HOME_ROOM_TYPES_QUERY_RESULT
  locale: Locale
}

// Ile kopii listy renderujemy. 3 = jedna z lewej na zapas, srodkowa "prawdziwa"
// i jedna z prawej — wystarczy, zeby po obu stronach zawsze bylo co pokazac.
const COPIES = 3

/**
 * Slider pokoi na mobile (Figma 1091:2) — zapetlony w obie strony: za ostatnim
 * pokojem znow leci pierwszy, przed pierwszym ostatni.
 *
 * Zapetlenie bez biblioteki: renderujemy liste 3x i trzymamy scroll w srodkowej
 * kopii. Gdy uzytkownik z niej wyjedzie, po zatrzymaniu scrolla przesuwamy
 * scrollLeft o dokladnie jedna dlugosc kopii — czyli o calkowita wielokrotnosc
 * odstepu miedzy slajdami. Kazdy slajd laduje wtedy piksel w piksel tam, gdzie
 * byl, wiec przeskok jest niewidoczny, a scroll-snap nie ma czego korygowac.
 */
export function HomeHotelMobileSlider({ rooms, locale }: Props) {
  const ref = useRef<HTMLUListElement>(null)
  const count = rooms.length

  useEffect(() => {
    const el = ref.current
    // Przy jednym pokoju nie ma czego zapetlac.
    if (!el || count < 2) return

    let raf = 0
    let lastWidth = -1

    // Mierzymy przy KAZDYM uzyciu, nie raz na starcie: slajdy zmieniaja
    // szerokosc razem z ekranem, a przy montazu layout bywa jeszcze nieustalony
    // (zwraca zera) - jednorazowy pomiar cicho wylaczalby zapetlenie.
    const metrics = () => {
      const items = el.querySelectorAll<HTMLLIElement>('li')
      if (items.length < 2) return null
      const pitch = items[1].offsetLeft - items[0].offsetLeft
      if (pitch <= 0) return null
      return {
        copy: pitch * count,
        // scrollLeft, przy ktorym slajd 0 stoi na srodku scrollportu.
        center: items[0].offsetLeft + items[0].offsetWidth / 2 - el.clientWidth / 2,
      }
    }

    const normalize = () => {
      const m = metrics()
      if (!m) return
      const sl = el.scrollLeft
      if (sl < m.center + m.copy * 0.5) el.scrollLeft = sl + m.copy
      else if (sl > m.center + m.copy * 1.5) el.scrollLeft = sl - m.copy
    }

    // Start na pierwszym pokoju srodkowej kopii - z podgladem kart po obu stronach.
    const goToMiddle = () => {
      const m = metrics()
      if (!m) return false
      el.scrollLeft = m.center + m.copy
      lastWidth = el.clientWidth
      return true
    }

    // Ustawiamy pozycje OD RAZU - useEffect leci juz po commicie layoutu, wiec
    // offsetLeft sa policzone. requestAnimationFrame jest tylko awaryjna probka
    // dla przypadku, gdy pomiar jeszcze nie wychodzi; nie moze byc sciezka
    // glowna, bo w karcie w tle rAF jest wstrzymany i slider zostalby
    // nieziniciowany na pozycji 0.
    if (!goToMiddle()) {
      let tries = 0
      const retry = () => {
        if (goToMiddle() || ++tries > 30) return
        raf = requestAnimationFrame(retry)
      }
      raf = requestAnimationFrame(retry)
    }

    // Normalizujemy dopiero na `scrollend` - czyli po dojezdzie snapa i po
    // wygasnieciu bezwladnosci. Ruszanie scrollLeft w trakcie gestu przerywa
    // momentum scroll na iOS, wiec to nie jest tylko kosmetyka.
    el.addEventListener('scrollend', normalize)

    // Tylko zmiana SZEROKOSCI zmienia odstep miedzy slajdami. Filtr na wysokosc
    // jest istotny: dogrywajace sie zdjecia zmieniaja wysokosc i bez tego
    // slider co chwile odskakiwalby uzytkownikowi na pierwszy pokoj.
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth
      if (w === lastWidth) return
      goToMiddle()
    })
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scrollend', normalize)
      ro.disconnect()
    }
  }, [count])

  if (count === 0) return null

  const slides = Array.from({ length: count * COPIES }, (_, i) => ({
    room: rooms[i % count],
    // Tylko srodkowa kopia jest "prawdziwa" dla czytnikow ekranu — reszta to
    // wizualny zapas, ktory inaczej przeczytalby liste pokoi trzy razy.
    duplicate: Math.floor(i / count) !== Math.floor(COPIES / 2),
  }))

  return (
    <ul
      ref={ref}
      className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-4 md:px-16 [&::-webkit-scrollbar]:hidden"
    >
      {slides.map(({ room, duplicate }, i) => {
        const roomName = pickLocale(room.name, locale)
        const roomDescription = pickLocale(room.description, locale)
        return (
          <li
            key={`${room._id}-${i}`}
            aria-hidden={duplicate}
            className="flex w-[calc(100%-3rem)] shrink-0 snap-center flex-col gap-8"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <SanityImage image={room.wideImages?.[0]} locale={locale} fill sizes="100vw" />
            </div>
            <div className="flex flex-col gap-4 text-center">
              {roomName && <h3 className="text-text text-xl font-normal uppercase">{roomName}</h3>}
              {roomDescription && <p className="text-text text-base">{roomDescription}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
