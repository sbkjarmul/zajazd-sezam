'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// useLayoutEffect odpala sie PRZED malowaniem, wiec cofniecie stanu do zera na
// desktopie jest niewidoczne. Na serwerze React ostrzega przed useLayoutEffect,
// stad podmiana na useEffect (SSR i tak nie maluje).
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

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
  // Stan poczatkowy = STAN KONCOWY animacji, a `animating` trzyma transitiony
  // wylaczone. Dzieki temu SSR i pierwsza klatka pokazuja gotowa statystyke, a na
  // mobile nie dzieje sie NIC: ani odliczania, ani fade'u sufiksu i labela.
  // Poprzednio stan startowy byl "pusty", a mobilny guard ustawial koncowy dopiero
  // po hydracji - klasy `transition-opacity` zostawaly, wiec cala sekwencja i tak
  // sie odtwarzala.
  const [current, setCurrent] = useState(target)
  const [numberDone, setNumberDone] = useState(true)
  const [suffixVisible, setSuffixVisible] = useState(true)
  const [labelVisible, setLabelVisible] = useState(true)
  const [animating, setAnimating] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return

    const skipAnimation =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches

    // Nic nie robimy - wyrenderowany stan JEST stanem koncowym.
    if (skipAnimation || !hasNumber) return

    // Desktop: cofamy do stanu startowego jeszcze przed malowaniem.
    setAnimating(true)
    setCurrent(0)
    setNumberDone(false)
    setSuffixVisible(false)
    setLabelVisible(false)

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
          transition: animating ? `color ${COLOR_DURATION_MS}ms ease-out` : 'none',
        }}
      >
        <span
          className={cn('ease-out', animating ? 'transition-opacity duration-200' : '')}
          style={{ opacity: hasNumber && animating && current === 0 ? 0 : 1 }}
        >
          {hasNumber ? current : value}
        </span>
        {suffix && (
          <span
            aria-hidden
            className={cn(
              'ease-out',
              animating && 'transition-opacity',
              suffixVisible ? 'opacity-100' : 'opacity-0',
            )}
            style={{ transitionDuration: animating ? `${SUFFIX_FADE_MS}ms` : undefined }}
          >
            {suffix}
          </span>
        )}
      </span>
      <span
        className={cn(
          'ease-out',
          animating && 'transition-opacity',
          labelVisible ? 'opacity-100' : 'opacity-0',
          labelClassName,
        )}
        style={{ transitionDuration: animating ? `${LABEL_FADE_MS}ms` : undefined }}
      >
        {label}
      </span>
    </div>
  )
}
