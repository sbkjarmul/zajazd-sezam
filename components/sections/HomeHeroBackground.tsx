'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SanityImage } from '@/components/SanityImage'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  image: Parameters<typeof SanityImage>[0]['image']
  locale: Locale
  /** Klasy na obraz (np. object-position). */
  imageClassName?: string
  priority?: boolean
}

// Subtelny parallax tła strony głównej w stylu gocanopy.tech —
// TŁO DRYFUJE WOLNIEJ NIŻ TREŚĆ.
//
// Zdjęcie jest w normalnym flow sekcji (przewija się w górę razem ze stroną),
// a ScrollTrigger (scrub) przesuwa je jednocześnie lekko W DÓŁ w miarę scrolla —
// co częściowo kompensuje ruch strony i sprawia, że tło wydaje się poruszać
// wolniej niż tekst hero nad nim. Bez zoomu (zgodnie z ustaleniem z klientem).
//
// Kadr wewnętrzny jest o 30% wyższy niż sekcja i wysunięty o -15% w górę, więc
// dryf pionowy (yPercent 0 → DRIFT) nigdy nie odsłania krawędzi obrazu.
const INNER_OVERSCAN = '-top-[15%] h-[130%]'
const DRIFT_PERCENT = 10 // % wysokości kadru wewn. (130% sekcji) → ~13% sekcji
const ZOOM_START = 1.12 // skala startowa load reveal (zoom-out do 1.0)
const ZOOM_DURATION_S = 2.4

export function HomeHeroBackground({ image, locale, imageClassName, priority }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const frame = frameRef.current
      const inner = innerRef.current
      const zoom = zoomRef.current
      if (!frame || !inner || !zoom) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Scroll parallax — dryf pionowy (tło wolniej niż treść).
        const drift = gsap.to(inner, {
          yPercent: DRIFT_PERCENT,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
        // Load reveal — zoom-out zdjęcia przy wejściu (osobny wrapper, nie koliduje
        // z translateY parallaxu na `inner`).
        const zoomIn = gsap.from(zoom, {
          scale: ZOOM_START,
          duration: ZOOM_DURATION_S,
          ease: 'power2.out',
        })
        return () => {
          drift.scrollTrigger?.kill()
          drift.kill()
          zoomIn.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: frameRef },
  )

  return (
    <div ref={frameRef} className="absolute inset-0 -z-20 overflow-hidden">
      <div ref={innerRef} className={cn('absolute inset-x-0', INNER_OVERSCAN)}>
        <div ref={zoomRef} className="absolute inset-0">
          <SanityImage
            image={image}
            locale={locale}
            fill
            priority={priority}
            sizes="100vw"
            className={cn('object-cover', imageClassName)}
          />
        </div>
      </div>
    </div>
  )
}
