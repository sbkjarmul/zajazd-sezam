'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// Lenis w osobnym chunku (patrz LenisRoot). Statyczny import wciagal ~68 kB
// biblioteki takze na strony, ktore ja wylaczaja ponizej.
//
// `ssr: false` jest tu bezpieczne TYLKO dlatego, ze LenisRoot nie opakowuje
// dzieci - w trybie root Lenis przejmuje scroll okna bez wrappera DOM, wiec
// stoi obok tresci. Gdyby opakowywal, wylaczenie SSR zabraloby serwerowy render
// calej strony. Przy `ssr: true` chunk i tak trafial do bundla kazdej trasy,
// bo warunek ponizej rozstrzyga sie dopiero w runtime.
const LenisRoot = dynamic(() => import('@/components/LenisRoot'), { ssr: false })

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
  const pathname = usePathname()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSmooth(!mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Strony z pelnoekranowym snapem (home + imprezy + hotel) uzywaja natywnego
  // CSS scroll-snap (jak satius.app) -> wylaczamy tam Lenisa, bo smooth-scroll
  // bije sie z natywnym snapem (JS vs compositor). Pozostale strony zachowuja
  // globalny smooth-scroll.
  const nativeScrollPage =
    pathname === '/pl' ||
    pathname === '/en' ||
    pathname.endsWith('/imprezy-okolicznosciowe') ||
    pathname.endsWith('/events') ||
    pathname.endsWith('/hotel')

  // Lenis stoi OBOK tresci, nie wokol niej - patrz komentarz przy imporcie.
  return (
    <>
      {smooth && !nativeScrollPage && <LenisRoot />}
      {children}
    </>
  )
}
