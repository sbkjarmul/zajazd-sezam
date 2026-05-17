import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['stepsSection']
  locale: Locale
}

export function EventsSteps({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const steps = data.steps ?? []
  if (!steps.length && !title) return null

  return (
    <section className="w-full" style={{ background: 'var(--color-gold)' }}>
      <div className="layout-container flex flex-col items-center gap-16 py-24 text-center md:py-32">
        <header className="flex flex-col items-center gap-3 text-white">
          {eyebrow && <p className="text-base tracking-normal uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="max-w-3xl text-4xl leading-tight font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
              {title}
            </h2>
          )}
        </header>
      </div>

      <div className="grid grid-cols-1 text-white md:grid-cols-3">
        {steps.map((step, i) => {
          const text = pickLocale(step.text, locale)
          return (
            <div
              key={i}
              className="flex flex-col justify-between gap-12 border-y-2 border-white/60 p-10 md:gap-20 md:border-x-2 md:border-y-0"
              style={{ minHeight: 360 }}
            >
              <p className="text-7xl leading-none md:text-8xl lg:text-9xl">{i + 1}</p>
              {text && <p className="text-xl leading-snug md:text-2xl">{text}</p>}
            </div>
          )
        })}
      </div>
      <div className="h-12" style={{ background: 'var(--color-gold)' }} aria-hidden />
    </section>
  )
}
