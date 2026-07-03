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
  /** Klasy na kadr (domyślnie wypełnia rodzica: absolute inset-0). */
  className?: string
  imageClassName?: string
  sizes?: string
  priority?: boolean
  /** ScrollTrigger start. Default 'top 85%'. */
  start?: string
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
