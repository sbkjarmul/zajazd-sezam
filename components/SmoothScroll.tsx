'use client'

import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

/**
 * Globalny smooth-scroll (Lenis) na roocie strony.
 *
 * `root` → Lenis przejmuje scroll okna (działa z istniejącym
 * useScrollDirection, bo Lenis aktualizuje natywną pozycję scrolla).
 * Szanujemy `prefers-reduced-motion` — przy włączonym renderujemy dzieci bez
 * Lenis (natywny scroll). W trybie root ReactLenis nie dodaje wrappera DOM,
 * więc przełączenie nie powoduje hydration mismatch.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [smooth, setSmooth] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSmooth(!mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (!smooth) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
