'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { cn } from '@/lib/utils'

type EventType = NonNullable<NonNullable<EVENTS_PAGE_QUERY_RESULT>['eventTypes']>[number]

type Props = {
  section: NonNullable<EVENTS_PAGE_QUERY_RESULT>['eventTypesSection']
  types: EventType[]
  locale: Locale
}

// Dwa warianty galerii zależnie od breakpointu:
//
// Desktop (lg+) — animowany, nieskończony slider z peekiem:
//  - track ma 4 sloty [prev, current, upcoming, afterUpcoming]
//  - stan spoczynku: translateX = -1 krok (current przy lewej, upcoming peek)
//  - "next": animacja do -2 kroków; "prev": do 0
//  - po `transitionend` commitujemy index i bez animacji wracamy do -1 kroku.
//
// Mobile + tablet (<lg) — natywny scroll palcem (overflow-x-auto + scroll-snap):
//  - karty `shrink-0` z `snap-start`, na tablecie szerokość 85% → następne
//    zdjęcie wystaje z prawej krawędzi i sugeruje możliwość scrollowania
//  - listener `scroll` synchronizuje `index` z aktualnie widoczną kartą,
//    dzięki czemu panel z nazwą/opisem i kropki zostają spójne.

export function EventTypesCarousel({ section, types, locale }: Props) {
  const [index, setIndex] = useState(0)
  const [anim, setAnim] = useState<null | 'next' | 'prev'>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const total = types.length

  // Synchronizacja `index` z natywnym scrollem (mobile + tablet).
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const update = () => {
      const cards = root.children
      if (cards.length < 2) return
      const step =
        (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
      if (step <= 0) return // ukryty na desktopie → offsetLeft = 0
      const i = Math.round(root.scrollLeft / step)
      setIndex(Math.min(total - 1, Math.max(0, i)))
    }
    root.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      root.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [total])

  if (!types.length) return null

  const eyebrow = pickLocale(section?.eyebrow, locale)
  const title = pickLocale(section?.title, locale)
  const description = pickLocale(section?.description, locale)

  const mod = (n: number) => ((n % total) + total) % total

  const current = types[index]
  const name = pickLocale(current.name, locale)
  const desc = pickLocale(current.description, locale)

  // 4 sloty wokół bieżącego indexu (slider desktopowy)
  const slots = [
    types[mod(index - 1)],
    types[mod(index)],
    types[mod(index + 1)],
    types[mod(index + 2)],
  ]

  // Krok translateX: spoczynek -1, animacja next -2, animacja prev 0
  const step = anim === 'next' ? -2 : anim === 'prev' ? 0 : -1

  const go = (dir: 'next' | 'prev') => {
    if (anim) return
    setAnim(dir)
  }

  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== 'transform') return
    if (anim === 'next') setIndex((i) => mod(i + 1))
    else if (anim === 'prev') setIndex((i) => mod(i - 1))
    setAnim(null)
  }

  const scrollToIndex = (i: number) => {
    const card = scrollRef.current?.children[i] as HTMLElement | undefined
    card?.scrollIntoView({ inline: 'start', block: 'nearest' })
  }

  return (
    <section className="bg-bg overflow-hidden py-20 md:py-32">
      <div className="px-4 md:px-16">
        <header className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="flex flex-col gap-2">
            {eyebrow && (
              <p className="text-text text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text max-w-3xl text-4xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </Reveal>
          {description && (
            <Reveal delay={100}>
              <p className="text-text-muted max-w-sm text-xl leading-[normal]">{description}</p>
            </Reveal>
          )}
        </header>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-[26rem_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col justify-between gap-10 px-4 md:px-16 lg:pr-0">
          <div className="hidden gap-3 lg:flex">
            <button
              type="button"
              onClick={() => go('prev')}
              aria-label={locale === 'pl' ? 'Poprzedni typ' : 'Previous type'}
              className="border-border hover:bg-primary hover:text-primary-foreground flex size-16 cursor-pointer items-center justify-center rounded-full border-2 transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go('next')}
              aria-label={locale === 'pl' ? 'Następny typ' : 'Next type'}
              className="border-border hover:bg-primary hover:text-primary-foreground flex size-16 cursor-pointer items-center justify-center rounded-full border-2 transition-colors"
            >
              <ArrowRight className="size-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {name && (
              <h3 className="text-text text-4xl leading-none font-normal tracking-tight md:tracking-[-0.03em]">
                {name}
              </h3>
            )}
            {desc && <p className="text-text text-lg leading-[normal]">{desc}</p>}
          </div>
        </div>

        {/* Desktop (lg+): animowany slider — viewport przycina track */}
        <div className="hidden overflow-hidden lg:block">
          <div
            className="flex gap-4 [--peek:66%]"
            style={{
              transform: `translateX(calc(${step} * (var(--peek) + 1rem)))`,
              transition: anim ? 'transform 550ms cubic-bezier(0.33, 1, 0.68, 1)' : 'none',
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {slots.map((type, i) => (
              <div
                key={i}
                className="relative h-[460px] w-[66%] shrink-0 overflow-hidden"
              >
                <SanityImage
                  image={type.image}
                  locale={locale}
                  fill
                  sizes="45vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile + tablet (<lg): natywny scroll palcem, peek następnego z prawej */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {types.map((type, i) => (
            <div
              key={i}
              className="relative h-[300px] w-full shrink-0 snap-start overflow-hidden sm:h-[380px] md:w-[85%]"
            >
              <SanityImage
                image={type.image}
                locale={locale}
                fill
                sizes="(max-width: 767px) 100vw, 85vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2 lg:hidden">
        {types.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`${i + 1}`}
            className={cn(
              'size-2 rounded-full transition-colors',
              i === index ? 'bg-accent' : 'bg-gray',
            )}
          />
        ))}
      </div>
    </section>
  )
}
