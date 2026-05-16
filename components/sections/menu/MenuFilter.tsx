'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type CategoryNav = { slug: string; label: string }

type Props = {
  categories: CategoryNav[]
}

// Sticky pill nav nad menu — smooth-scroll do anchorów + podświetlenie
// aktywnej kategorii na podstawie IntersectionObserver.
export function MenuFilter({ categories }: Props) {
  const [active, setActive] = useState<string | undefined>(categories[0]?.slug)

  useEffect(() => {
    if (typeof window === 'undefined' || categories.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        // Wybierz pierwszą widoczną (najbliższą górze viewportu).
        const closest = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0]
        if (closest) setActive(closest.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    )

    for (const c of categories) {
      const el = document.getElementById(c.slug)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [categories])

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, slug: string) {
    e.preventDefault()
    const el = document.getElementById(slug)
    if (!el) return
    const offsetTop = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    setActive(slug)
  }

  return (
    <nav
      aria-label="Kategorie menu"
      className="bg-bg/90 sticky top-20 z-30 -mx-6 mb-12 px-6 backdrop-blur-md md:-mx-16 md:px-16"
    >
      <div className="border-border-subtle flex gap-2 overflow-x-auto border-b py-3">
        {categories.map((c) => {
          const isActive = c.slug === active
          return (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              onClick={(e) => handleClick(e, c.slug)}
              className={cn(
                'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border px-5 py-2 text-sm tracking-wide uppercase transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border-subtle text-text hover:border-primary',
              )}
            >
              {c.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
