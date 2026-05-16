import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['aboutSection']
  locale: Locale
}

export function AboutSection({ data, locale }: Props) {
  if (!data) return null
  const intro = pickLocale(data.intro, locale)
  const stats = data.stats ?? []

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="mx-auto flex w-full max-w-[1384px] flex-col gap-16 px-6 md:px-16">
        {intro && (
          <p className="text-text mx-auto max-w-5xl text-center text-2xl leading-relaxed md:text-3xl">
            {intro}
          </p>
        )}

        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-gold text-5xl font-light md:text-6xl lg:text-7xl">
                  {stat.value}
                </span>
                <span className="text-text-muted text-base">{pickLocale(stat.label, locale)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
