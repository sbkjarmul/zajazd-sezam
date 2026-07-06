import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ColorizeText } from '@/components/ColorizeText'
import { AnimatedStat } from '@/components/AnimatedStat'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['aboutSection']
  locale: Locale
}

// Wg Figma 930:40 (nowy landing): eyebrow „O NAS" (dark, uppercase, tylko desktop)
// przy LEWEJ krawędzi + intro ~32px WCIĘTE do 33.4% (x=462/1384), w jednej linii
// z eyebrow (nie pod nim). Statystyki na DOLE, wyrównane do PRAWEJ (justify-end,
// gap 40px), liczby ~44px, labels ~16px muted. Sekcja 800px wysoka → treść
// rozłożona góra/dół (justify-between). Mobile: eyebrow ukryty, intro + statystyki
// w kolumnie, liczby większe (56px) wyrównane do lewej.
//
// ColorizeText (intro): 12ms × char + 100ms na znak (2× szybciej niż domyślne).
// AnimatedStat — counter 800ms; liczby ruszają OD RAZU gdy wjadą w viewport
// (własny IntersectionObserver per stat), z drobnym staggerem — NIE czekają na
// animację intro (są na dole sekcji, daleko od intro).
const STAT_STAGGER_MS = 120
export function AboutSection({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const introDesktop = pickLocale(data.intro, locale)
  const introMobile = pickLocale(data.introMobile, locale) ?? introDesktop
  const stats = data.stats ?? []

  return (
    <section className="flex flex-col justify-between gap-28 bg-white py-[120px] md:min-h-[800px] md:gap-20 md:py-20">
      {/* Góra: eyebrow przy lewej + intro wcięte do 33.4% (jedna linia na desktop) */}
      <div className="layout-container md:flex md:items-start">
        {eyebrow && (
          <p className="text-text wide:text-lg hidden text-base tracking-normal uppercase md:block md:w-[33.4%] md:shrink-0">
            {eyebrow}
          </p>
        )}
        {introMobile && (
          <p className="text-xl leading-[1.3] font-normal md:hidden">
            <ColorizeText text={introMobile} />
          </p>
        )}
        {introDesktop && (
          <p className="hidden max-w-[922px] text-[32px] leading-[1.3] font-normal tracking-[-0.02em] md:block md:flex-1">
            <ColorizeText text={introDesktop} />
          </p>
        )}
      </div>

      {/* Dół: statystyki — mobile kolumna (lewo), desktop rząd wyrównany do prawej */}
      {stats.length > 0 && (
        <div className="layout-container flex flex-col gap-12 md:flex-row md:flex-wrap md:justify-end md:gap-x-10 md:gap-y-8">
          {stats.map((stat, i) => (
            <AnimatedStat
              key={i}
              value={stat.value ?? ''}
              label={pickLocale(stat.label, locale) ?? ''}
              delayMs={i * STAT_STAGGER_MS}
              className="flex flex-col items-start gap-1.5"
              valueClassName="text-text text-[56px] leading-none font-normal tracking-[-0.04em] md:text-[48px] md:tracking-[-2.4px]"
              labelClassName="text-text text-lg"
            />
          ))}
        </div>
      )}
    </section>
  )
}
