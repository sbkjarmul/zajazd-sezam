'use client'

import { useEffect, useState } from 'react'

export type ScrollDirection = 'top' | 'up' | 'down'

const TOP_THRESHOLD = 16
const DIRECTION_THRESHOLD = 8

export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('top')

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    function update() {
      const y = window.scrollY
      if (y <= TOP_THRESHOLD) {
        setDirection('top')
      } else if (Math.abs(y - lastY) >= DIRECTION_THRESHOLD) {
        setDirection(y > lastY ? 'down' : 'up')
      }
      lastY = y
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return direction
}
