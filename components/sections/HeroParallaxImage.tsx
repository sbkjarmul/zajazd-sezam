'use client'

import { useEffect, useRef } from 'react'
import { SanityImage } from '@/components/SanityImage'
import type { Locale } from '@/i18n/routing'

type Props = {
  image: Parameters<typeof SanityImage>[0]['image']
  locale: Locale
}

// Hero image fixed do viewportu z scroll-based parallax effect.
//
// Skala zawsze pozostaje w zakresie [1.0, LOAD_START_SCALE] — nigdy poniżej 1.0,
// żeby przy maksymalnym oddaleniu wciąż wypełniała viewport (brak białej ramki).
//
// Animacja:
//   1. Load reveal (10s ease-out): scale LOAD_START_SCALE (1.2) → LOAD_END_SCALE (1.1)
//      — zdjęcie startuje "zoomed-in" i powoli ustępuje do bazowego 1.1×
//   2. Scroll parallax: skala odejmowana w zakresie [0, (LOAD_END_SCALE - SCROLL_FLOOR)]
//      = 0 do 0.1, w funkcji scrollY/viewportHeight (clamped 0..1)
//
// Łącznie:  finalScale = loadScale - scrollOffset, zawsze ≥ 1.0
//   - t=0, scroll=0     → 1.20 (max zoom początkowy)
//   - t=10s, scroll=0   → 1.10 (settled)
//   - t=10s, scroll=1vh → 1.00 (max recede, jeszcze pokrywa viewport)
//
// Następne sekcje z bg-bg solid wjeżdżają nad fixed image i wizualnie ją zakrywają.
const LOAD_DURATION_MS = 10_000
const LOAD_START_SCALE = 1.2
const LOAD_END_SCALE = 1.1
const SCROLL_FLOOR = 1.0
const SCROLL_AMPLITUDE = LOAD_END_SCALE - SCROLL_FLOOR

export function HeroParallaxImage({ image, locale }: Props) {
  const outerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const el = outerRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = `scale(${LOAD_END_SCALE})`
      return
    }

    const startTime = performance.now()
    let rafScheduled = false

    const update = () => {
      rafScheduled = false
      const node = outerRef.current
      if (!node) return

      const sy = window.scrollY
      const vh = window.innerHeight || 1
      const scrollProgress = Math.min(1, Math.max(0, sy / vh))

      const loadElapsed = performance.now() - startTime
      const loadProgress = Math.min(1, loadElapsed / LOAD_DURATION_MS)
      // ease-out-cubic
      const loadEase = 1 - Math.pow(1 - loadProgress, 3)
      const loadScale = LOAD_START_SCALE - (LOAD_START_SCALE - LOAD_END_SCALE) * loadEase

      const scrollOffset = SCROLL_AMPLITUDE * scrollProgress
      const finalScale = loadScale - scrollOffset

      node.style.transform = `scale(${finalScale})`

      if (loadProgress < 1) schedule()
    }

    const schedule = () => {
      if (rafScheduled) return
      rafScheduled = true
      requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return (
    <div
      ref={outerRef}
      className="fixed inset-0 -z-20"
      style={{
        transformOrigin: 'center',
        willChange: 'transform',
        transform: `scale(${LOAD_START_SCALE})`,
      }}
    >
      <div className="relative h-full w-full">
        <SanityImage image={image} locale={locale} fill priority sizes="100vw" />
      </div>
    </div>
  )
}
