'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

type Props = {
  text: string
  className?: string
  /** Czas między pojawieniem się kolejnych znaków (ms). Default 12. */
  charDelayMs?: number
  /** Czas trwania przejścia koloru na jednym znaku (ms). Default 100. */
  charDurationMs?: number
  /** Threshold IntersectionObservera — 0–1. Default 0.3. */
  threshold?: number
  /**
   * Przesunięcie indeksu startowego fali (liczba znaków). Pozwala skleić kilka
   * sąsiadujących ColorizeText w jedną ciągłą falę (np. lead + bold + tail),
   * kontynuując `transitionDelay` zamiast restartować od zera. Default 0.
   */
  startIndex?: number
}

// Tekst animowany znak po znaku — start `color/text-faded` (wyblakly, wtopiony
// w tlo), kolejne znaki "pokoloruja" sie na `color/text` (dark). Trigger:
// IntersectionObserver gdy
// wrapper wjedzie w viewport. `prefers-reduced-motion` → pełen kolor od razu.
//
// Dostepnosc: per-char spany sa `aria-hidden` (inaczej czytnik literowalby tekst
// znak po znaku), a pelna tresc podaje rownolegly span `sr-only`. Wczesniej rolę
// tę pełnił `aria-label` na wrapperze, ale `aria-label` na golym <span> bez roli
// jest zabroniony przez ARIA (Lighthouse `aria-prohibited-attr`) i czesc czytnikow
// go ignorowala — tekst potrafil zniknac z odczytu calkowicie.
export function ColorizeText({
  text,
  className,
  charDelayMs = 12,
  charDurationMs = 100,
  threshold = 0.3,
  startIndex = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window === 'undefined') return

    // Wyłącz animację dla użytkowników z `prefers-reduced-motion: reduce`
    // oraz na ekranach < md (768px) — niska potrzeba i zazwyczaj słabsze CPU.
    // NIE flipujemy tu stanu na `animated`: wyblakly start i transitiony zyja w
    // globals.css za tym samym media query, wiec ponizej progu znaki od poczatku
    // maja docelowy kolor. Wczesniejsze `setAnimated(true)` po hydracji tylko
    // odpalalo te sama fale na wejsciu, bo inline transition zostawal.
    const skipAnimation =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches

    if (skipAnimation) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          obs.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return (
    <span
      ref={ref}
      className={className}
      data-colorize={animated ? 'on' : 'idle'}
      style={{ '--colorize-duration': `${charDurationMs}ms` } as CSSProperties}
    >
      <span className="sr-only">{text}</span>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          aria-hidden
          style={{ '--colorize-delay': `${(startIndex + i) * charDelayMs}ms` } as CSSProperties}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
