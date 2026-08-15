import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ColorizeText } from '@/components/ColorizeText'
import { AnimatedStat } from '@/components/AnimatedStat'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['aboutSection']
  locale: Locale
}

// Mobile i desktop to DWIE niezalezne sekcje (mobile `lg:hidden!`, desktop
// `hidden! lg:flex!`), zeby zmiany w jednej rozdzielczosci nie ruszaly drugiej.
// `!` (Tailwind v4 important) bije `.snap-panels > section { display:flex }`
// z globals.css (wyzsza specyficznosc niz zwykle `hidden`).
//
// Mobile (Figma 936:31): intro 24px + liczby 40px / label 16px, wysrodkowane w
// panelu (snap). Desktop (Figma 930:40): eyebrow „O NAS" przy lewej + intro 32px
// wciete do 33.4%; liczby 48px wyrownane do prawej, tresc gora/dol (justify-between).
//
// ColorizeText (intro): reveal znak po znaku. AnimatedStat — counter 800ms,
// rusza gdy stat wjedzie w viewport, z drobnym staggerem.
const STAT_STAGGER_MS = 120

export function AboutSection({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const introDesktop = pickLocale(data.intro, locale)
  const introMobile = pickLocale(data.introMobile, locale) ?? introDesktop
  const stats = data.stats ?? []

  return (
    <>
      {/* MOBILE (Figma 936:31) */}
      <section
        data-header-theme="light"
        data-header-surface="#ffffff"
        className="text-text relative w-full bg-white lg:hidden!"
      >
        <div className="layout-container flex flex-col items-center gap-10 py-24 text-center">
          {introMobile && (
            <p className="text-[24px] font-normal">
              <ColorizeText text={introMobile} />
            </p>
          )}
          {stats.length > 0 && (
            <div className="flex flex-col gap-6">
              {stats.map((stat, i) => (
                <AnimatedStat
                  key={i}
                  value={stat.value ?? ''}
                  label={pickLocale(stat.label, locale) ?? ''}
                  delayMs={i * STAT_STAGGER_MS}
                  className="flex flex-col items-center gap-1"
                  valueClassName="text-text text-[40px] leading-none font-normal tracking-[-0.04em]"
                  labelClassName="text-text text-base"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DESKTOP (bez zmian - tylko bramkowanie widocznosci) */}
      <section
        data-header-theme="light"
        data-header-surface="#ffffff"
        className="hidden! flex-col justify-between gap-20 bg-white py-20 lg:flex! lg:min-h-[800px]"
      >
        {/* Gora: eyebrow przy lewej + intro wciete do 33.4% (jedna linia) */}
        <div className="layout-container flex items-start">
          {eyebrow && (
            <p className="text-text wide:text-lg w-[33.4%] shrink-0 text-base tracking-normal uppercase">
              {eyebrow}
            </p>
          )}
          {introDesktop && (
            <p className="max-w-[922px] flex-1 text-[32px] font-normal tracking-[-0.02em]">
              <ColorizeText text={introDesktop} />
            </p>
          )}
        </div>

        {/* Dol: statystyki — rzad wyrownany do prawej */}
        {stats.length > 0 && (
          <div className="layout-container flex flex-row flex-wrap justify-end gap-x-10 gap-y-8">
            {stats.map((stat, i) => (
              <AnimatedStat
                key={i}
                value={stat.value ?? ''}
                label={pickLocale(stat.label, locale) ?? ''}
                delayMs={i * STAT_STAGGER_MS}
                className="flex flex-col items-start gap-1.5"
                valueClassName="text-text text-[48px] leading-none font-normal tracking-[-2.4px]"
                labelClassName="text-text text-lg"
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
