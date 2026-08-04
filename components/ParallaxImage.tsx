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
  /** Klasy kadru (domyślnie wypełnia rodzica: absolute inset-0). */
  className?: string
  imageClassName?: string
  sizes?: string
  priority?: boolean
  loading?: 'eager' | 'lazy'
  /** Siła parallaxu — ±yPercent dryfu kadru wewn. Default 8 (subtelny). */
  driftPercent?: number
}

// Parallax zdjęcia na scroll — ten sam charakter co tło hero (dryf Y, tło porusza
// się wolniej niż treść). Dryf ±driftPercent rozłożony na czas przechodzenia
// sekcji przez viewport (scrub).
//
// Kadr wewnętrzny jest wyższy i wysunięty w górę tak, by dryf nigdy nie odsłaniał
// krawędzi — overscan skaluje się z driftem (dla drift=8 → h-130%/-top-15%, jak
// dotąd). `prefers-reduced-motion` → brak animacji.
const DEFAULT_DRIFT = 8

export function ParallaxImage({
  image,
  locale,
  className,
  imageClassName,
  sizes,
  priority,
  loading,
  driftPercent = DEFAULT_DRIFT,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Overscan wyliczony z driftu (bezpieczny margines > realny dryf): dla drift=8
  // daje height 130% / top -15% (zgodnie z dotychczasowym zachowaniem).
  const innerHeightPercent = 100 + 3.75 * driftPercent
  const innerTopPercent = -(innerHeightPercent - 100) / 2

  useGSAP(
    () => {
      const frame = frameRef.current
      const inner = innerRef.current
      if (!frame || !inner) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.fromTo(
          inner,
          { yPercent: -driftPercent },
          {
            yPercent: driftPercent,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      })

      return () => mm.revert()
    },
    // Bez `dependencies`: driftPercent jest staly per uzycie (nie zmienia sie w
    // runtime), a niepuste dependencies w useGSAP wlaczaja warunkowy hook
    // (deferCleanup) -> "change in order of Hooks". Tween tworzony raz.
    { scope: frameRef },
  )

  return (
    <div ref={frameRef} className={cn('absolute inset-0 overflow-hidden', className)}>
      <div
        ref={innerRef}
        className="absolute inset-x-0"
        style={{ top: `${innerTopPercent}%`, height: `${innerHeightPercent}%` }}
      >
        <SanityImage
          image={image}
          locale={locale}
          fill
          sizes={sizes}
          priority={priority}
          loading={loading}
          className={cn('object-cover', imageClassName)}
        />
      </div>
    </div>
  )
}
