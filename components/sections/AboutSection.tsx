import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ColorizeText } from '@/components/ColorizeText'
import { AnimatedStat } from '@/components/AnimatedStat'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['aboutSection']
  locale: Locale
}

// Wg Figma 676:1535: intro 48px text-dark left-aligned, statystyki 100px text-dark
// (NIE gold), labels 20px, rozsunięte na pełną szerokość justify-between.
// Gap 80px między intro a statystykami.
//
// ColorizeText (intro): 12ms × char + 100ms na znak (2× szybciej niż domyślne).
// AnimatedStat — counter 800ms + label/suffix równocześnie po counter end.
// Stagger między statkami: 1200ms (połowa poprzedniego 2400).
const INTRO_CHAR_STAGGER_MS = 12
const INTRO_CHAR_DURATION_MS = 100
const INTRO_BUFFER_MS = 300
const STAT_FULL_DURATION_MS = 1200
export function AboutSection({ data, locale }: Props) {
  if (!data) return null
  const introDesktop = pickLocale(data.intro, locale)
  const introMobile = pickLocale(data.introMobile, locale) ?? introDesktop
  const stats = data.stats ?? []

  // Stats delay liczony od dłuższego wariantu intro — tak by stats startowały
  // dopiero gdy ColorizeText skończy się na obu widokach.
  const longerIntroLen = Math.max(introDesktop?.length ?? 0, introMobile?.length ?? 0)
  const introAnimDurationMs =
    longerIntroLen > 0
      ? longerIntroLen * INTRO_CHAR_STAGGER_MS + INTRO_CHAR_DURATION_MS + INTRO_BUFFER_MS
      : 0

  return (
    <section className="bg-bg py-20 md:flex md:min-h-[800px] md:flex-col md:justify-center md:py-32">
      <div className="layout-container flex flex-col gap-24 md:gap-40">
        {introMobile && (
          <p className="text-xl leading-[1.2] font-normal text-center md:hidden">
            <ColorizeText text={introMobile} />
          </p>
        )}
        {introDesktop && (
          <p className="hidden text-2xl leading-[normal] font-normal tracking-[-0.03em] md:block">
            <ColorizeText text={introDesktop} />
          </p>
        )}

        {stats.length > 0 && (
          <div className="grid grid-cols-1 justify-items-center gap-10 md:grid-cols-2 md:justify-items-start md:gap-x-8 md:gap-y-12 wide:flex wide:flex-row wide:justify-between">
            {stats.map((stat, i) => (
              <AnimatedStat
                key={i}
                value={stat.value ?? ''}
                label={pickLocale(stat.label, locale) ?? ''}
                delayMs={introAnimDurationMs + i * STAT_FULL_DURATION_MS}
                className="flex flex-col items-center gap-2 md:items-start"
                valueClassName="text-text text-6xl leading-none font-normal tracking-tight md:text-7xl md:tracking-[-0.03em] lg:text-[100px]"
                labelClassName="text-text-muted text-base md:text-lg lg:text-xl"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
