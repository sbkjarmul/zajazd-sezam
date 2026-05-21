'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  /** Threshold IntersectionObservera — 0–1. Default 0.3 (30% widoczne = trigger). */
  threshold?: number
  /** Czy reveal ma odpalić się tylko raz. Default true. */
  once?: boolean
  /** Opóźnienie (ms) po przekroczeniu progu. Default 0. */
  delay?: number
}

// Scroll-reveal wrapper: blur + opacity-0 → ostrość + opacity-1 gdy element
// wjeżdża w viewport (IntersectionObserver). Steruje przez data-revealed
// attribute + CSS transitions na opacity i filter.
//
// `prefers-reduced-motion: reduce` → reveal natychmiastowy (bez animacji).
export function Reveal({ children, className, threshold = 0.3, once = true, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.dataset.revealed = 'true'
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = setTimeout(() => {
              if (ref.current) ref.current.dataset.revealed = 'true'
            }, delay)
          } else {
            el.dataset.revealed = 'true'
          }
          if (once) obs.disconnect()
        } else if (!once) {
          el.dataset.revealed = 'false'
        }
      },
      {
        threshold,
        // Element musi wjechać 10% w głąb viewportu zanim Reveal odpali —
        // daje delikatny moment "wchodzenia" zanim element się ujawni.
        rootMargin: '0px 0px -10% 0px',
      },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [threshold, once, delay])

  return (
    <div
      ref={ref}
      data-revealed="false"
      className={cn(
        'transition-opacity duration-700 ease-out',
        'opacity-0 data-[revealed=true]:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  )
}
