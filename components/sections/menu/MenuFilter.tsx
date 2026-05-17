'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type CategoryNav = { slug: string; label: string }

type Props = {
  categories: CategoryNav[]
}

// Initial: absolute top-20 (80px from top of #menu = top of Przystawki section).
// On scroll past #menu top: switches to fixed top-20 (80px from viewport top) so the
// menu remains visible across all category sections.
export function MenuFilter({ categories }: Props) {
  const [active, setActive] = useState<string | undefined>(categories[0]?.slug)
  const [isFixed, setIsFixed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || categories.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const menuEl = document.getElementById('menu')
    if (!menuEl) return

    function handleScroll() {
      if (!menuEl) return
      setIsFixed(menuEl.getBoundingClientRect().top < 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, slug: string) {
    e.preventDefault()
    const el = document.getElementById(slug)
    if (!el) return
    const offsetTop = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    setActive(slug)
  }

  return (
    <div
      aria-hidden="false"
      className={cn(
        'pointer-events-none z-30 hidden justify-center px-4 lg:flex lg:px-8',
        isFixed ? 'fixed inset-x-0 top-20' : 'absolute inset-x-0 top-20',
      )}
    >
      <nav
        aria-label="Kategorie menu"
        className="bg-light pointer-events-auto flex max-w-full items-center gap-1 rounded-full p-1.5 shadow-xl wide:p-2"
      >
        {categories.map((c) => {
          const isActive = c.slug === active
          return (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              onClick={(e) => handleClick(e, c.slug)}
              className={cn(
                'inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm whitespace-nowrap transition-colors wide:h-[60px] wide:px-6 wide:text-lg',
                isActive
                  ? 'bg-secondary text-secondary-foreground font-normal'
                  : 'hover:bg-secondary/10 font-normal text-[color:var(--color-dark-ruby)]',
              )}
            >
              {c.label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
