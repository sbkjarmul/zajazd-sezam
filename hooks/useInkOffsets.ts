'use client'

import { useEffect, useState, type RefObject } from 'react'

// Kursywa Westbourne ma spore lewe odsadzenie (side bearing) i rozne dla roznych
// liter: "n" zaczyna sie 0,148em od krawedzi ramki, a "Z" zaledwie 0,02em -
// przez co wiersz zaczynajacy sie kursywa wyglada na wciety (jakby stala przed
// nim spacja). Mierzymy odsadzenie pierwszego znaku kazdego oznaczonego wezla
// na canvasie i cofamy je ujemnym marginesem. Wynik trzymamy w `em`, wiec
// dziala na kazdym breakpoincie bez ponownego pomiaru.
//
// Zwraca offsety w kolejnosci wystapienia `[data-ink-align]` w `root`.
// Konsument naklada je jako `marginLeft: -offset em`.
export function useInkOffsets(root: RefObject<HTMLElement | null>, deps: unknown[]) {
  const [offsets, setOffsets] = useState<number[]>([])

  useEffect(() => {
    let cancelled = false

    void document.fonts.ready.then(() => {
      const el = root.current
      if (cancelled || !el) return
      const ctx = document.createElement('canvas').getContext('2d')
      if (!ctx) return

      setOffsets(
        Array.from(el.querySelectorAll<HTMLElement>('[data-ink-align]')).map((node) => {
          const style = getComputedStyle(node)
          // Tylko tekst do lewej: przy wysrodkowanym/prawym korekta lewej
          // krawedzi przesunelaby caly blok zamiast go wyrownac.
          if (style.textAlign !== 'left' && style.textAlign !== 'start') return 0
          // Pomiar przy 100px, wynik dzielimy przez 100 -> wartosc w em.
          ctx.font = `${style.fontStyle} 100px ${style.fontFamily}`
          const { actualBoundingBoxLeft } = ctx.measureText(node.textContent ?? '')
          // actualBoundingBoxLeft < 0 => ink zaczyna sie na prawo od krawedzi boxu.
          return actualBoundingBoxLeft < 0 ? -actualBoundingBoxLeft / 100 : 0
        }),
      )
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return offsets
}
