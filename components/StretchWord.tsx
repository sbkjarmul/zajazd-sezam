'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** Tekst do rozciągnięcia (jedna linia). */
  text: string
  /** Klasy na <svg> (np. szerokość/kolor). */
  className?: string
  /**
   * Klasy na <text> (font/krój). Domyślnie akcent Westbourne kursywą
   * (restauracja). Bistro (Figma 1010:104) nadpisuje na Inter Bold.
   */
  textClassName?: string
  /**
   * Margines wokół glifów jako ułamek wysokości bboxa. viewBox = dokładny
   * bbox glifów, więc przy `preserveAspectRatio=meet` litery dotykają krawędzi
   * SVG — na pełnej szerokości skrajne litery (S/M) wyglądają na przycięte.
   * `pad` odsuwa je od krawędzi (0 = bez zmian, domyślnie).
   */
  pad?: number
}

// Renderuje tekst jako JEDNĄ linię rozciągniętą na całą szerokość kontenera,
// niezależnie od wielkości ekranu. SVG skaluje się do 100% szerokości, a
// viewBox ustawiamy na zmierzony bounding box glifów — dzięki temu tekst
// wypełnia szerokość w naturalnych proporcjach (bez zniekształceń i przycięć),
// a wysokość jest proporcjonalna. Działa dla dowolnego stringu (PL/EN).
export function StretchWord({
  text,
  className,
  textClassName = 'font-accent fill-current italic',
  pad = 0,
}: Props) {
  const textRef = useRef<SVGTextElement>(null)
  // SSR / stan początkowy — przybliżony viewBox (≈91 jednostek na znak przy
  // fontSize 200). Doprecyzowywany po zamontowaniu, gdy font jest gotowy.
  const [viewBox, setViewBox] = useState(`0 50 ${Math.max(1, text.length) * 91} 200`)

  useEffect(() => {
    let cancelled = false
    const measure = () => {
      const el = textRef.current
      if (!el || cancelled) return
      const b = el.getBBox()
      if (b.width <= 0) return
      // Margines proporcjonalny do wysokości glifów (spójny wizualnie w pionie
      // i poziomie), żeby skrajne litery nie dotykały krawędzi SVG.
      const p = b.height * pad
      setViewBox(`${b.x - p} ${b.y - p} ${b.width + p * 2} ${b.height + p * 2}`)
    }
    if (document.fonts?.status === 'loaded') measure()
    else void document.fonts?.ready.then(measure)
    return () => {
      cancelled = true
    }
  }, [text, pad])

  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={text}
    >
      <text ref={textRef} x="0" y="200" fontSize="200" className={textClassName}>
        {text}
      </text>
    </svg>
  )
}
