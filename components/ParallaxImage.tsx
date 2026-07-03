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
}

// Parallax zdjęcia na scroll — ten sam charakter co tło hero (subtelny dryf Y,
// tło porusza się wolniej niż treść). Dla sekcji w środku strony: dryf ±DRIFT
// rozłożony na czas przechodzenia sekcji przez viewport (scrub).
//
// Kadr wewnętrzny jest o 30% wyższy i wysunięty o -15%, więc dryf nigdy nie
// odsłania krawędzi obrazu. `prefers-reduced-motion` → brak animacji.
const INNER_OVERSCAN = '-top-[15%] h-[130%]'
const DRIFT_PERCENT = 8 // % wysokości kadru wewn. (130% sekcji)

export function ParallaxImage({
  image,
  locale,
  className,
  imageClassName,
  sizes,
  priority,
  loading,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const frame = frameRef.current
      const inner = innerRef.current
      if (!frame || !inner) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.fromTo(
          inner,
          { yPercent: -DRIFT_PERCENT },
          {
            yPercent: DRIFT_PERCENT,
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
    { scope: frameRef },
  )

  return (
    <div ref={frameRef} className={cn('absolute inset-0 overflow-hidden', className)}>
      <div ref={innerRef} className={cn('absolute inset-x-0', INNER_OVERSCAN)}>
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
