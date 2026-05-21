import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { Reveal } from '@/components/Reveal'
import { HallCard } from './HallCard'

type Props = {
  section: NonNullable<EVENTS_PAGE_QUERY_RESULT>['hallsSection']
  halls: NonNullable<NonNullable<EVENTS_PAGE_QUERY_RESULT>['halls']>
  locale: Locale
}

export function EventsHalls({ section, halls, locale }: Props) {
  const eyebrow = pickLocale(section?.eyebrow, locale)
  const title = pickLocale(section?.title, locale)
  const description = pickLocale(section?.description, locale)

  return (
    <section id="halls" className="bg-surface py-20 md:py-32">
      <div className="layout-container flex flex-col gap-20">
        <Reveal>
          <header className="flex flex-col gap-6">
            {eyebrow && (
              <p className="text-text text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text max-w-4xl text-4xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-text max-w-3xl text-xl leading-relaxed">{description}</p>
            )}
          </header>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {halls.map((hall, i) => (
            <Reveal key={hall._id} delay={i * 80}>
              <HallCard hall={hall} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
