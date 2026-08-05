'use client'

import { useEffect, useState } from 'react'

export type HeaderTheme = 'dark' | 'light'

export type ActiveHeader = {
  theme: HeaderTheme
  // Kolor „powierzchni" gradientu headera dla sekcji jasnych (theme='light').
  // Sekcja moze go nadpisac przez `data-header-surface` (np. biale tlo -> #fff),
  // inaczej null = domyslny krem (--color-light). Dla sekcji ciemnych ignorowany.
  surface: string | null
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
): ActiveHeader {
  const [active, setActive] = useState<ActiveHeader>({ theme: fallback, surface: null })

  useEffect(() => {
    if (!enabled) return
    let raf = 0

    const update = () => {
      raf = 0
      const els = document.querySelectorAll<HTMLElement>('[data-header-theme]')
      for (const el of els) {
        const rect = el.getBoundingClientRect()
        // display:none (warianty desktop) daja rect 0/0 - nie przejda tego testu.
        if (rect.top <= probeY && rect.bottom > probeY) {
          const theme = el.dataset.headerTheme
          if (theme === 'dark' || theme === 'light') {
            const surface = el.dataset.headerSurface ?? null
            setActive((prev) =>
              prev.theme === theme && prev.surface === surface ? prev : { theme, surface },
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
  }, [enabled, probeY])

  return active
}
