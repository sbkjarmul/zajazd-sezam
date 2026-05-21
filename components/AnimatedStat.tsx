'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  /** Wartość np. "5000+", "70+". Liczba rośnie 0→target w gray; po zakończeniu
   *  zmienia kolor na dark i pojawia się suffix (np. "+"). */
  value: string
  label: string
  /** Opóźnienie startu (ms) po wjeździe w viewport. Default 0. */
  delayMs?: number
  className?: string
  valueClassName?: string
  labelClassName?: string
}

const COUNT_DURATION_MS = 800
const COLOR_DURATION_MS = 200
const SUFFIX_FADE_MS = 250
const LABEL_FADE_MS = 300

// 1. Liczba "ładuje się" 0 → target w kolorze color/gray (counter up, 1500ms ease-out).
// 2. Po załadowaniu → kolor zmienia się gray → dark (300ms) i jednocześnie
//    pojawia się sufiks "+" (fade 400ms, opacity-0 → 100; rezerwuje miejsce
//    od początku więc layout nie drga).
// 3. Po sufiksie → label fade-in.
// Mobile + reduced-motion → wszystko widoczne od razu.
export function AnimatedStat({
  value,
  label,
  delayMs = 0,
  className,
  valueClassName,
  labelClassName,
}: Props) {
  // Split: liczby/separatory na początku + reszta (suffix).
  const match = value.match(/^([\d.,\s]+)(.*)$/)
  const hasNumber = match !== null
  const targetStr = hasNumber ? match[1].trim() : ''
  const target = hasNumber ? parseInt(targetStr.replace(/[.,\s]/g, ''), 10) : 0
  const suffix = hasNumber ? match[2] : ''

  const ref = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [numberDone, setNumberDone] = useState(false)
  const [suffixVisible, setSuffixVisible] = useState(false)
  const [labelVisible, setLabelVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return

    const skipAnimation =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches

    if (skipAnimation || !hasNumber) {
      queueMicrotask(() => {
        setCurrent(target)
        setNumberDone(true)
        setSuffixVisible(true)
        setLabelVisible(true)
      })
      return
    }

    const timeouts: ReturnType<typeof setTimeout>[] = []
    let rafId: number | null = null

    const startCount = () => {
      const startTime = performance.now()
      const tick = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(1, elapsed / COUNT_DURATION_MS)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(target * eased))
        if (progress < 1) {
          rafId = requestAnimationFrame(tick)
        } else {
          // Counter done — color do dark, "+" i label pojawiają się równocześnie
          setNumberDone(true)
          setSuffixVisible(true)
          setLabelVisible(true)
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        timeouts.push(setTimeout(startCount, delayMs))
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(el)

    return () => {
      obs.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      for (const id of timeouts) clearTimeout(id)
    }
  }, [delayMs, target, hasNumber])

  return (
    <div ref={ref} className={className}>
      <span
        className={valueClassName}
        aria-label={value}
        style={{
          color: numberDone ? 'var(--color-text)' : 'var(--color-gray)',
          transition: `color ${COLOR_DURATION_MS}ms ease-out`,
        }}
      >
        <span
          className="transition-opacity duration-200 ease-out"
          style={{ opacity: hasNumber && current === 0 ? 0 : 1 }}
        >
          {hasNumber ? current : value}
        </span>
        {suffix && (
          <span
            aria-hidden
            className={cn(
              'transition-opacity ease-out',
              suffixVisible ? 'opacity-100' : 'opacity-0',
            )}
            style={{ transitionDuration: `${SUFFIX_FADE_MS}ms` }}
          >
            {suffix}
          </span>
        )}
      </span>
      <span
        className={cn(
          'transition-opacity ease-out',
          labelVisible ? 'opacity-100' : 'opacity-0',
          labelClassName,
        )}
        style={{ transitionDuration: `${LABEL_FADE_MS}ms` }}
      >
        {label}
      </span>
    </div>
  )
}
