import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { Reveal } from '@/components/Reveal'
import { HallsMarquee } from './HallsMarquee'

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
    <section
      id="halls"
      data-header-theme="light"
      data-header-surface="#ffffff"
      className="bg-surface py-20 md:py-32"
    >
      <div className="layout-container">
        <Reveal>
          <header className="flex flex-col gap-4">
            {eyebrow && (
              <p className="text-text wide:text-lg text-base tracking-normal uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text max-w-4xl text-3xl leading-none font-normal tracking-tight md:text-4xl md:tracking-[-0.03em] lg:max-w-6xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-text-muted max-w-3xl text-base md:text-lg lg:text-xl">
                {description}
              </p>
            )}
          </header>
        </Reveal>
      </div>

      <div className="mt-10 md:mt-14 lg:pt-20 lg:pb-44">
        <HallsMarquee halls={halls} locale={locale} />
      </div>
    </section>
  )
}
