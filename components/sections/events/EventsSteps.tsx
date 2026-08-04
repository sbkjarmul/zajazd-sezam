import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['stepsSection']
  locale: Locale
}

// Sekcja `h-[800px]` (desktop) na złotym tle. Nagłówek u góry (wyśrodkowany),
// pod nim oś czasu:
//  - desktop (`lg`): pozioma, pełnoszerokościowa linia z 3 kropkami w kolumnach,
//    opis pod każdą kropką (do lewej),
//  - mobile + tablet (`<lg`): pionowa linia przyklejona do lewej krawędzi (na całą
//    wysokość sekcji), kropki na niej, a opis POZIOMO obok — po prawej od kropki.
// Kropki na mobile/tablecie leżą na content-left `.layout-container` (16/64px) +
// promień 7px → linia na 23px (mobile) / 71px (tablet).
export function EventsSteps({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const steps = data.steps ?? []
  if (!steps.length && !title) return null

  return (
    <section
      className="relative flex min-h-[800px] w-full flex-col lg:h-[800px]"
      style={{ background: 'var(--color-gold)' }}
    >
      {/* Mobile + tablet: pionowa linia przy lewej krawędzi, na całą wysokość sekcji */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-[23px] w-px bg-white/30 md:left-[71px] lg:hidden"
      />

      <div className="layout-container flex flex-1 flex-col py-16 md:py-20">
        <Reveal>
          <header className="flex flex-col items-center gap-3 text-center text-white">
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

        {/* Oś czasu — wyśrodkowana pionowo w przestrzeni pod nagłówkiem */}
        <Reveal delay={120} className="flex flex-1 items-center">
          <div className="relative w-full">
            {/* Desktop: pozioma, pełnoszerokościowa linia przez środki kropek */}
            <div
              aria-hidden
              className="absolute top-[7px] left-1/2 hidden h-px w-screen -translate-x-1/2 bg-white/30 lg:block"
            />
            <ol className="flex flex-col gap-y-24 md:gap-y-32 lg:grid lg:grid-cols-3 lg:gap-y-0">
              {steps.map((step, i) => {
                const text = pickLocale(step.text, locale)
                return (
                  <li
                    key={i}
                    className="flex items-start gap-5 lg:flex-col lg:gap-10"
                  >
                    <span
                      aria-hidden
                      className="relative z-10 mt-1 block size-3.5 shrink-0 rounded-full bg-[var(--color-light)] lg:mx-auto lg:mt-0"
                    />
                    {text && (
                      <p className="text-lg leading-[1.2] text-white/90 md:text-xl lg:max-w-xs">
                        {text}
                      </p>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
