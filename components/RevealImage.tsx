'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SanityImage } from '@/components/SanityImage'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'

gsap.registerPlugin(ScrollTrigger)

/** Kierunek rozwijania kadru (clip-path unfold). */
type Direction = 'up' | 'down' | 'left' | 'right'

// Stan początkowy clip-path per kierunek. inset(top right bottom left) — bok
// „domknięty" na 100% to krawędź, z której kadr się rozwija.
const FROM_CLIP: Record<Direction, string> = {
  up: 'inset(100% 0% 0% 0%)', // rozwija się w górę (od dołu)
  down: 'inset(0% 0% 100% 0%)', // rozwija się w dół (od góry)
  left: 'inset(0% 0% 0% 100%)', // rozwija się w lewo (od prawej)
  right: 'inset(0% 100% 0% 0%)', // rozwija się w prawo (od lewej)
}

type Props = {
  image: Parameters<typeof SanityImage>[0]['image']
  locale: Locale
  /** Klasy na kadr (domyślnie wypełnia rodzica: absolute inset-0). */
  className?: string
  imageClassName?: string
  sizes?: string
  priority?: boolean
  /** ScrollTrigger start. Default 'top 85%'. */
  start?: string
  /**
   * Gdy podane — kadr rozwija się kierunkowo (czysty clip-path unfold, bez
   * zoomu). Gdy pominięte — domyślna wycieraczka od dołu + zoom 1.3→1 (home).
   */
  direction?: Direction
}

/**
 * Reveal zdjęcia w stylu premium studio: kadr odsłania się wycieraczką
 * (clip-path inset od dołu do góry), a zdjęcie jednocześnie zjeżdża ze skali
 * 1.3 → 1. Jednorazowo, gdy kadr wchodzi w viewport.
 *
 * Renderuje własny kadr `absolute inset-0 overflow-hidden` — wrzucany do
 * istniejącej ramki `relative overflow-hidden` w sekcji. Ruch to tylko
 * transformy + clip-path (zero reflow). `prefers-reduced-motion` → zdjęcie od
 * razu widoczne, bez animacji.
 */
export function RevealImage({
  image,
  locale,
  className,
  imageClassName,
  sizes,
  priority,
  start = 'top 85%',
  direction,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const frame = frameRef.current
      const img = imgRef.current
      if (!frame || !img) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Wariant kierunkowy — kadr rozwija się na szerokość/wysokość (bez zoomu).
        if (direction) {
          gsap.fromTo(
            frame,
            { clipPath: FROM_CLIP[direction] },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: { trigger: frame, start },
            },
          )
          return
        }

        // Domyślnie — wycieraczka od dołu + zoom 1.3→1 (strona główna).
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start } })
        tl.fromTo(
          frame,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out' },
        ).fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.3, ease: 'power3.out' }, 0)
      })

      return () => mm.revert()
    },
    { scope: frameRef },
  )

  return (
    <div ref={frameRef} className={cn('absolute inset-0 overflow-hidden', className)}>
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <SanityImage
          image={image}
          locale={locale}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', imageClassName)}
        />
      </div>
    </div>
  )
}
