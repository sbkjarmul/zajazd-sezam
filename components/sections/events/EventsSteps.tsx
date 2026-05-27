import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['stepsSection']
  locale: Locale
}

// Sekcja `min-h-[800px]` na złotym tle. Kroki w jednej ramce (`border`)
// z wewnętrznymi dzielnikami (`divide-*`) — na mobile i tablecie ułożone
// pionowo (3 rzędy), dopiero na desktopie (`lg`) 3 kolumny.
// Ramka wypełnia wysokość sekcji pod nagłówkiem (`flex-1`).
export function EventsSteps({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const steps = data.steps ?? []
  if (!steps.length && !title) return null

  return (
    <section
      className="flex min-h-[800px] w-full flex-col"
      style={{ background: 'var(--color-gold)' }}
    >
      <div className="layout-container flex flex-1 flex-col gap-10 py-16 md:gap-12 md:py-20">
        <Reveal>
          <header className="flex flex-col items-center gap-4 text-center text-white">
            {eyebrow && (
              <p className="text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="max-w-3xl text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </header>
        </Reveal>

        <Reveal delay={120} className="flex flex-1 flex-col">
          <div className="grid flex-1 grid-cols-1 divide-y divide-white/60 border border-white/60 text-white lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {steps.map((step, i) => {
              const text = pickLocale(step.text, locale)
              return (
                <div
                  key={i}
                  className="flex min-h-[280px] flex-col justify-between gap-12 p-8 md:p-10"
                >
                  <p className="text-7xl leading-none md:text-8xl lg:text-9xl">{i + 1}</p>
                  {text && <p className="text-xl leading-[1.2] md:text-2xl">{text}</p>}
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
