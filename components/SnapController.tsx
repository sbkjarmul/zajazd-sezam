'use client'

import { useEffect } from 'react'

// Wlacza natywny CSS scroll-snap na oknie na czas, gdy strona z wrapperem
// .snap-panels jest zamontowana (klasa `snap-y-page` na <html> aktywuje reguly
// z globals.css). Na tych stronach Lenis jest wylaczony (SmoothScroll), wiec
// natywny snap dziala czysto - jak na satius.app (reakcja na predkosc,
// natychmiastowe dociagniecie). Snap zostaje na oknie, wiec GSAP (parallax),
// Reveal i scroll-aware header dzialaja bez zmian. Sprzatane przy wyjsciu.
export function SnapController() {
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('snap-y-page')
    return () => html.classList.remove('snap-y-page')
  }, [])

  return null
}
