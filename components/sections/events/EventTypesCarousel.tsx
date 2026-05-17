'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { cn } from '@/lib/utils'

type EventType = NonNullable<NonNullable<EVENTS_PAGE_QUERY_RESULT>['eventTypes']>[number]

type Props = {
  section: NonNullable<EVENTS_PAGE_QUERY_RESULT>['eventTypesSection']
  types: EventType[]
  locale: Locale
}

export function EventTypesCarousel({ section, types, locale }: Props) {
  const [index, setIndex] = useState(0)
  if (!types.length) return null

  const eyebrow = pickLocale(section?.eyebrow, locale)
  const title = pickLocale(section?.title, locale)
  const description = pickLocale(section?.description, locale)

  const current = types[index]
  const name = pickLocale(current.name, locale)
  const desc = pickLocale(current.description, locale)
  const total = types.length

  const next = () => setIndex((i) => (i + 1) % total)
  const prev = () => setIndex((i) => (i - 1 + total) % total)

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="layout-container flex flex-col gap-16">
        <header className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            {eyebrow && <p className="text-text text-base tracking-normal uppercase">{eyebrow}</p>}
            {title && (
              <h2 className="text-text max-w-3xl text-4xl leading-tight font-light tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </div>
          {description && (
            <p className="text-text-muted max-w-sm text-xl leading-relaxed">{description}</p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-4">
          <div className="flex flex-col justify-between gap-10 lg:col-span-4 lg:min-h-[467px]">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label={locale === 'pl' ? 'Poprzedni typ' : 'Previous type'}
                className="border-border hover:bg-primary hover:text-primary-foreground flex size-16 items-center justify-center rounded-full border-2 transition-colors"
              >
                <ArrowLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={locale === 'pl' ? 'Następny typ' : 'Next type'}
                className="border-border hover:bg-primary hover:text-primary-foreground flex size-16 items-center justify-center rounded-full border-2 transition-colors"
              >
                <ArrowRight className="size-6" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {name && (
                <h3 className="text-text text-4xl leading-tight font-normal tracking-tight md:tracking-[-0.03em]">
                  {name}
                </h3>
              )}
              {desc && <p className="text-text text-xl leading-relaxed">{desc}</p>}
              <div className="text-text-muted text-sm">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:col-span-8">
            <div className="relative col-span-2 aspect-[778/467] overflow-hidden rounded-md">
              <SanityImage
                image={current.image}
                locale={locale}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(164,146,102,0.2) 0%, rgba(62,55,39,0.2) 100%)',
                }}
              />
            </div>
            <div className="relative aspect-[356/467] overflow-hidden rounded-md">
              <SanityImage
                image={types[(index + 1) % total]?.image}
                locale={locale}
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 lg:hidden">
          {types.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                i === index ? 'bg-primary w-8' : 'bg-border-subtle w-2',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
