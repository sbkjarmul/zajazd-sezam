'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** Tekst do rozciągnięcia (jedna linia). */
  text: string
  /** Klasy na <svg> (np. szerokość/kolor). */
  className?: string
}

// Renderuje tekst jako JEDNĄ linię rozciągniętą na całą szerokość kontenera,
// niezależnie od wielkości ekranu. SVG skaluje się do 100% szerokości, a
// viewBox ustawiamy na zmierzony bounding box glifów — dzięki temu tekst
// wypełnia szerokość w naturalnych proporcjach (bez zniekształceń i przycięć),
// a wysokość jest proporcjonalna. Działa dla dowolnego stringu (PL/EN).
export function StretchWord({ text, className }: Props) {
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
      if (b.width > 0) setViewBox(`${b.x} ${b.y} ${b.width} ${b.height}`)
    }
    if (document.fonts?.status === 'loaded') measure()
    else void document.fonts?.ready.then(measure)
    return () => {
      cancelled = true
    }
  }, [text])

  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={text}
    >
      <text ref={textRef} x="0" y="200" fontSize="200" className="font-accent fill-current italic">
        {text}
      </text>
    </svg>
  )
}
