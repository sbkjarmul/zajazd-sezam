'use client'

import { useEffect, useState } from 'react'

export type HeaderTheme = 'dark' | 'light'

export type ActiveHeader = {
  theme: HeaderTheme
  // Kolor „powierzchni" gradientu headera = tlo sekcji. Sekcja podaje go przez
  // `data-header-surface` (np. biale tlo -> #fff, sezam dark -> var(--color-primary)),
  // inaczej null = domyslka wg motywu (krem dla jasnych, prop darkGradient dla
  // ciemnych). Dziala dla obu wariantow, nie tylko jasnych.
  surface: string | null
  // Czy nad ta sekcja rysowac gradient headera. Sekcja wylacza go przez
  // `data-header-gradient="off"` — np. hero, ktore ma zostac czystym kadrem
  // (przyciemnienie u gory zjadaloby pierwsza linie naglowka).
  gradient: boolean
}

// Sledzi sekcje aktualnie pod (mobilnym) headerem. Sekcje deklaruja
// `data-header-theme="dark|light"` (kontrast) i opcjonalnie
// `data-header-surface="<kolor>"` (kolor jasnego gradientu). Hook szuka tej,
// ktorej pionowy zakres obejmuje linie probna headera (probeY). Miedzy sekcjami
// (laczniki bez taga) trzyma ostatnia wartosc -> zmiana dopiero gdy kolejna
// sekcja dojedzie do headera, bez migotania.
export function useActiveHeaderTheme(
  enabled: boolean,
  probeY = 48,
  fallback: HeaderTheme = 'light',
  // Wysokosc pasa headera. Gradient gasnie, dopoki JAKAKOLWIEK czesc sekcji z
  // `data-header-gradient="off"` jest jeszcze w tym pasie — sama linia probna
  // (probeY) wystarczylaby tylko do motywu, a gradient zdazylby mrugnac nad
  // resztka hero pozostala pod headerem.
  bandHeight = probeY,
): ActiveHeader {
  const [active, setActive] = useState<ActiveHeader>({
    theme: fallback,
    surface: null,
    gradient: true,
  })

  useEffect(() => {
    if (!enabled) return
    let raf = 0

    const update = () => {
      raf = 0
      const els = document.querySelectorAll<HTMLElement>('[data-header-theme]')

      // Gradient gasnie, gdy sekcja go odmawiajaca dotyka jeszcze pasa headera —
      // nie w chwili, gdy zejdzie ponizej linii probnej. display:none (warianty
      // desktop/mobile) daje rect 0/0, wiec sam z siebie nie przejdzie testu.
      let gradient = true
      for (const el of els) {
        if (el.dataset.headerGradient !== 'off') continue
        const rect = el.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < bandHeight) {
          gradient = false
          break
        }
      }

      for (const el of els) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= probeY && rect.bottom > probeY) {
          const theme = el.dataset.headerTheme
          if (theme === 'dark' || theme === 'light') {
            const surface = el.dataset.headerSurface ?? null
            setActive((prev) =>
              prev.theme === theme && prev.surface === surface && prev.gradient === gradient
                ? prev
                : { theme, surface, gradient },
            )
          }
          break // pierwszy pasujacy w kolejnosci DOM = ten bezposrednio pod headerem
        }
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    // scroll-snap potrafi dociagnac panel juz PO ostatnim zdarzeniu `scroll`
    // (rAF wtedy zmierzyl stan przejsciowy). `scrollend` gwarantuje pomiar na
    // pozycji spoczynkowej - bezposrednio, bez rAF.
    const onScrollEnd = () => update()

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled, probeY, bandHeight])

  return active
}
