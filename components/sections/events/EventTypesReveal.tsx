'use client'

import { useState } from 'react'
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

// Galeria typów imprez sterowana hoverem (desktop):
//  - lista nazw po prawej; najechanie na wiersz płynnie rozwija jego opis
//    (grid-rows 0fr→1fr, jak w satius.app/membership) i przełącza zdjęcie
//    w stałej ramce po lewej (crossfade + clip-path reveal od dołu, w duchu
//    eleos.la/partners).
//  - <lg: brak hovera — wszystkie wiersze pokazują opis + własne zdjęcie inline.

export function EventTypesReveal({ section, types, locale }: Props) {
  const [active, setActive] = useState(0)

  if (!types.length) return null

  const eyebrow = pickLocale(section?.eyebrow, locale)
  const title = pickLocale(section?.title, locale)
  const description = pickLocale(section?.description, locale)

  return (
    <section className="bg-bg overflow-hidden py-20 md:py-32">
      <div className="px-4 md:px-16">
        <header className="flex flex-col items-start gap-8 lg:flex-row lg:justify-between">
          <Reveal className="flex flex-col gap-4">
            {eyebrow && (
              <p className="text-text text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text max-w-3xl text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </Reveal>
          {description && (
            <Reveal delay={100}>
              <p className="text-text-muted max-w-sm text-base leading-[1.2] md:text-lg lg:text-xl">
                {description}
              </p>
            </Reveal>
          )}
        </header>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* Desktop: stała ramka zdjęcia (zakotwiczona u góry, nie skacze przy
              rozwijaniu opisów), crossfade wg aktywnego wiersza */}
          <div className="hidden lg:block lg:mt-36">
            <div className="relative aspect-[253/332] w-full max-w-[280px] overflow-hidden">
              {types.map((type, i) => (
                <SanityImage
                  key={i}
                  image={type.image}
                  locale={locale}
                  fill
                  sizes="280px"
                  className={cn(
                    'origin-center object-cover transition-[opacity,scale] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    i === active ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Lista typów imprez */}
          <ul className="flex flex-col">
            {types.map((type, i) => {
              const name = pickLocale(type.name, locale)
              const desc = pickLocale(type.description, locale)
              const isActive = i === active

              return (
                <li
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="border-dark-gold/50 border-t"
                >
                  <div
                    tabIndex={0}
                    className="group focus-visible:outline-none py-7 md:py-8 lg:cursor-default"
                  >
                    {name && (
                      <h3
                        className={cn(
                          'font-accent text-text text-3xl italic leading-none transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-4xl lg:text-5xl motion-reduce:transition-none',
                          'lg:group-hover:text-dark-gold',
                          isActive && 'lg:text-dark-gold',
                        )}
                      >
                        {name}
                      </h3>
                    )}

                    {/* Opis — na desktopie rozwija się na hover, poniżej lg zawsze widoczny */}
                    {desc && (
                      <div
                        className={cn(
                          'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                          'grid-rows-[1fr]',
                          isActive ? 'lg:grid-rows-[1fr]' : 'lg:grid-rows-[0fr]',
                        )}
                      >
                        <div className="overflow-hidden">
                          <p
                            className={cn(
                              'text-text-muted mt-4 max-w-xl text-base leading-[1.35] transition-opacity duration-500 md:text-lg lg:mt-0 lg:pt-4 motion-reduce:transition-none',
                              isActive ? 'lg:opacity-100' : 'lg:opacity-0',
                            )}
                          >
                            {desc}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
            <li className="border-dark-gold/50 border-t" aria-hidden />
          </ul>
        </div>
      </div>
    </section>
  )
}
