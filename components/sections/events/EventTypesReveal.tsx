'use client'

import { useCallback, useState } from 'react'
import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Reveal } from '@/components/Reveal'
import { SanityLightbox } from '@/components/sections/gallery/SanityLightbox'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { cn } from '@/lib/utils'

type EventType = NonNullable<NonNullable<EVENTS_PAGE_QUERY_RESULT>['eventTypes']>[number]
type GalleryImage = Parameters<typeof SanityImage>[0]['image']

// Pula zdjęć danego typu: galeria ze Studio, a gdy pusta — pojedyncze zdjęcie
// reprezentacyjne (brak regresji, gdy galeria jeszcze nieuzupełniona).
function galleryOf(type: EventType): GalleryImage[] {
  if (type.gallery && type.gallery.length) return type.gallery
  return type.image ? [type.image] : []
}

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
  // Który kadr z galerii pokazać w ramce podglądu (per typ) — losowany na hover.
  const [previewIdx, setPreviewIdx] = useState<number[]>(() => types.map(() => 0))
  // Typ, którego galeria jest otwarta w lightboxie (null = zamknięty).
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  // Hover/focus wiersza: aktywacja + losowy kadr z galerii tego typu.
  const handleEnter = useCallback(
    (i: number) => {
      setActive(i)
      const count = galleryOf(types[i]).length
      if (count > 1) {
        setPreviewIdx((prev) => {
          const next = [...prev]
          next[i] = Math.floor(Math.random() * count)
          return next
        })
      }
    },
    [types],
  )

  if (!types.length) return null

  const openGalleryLabel = locale === 'pl' ? 'Otwórz galerię zdjęć' : 'Open photo gallery'
  const galleryImages = openIdx !== null ? galleryOf(types[openIdx]) : []

  const eyebrow = pickLocale(section?.eyebrow, locale)
  const title = pickLocale(section?.title, locale)
  const description = pickLocale(section?.description, locale)

  return (
    <section data-header-theme="light" className="bg-bg overflow-hidden py-20 md:py-32">
      <div className="px-4 md:px-16">
        <header className="flex flex-col items-start gap-8 lg:flex-row lg:justify-between">
          <Reveal className="flex flex-col gap-4">
            {eyebrow && (
              <p className="text-text wide:text-lg text-base leading-[normal] tracking-normal uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text max-w-3xl text-3xl leading-none font-normal tracking-tight md:text-4xl md:tracking-[-0.03em]">
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
          <div className="hidden lg:mt-36 lg:block">
            <button
              type="button"
              onClick={() => setOpenIdx(active)}
              aria-label={openGalleryLabel}
              className="group/frame relative block aspect-[253/332] w-full max-w-[280px] cursor-pointer overflow-hidden"
            >
              {types.map((type, i) => {
                const imgs = galleryOf(type)
                const preview = imgs[previewIdx[i]] ?? type.image
                return (
                  <SanityImage
                    key={i}
                    image={preview}
                    locale={locale}
                    fill
                    sizes="280px"
                    className={cn(
                      'origin-center object-cover transition-[opacity,scale] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/frame:scale-105 motion-reduce:transition-none',
                      i === active ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
                    )}
                  />
                )
              })}
            </button>
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
                  onMouseEnter={() => handleEnter(i)}
                  className="border-dark-gold/50 border-t"
                >
                  <button
                    type="button"
                    onFocus={() => handleEnter(i)}
                    onClick={() => setOpenIdx(i)}
                    aria-label={openGalleryLabel}
                    className="group block w-full cursor-pointer py-7 text-left focus-visible:outline-none md:py-8"
                  >
                    {name && (
                      <h3
                        className={cn(
                          'font-accent text-text text-3xl leading-none italic transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:text-4xl lg:text-5xl',
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
                              'text-text-muted mt-4 max-w-xl text-base leading-[1.35] transition-opacity duration-500 motion-reduce:transition-none md:text-lg lg:mt-0 lg:pt-4',
                              isActive ? 'lg:opacity-100' : 'lg:opacity-0',
                            )}
                          >
                            {desc}
                          </p>
                        </div>
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
            <li className="border-dark-gold/50 border-t" aria-hidden />
          </ul>
        </div>
      </div>

      <SanityLightbox
        images={galleryImages}
        locale={locale}
        open={openIdx !== null}
        onOpenChange={(next) => {
          if (!next) setOpenIdx(null)
        }}
      />
    </section>
  )
}
