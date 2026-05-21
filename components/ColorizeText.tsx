'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  text: string
  className?: string
  /** Czas między pojawieniem się kolejnych znaków (ms). Default 12. */
  charDelayMs?: number
  /** Czas trwania przejścia koloru na jednym znaku (ms). Default 100. */
  charDurationMs?: number
  /** Threshold IntersectionObservera — 0–1. Default 0.3. */
  threshold?: number
}

// Tekst animowany znak po znaku — start `color/gray`, kolejne znaki
// "pokolorują" się na `color/text` (dark). Trigger: IntersectionObserver gdy
// wrapper wjedzie w viewport. `prefers-reduced-motion` → pełen kolor od razu.
//
// `aria-label` z pełnym tekstem dla screen-readerów; per-char spany są
// `aria-hidden` żeby nie zaśmiecać czytania.
export function ColorizeText({
  text,
  className,
  charDelayMs = 12,
  charDurationMs = 100,
  threshold = 0.3,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window === 'undefined') return

    // Wyłącz animację dla użytkowników z `prefers-reduced-motion: reduce`
    // oraz na ekranach < md (768px) — niska potrzeba i zazwyczaj słabsze CPU.
    const skipAnimation =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches

    if (skipAnimation) {
      queueMicrotask(() => setAnimated(true))
      return
    }

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
    <span ref={ref} className={className} aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            color: animated ? 'var(--color-text)' : 'var(--color-gray)',
            transition: `color ${charDurationMs}ms ease-out`,
            transitionDelay: `${i * charDelayMs}ms`,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
