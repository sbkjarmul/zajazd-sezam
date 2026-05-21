'use client'

import { useEffect, useRef } from 'react'
import { SanityImage } from '@/components/SanityImage'
import type { Locale } from '@/i18n/routing'

type Props = {
  image: Parameters<typeof SanityImage>[0]['image']
  locale: Locale
}

// Cienki band image w hero Restauracja (aspect 1512/359) z parallax effectem.
// Inner wrapper jest 30% wyższy od container'a (-15% top, -15% bottom), więc
// translateY do ±15% wysokości pozostaje w granicach bez ujawniania pustego
// miejsca. Wartość transform zależy od scroll progress (0 gdy band wjeżdża w
// viewport od dołu, 1 gdy wyjeżdża górą).
const PARALLAX_RANGE_PCT = 25 // total ±12.5% wokół centrum, mniej niż 15% safe zone

export function RestaurantHeroBand({ image, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafScheduled = false
    const update = () => {
      rafScheduled = false
      const container = containerRef.current
      const inner = innerRef.current
      if (!container || !inner) return

      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 0 gdy top container = bottom viewport, 1 gdy bottom container = top viewport
      const progress = (vh - rect.top) / (vh + rect.height)
      const clamped = Math.max(0, Math.min(1, progress))
      // (progress 0.5 = środek viewportu) → 0 offset. Skrajne → ±(RANGE/2)%
      const offsetPct = (clamped - 0.5) * PARALLAX_RANGE_PCT
      inner.style.transform = `translate3d(0, ${offsetPct}%, 0)`
    }

    const onScroll = () => {
      if (rafScheduled) return
      rafScheduled = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative aspect-[1512/359] w-full overflow-hidden">
      <div
        ref={innerRef}
        className="absolute right-0 -bottom-[15%] left-0 -top-[15%]"
        style={{ willChange: 'transform' }}
      >
        <SanityImage
          image={image}
          locale={locale}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_75%]"
        />
      </div>
    </div>
  )
}
