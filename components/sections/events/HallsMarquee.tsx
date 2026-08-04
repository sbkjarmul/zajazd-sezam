'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Lightbox } from '@/components/ui/Lightbox'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Hall = NonNullable<NonNullable<EVENTS_PAGE_QUERY_RESULT>['halls']>[number]

// Prędkość dryfu taśmy w px/s — spokojny, powolny ruch.
const SPEED = 20
// Powiększenie kafla po najechaniu — 1.5× (skala elementu, nie zoom-kadr).
const SCALE = 1.5
// Odstęp między powiększonym zdjęciem a tekstem (px) — żeby tekst nie nachodził.
const GAP = 28
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'

// Geometria najechanego kafla — jego surowe wymiary; resztę (przyrosty, push)
// liczą już poszczególne kafle z SCALE.
type Hovered = { i: number; w: number; h: number } | null

// Pojedynczy kafel taśmy — poziome zdjęcie 4:3.
// Po najechaniu (desktop): kafel rośnie 1.5×, sąsiedzi rozsuwają się na boki,
// a nad/pod zdjęciem pojawiają się opisy (pojemność u góry, nazwa + opis u dołu),
// dociągnięte do lewej i rozciągnięte na szerokość powiększonego zdjęcia.
// Na mobile opisy są w normalnym flow (pojemność nad, nazwa + opis pod zdjęciem).
function HallMarqueeItem({
  index,
  hovered,
  hall,
  locale,
  onEnter,
  onLeave,
  onOpen,
}: {
  index: number
  hovered: Hovered
  hall: Hall
  locale: Locale
  onEnter: (i: number, box: HTMLElement) => void
  onLeave: () => void
  onOpen: (hall: Hall) => void
}) {
  const name = pickLocale(hall.name, locale)
  const desc = pickLocale(hall.description, locale)
  const cover = (hall.images ?? [])[0]
  const capacityLabel =
    hall.capacity != null
      ? locale === 'pl'
        ? `Sala do ${hall.capacity} osób`
        : `Room for up to ${hall.capacity} guests`
      : null
  const label =
    locale === 'pl' ? `Otwórz galerię — ${name ?? 'sala'}` : `Open gallery — ${name ?? 'hall'}`

  const isActive = hovered?.i === index
  const isShifted = hovered != null && !isActive

  // Przyrosty rozmiaru najechanego kafla (te same dla wszystkich — jeden rozmiar).
  const halfW = hovered ? (hovered.w * (SCALE - 1)) / 2 : 0
  const halfH = hovered ? (hovered.h * (SCALE - 1)) / 2 : 0
  const push = halfW + GAP
  const shiftX = isShifted ? (index < hovered.i ? -push : push) : 0

  // Opisy przy aktywnym kaflu: dociągnięte do lewej krawędzi powiększonego zdjęcia
  // (−halfW), rozciągnięte na jego szerokość (w·SCALE); pojemność nad, reszta pod.
  const capStyle = hovered
    ? { left: `${-halfW}px`, width: `${hovered.w * SCALE}px` }
    : undefined
  // Fade z opacity 0 z opóźnieniem — napisy wchodzą dopiero, gdy zdjęcie zdąży
  // się powiększyć (skala trwa 0.6s, więc opóźnienie ~0.35s).
  const capReveal = { transition: 'opacity 0.4s ease 0.35s' }
  const topActive = isActive
    ? { ...capStyle, ...capReveal, opacity: 1, transform: `translateY(${-(halfH + GAP)}px)` }
    : undefined
  const bottomActive = isActive
    ? { ...capStyle, ...capReveal, opacity: 1, transform: `translateY(${halfH + GAP}px)` }
    : undefined

  return (
    <div
      className="relative mr-2 w-[66vw] flex-none snap-start lg:mr-6 lg:w-auto lg:snap-align-none"
      style={{
        transform: `translateX(${shiftX}px)`,
        transition: `transform 0.6s ${EASE}`,
        zIndex: isActive ? 30 : 1,
      }}
      onMouseEnter={(e) => {
        const box = e.currentTarget.querySelector('[data-box]') as HTMLElement | null
        if (box) onEnter(index, box)
      }}
      onMouseLeave={onLeave}
    >
      {/* Pojemność — nad zdjęciem (desktop: absolutna, wjeżdża na hoverze) */}
      <div
        aria-hidden={!isActive}
        className="mb-2 text-left lg:absolute lg:bottom-full lg:left-0 lg:mb-0 lg:opacity-0 lg:transition-opacity lg:duration-300"
        style={topActive}
      >
        {capacityLabel && <p className="text-text-muted text-sm">{capacityLabel}</p>}
      </div>

      <button
        type="button"
        data-box
        onClick={() => onOpen(hall)}
        aria-label={label}
        className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden select-none lg:w-[300px]"
        style={{
          transform: isActive ? `scale(${SCALE})` : 'scale(1)',
          transformOrigin: 'center center',
          transition: `transform 0.6s ${EASE}`,
        }}
      >
        <SanityImage
          image={cover}
          locale={locale}
          fill
          sizes="(max-width: 1024px) 66vw, 300px"
          className="object-cover"
        />
      </button>

      {/* Nazwa + opis — pod zdjęciem, do lewej (desktop: absolutne, wjeżdżają na hoverze) */}
      <div
        aria-hidden={!isActive}
        className="mt-3 flex flex-col items-start gap-1 text-left lg:absolute lg:top-full lg:left-0 lg:mt-0 lg:pt-1 lg:opacity-0 lg:transition-opacity lg:duration-300"
        style={bottomActive}
      >
        {name && <p className="text-text text-xl leading-none font-normal tracking-tight">{name}</p>}
        {desc && <p className="text-text-muted text-sm">{desc}</p>}
      </div>
    </div>
  )
}

type Props = {
  halls: Hall[]
  locale: Locale
}

// Taśma sal — zapętlony, powolny dryf poziomych zdjęć (GSAP). Najechanie na kafel
// zatrzymuje taśmę, powiększa zdjęcie 1.5×, rozsuwa sąsiadów i pokazuje opisy;
// kliknięcie otwiera galerię (Lightbox).
// Desktop: 3 zestawy sal → nieskończona pętla. Mobile / reduced-motion: jeden
// zestaw, natywny scroll poziomy, opisy stale widoczne przy zdjęciach.
export function HallsMarquee({ halls, locale }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const [copies, setCopies] = useState(1)
  const [hovered, setHovered] = useState<Hovered>(null)
  const [active, setActive] = useState<Hall | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const apply = () => setCopies(mq.matches ? 3 : 1)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track || copies < 2) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (!window.matchMedia('(min-width: 1024px)').matches) return

      // Każdy kafel ma margin-right (nie flex-gap), więc jeden zestaw =
      // scrollWidth / copies dokładnie → bezszwowa pętla.
      const setWidth = track.scrollWidth / copies
      if (!setWidth) return

      // Start przesunięty o jeden zestaw w lewo, animacja do 0 → ruch od lewej
      // do prawej; przy zawinięciu skok 0 → -setWidth jest niewidoczny (klony).
      gsap.set(track, { x: -setWidth })
      const tween = gsap.to(track, {
        x: 0,
        duration: setWidth / SPEED,
        ease: 'none',
        repeat: -1,
      })
      tweenRef.current = tween

      return () => {
        tween.kill()
        tweenRef.current = null
      }
    },
    { dependencies: [copies, halls.length], scope: rootRef },
  )

  const onEnter = useCallback((i: number, box: HTMLElement) => {
    // Hover-interakcja tylko na desktopie (dotyk otwiera galerię przez klik).
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    tweenRef.current?.pause()
    setHovered({ i, w: box.offsetWidth, h: box.offsetHeight })
  }, [])

  const onLeave = useCallback(() => {
    setHovered(null)
    tweenRef.current?.resume()
  }, [])

  const openHall = useCallback((hall: Hall) => {
    setActive(hall)
    setOpen(true)
  }, [])

  const sets = Array.from({ length: copies })

  return (
    <div ref={rootRef}>
      <div className="snap-x snap-mandatory scroll-px-4 overflow-x-auto overflow-y-visible [scrollbar-width:none] lg:snap-none lg:overflow-x-clip [&::-webkit-scrollbar]:hidden">
        <div ref={trackRef} className="flex w-max px-4 will-change-transform lg:px-0">
          {sets.map((_, s) =>
            halls.map((hall, j) => {
              const index = s * halls.length + j
              return (
                <HallMarqueeItem
                  key={`${s}-${hall._id}`}
                  index={index}
                  hovered={hovered}
                  hall={hall}
                  locale={locale}
                  onEnter={onEnter}
                  onLeave={onLeave}
                  onOpen={openHall}
                />
              )
            }),
          )}
        </div>
      </div>

      <Lightbox
        images={active?.images ?? []}
        locale={locale}
        open={open}
        onOpenChange={setOpen}
        title={pickLocale(active?.name, locale) ?? undefined}
      />
    </div>
  )
}
