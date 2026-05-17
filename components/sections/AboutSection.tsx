import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['aboutSection']
  locale: Locale
}

// Wg Figma 676:1535: intro 48px text-dark left-aligned, statystyki 100px text-dark
// (NIE gold), labels 20px, rozsunięte na pełną szerokość justify-between.
// Gap 80px między intro a statystykami.
export function AboutSection({ data, locale }: Props) {
  if (!data) return null
  const intro = pickLocale(data.intro, locale)
  const stats = data.stats ?? []

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="layout-container flex flex-col gap-12 md:gap-20">
        {intro && (
          <p className="text-text text-2xl leading-[1.2] tracking-[-0.03em] md:text-3xl lg:text-[48px] lg:leading-[54px]">
            {intro}
          </p>
        )}

        {stats.length > 0 && (
          <div className="grid grid-cols-1 justify-items-center gap-10 md:grid-cols-2 md:justify-items-start md:gap-x-8 md:gap-y-12 wide:flex wide:flex-row wide:justify-between">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 md:items-start">
                <span className="text-text text-6xl leading-none font-normal tracking-tight md:text-7xl md:tracking-[-0.03em] lg:text-[100px]">
                  {stat.value}
                </span>
                <span className="text-text text-base md:text-lg lg:text-xl">
                  {pickLocale(stat.label, locale)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
