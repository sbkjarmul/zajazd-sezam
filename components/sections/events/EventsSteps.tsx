import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['stepsSection']
  locale: Locale
}

// Sekcja "Proces rezerwacji" na jasnym tle (Figma 1060:107). Nagłówek u góry
// (wyśrodkowany), pod nim lista kroków rozdzielonych złotymi liniami. Każdy krok:
//  - numer (accent, kursywa) przyklejony do lewej krawędzi, złoty,
//  - nagłówek kroku (accent, kursywa) wyśrodkowany — WIDOCZNY domyślnie,
//  - opis (16px, dark-gold) — DOMYŚLNIE PRZYGASZONY na desktopie (opacity 0.25),
//    rozjaśnia się do 1 na hover (CSS-only). Na mobile (brak hovera) opis pełny.
export function EventsSteps({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const steps = data.steps ?? []
  if (!steps.length && !title) return null

  return (
    <section
      data-header-theme="light"
      className="relative flex min-h-[800px] w-full flex-col bg-light lg:h-[800px]"
    >
      <div className="layout-container flex flex-1 flex-col py-16 md:py-20">
        <Reveal>
          <header className="flex flex-col items-center gap-2 text-center text-dark">
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

        {/* Lista kroków — wyśrodkowana pionowo w przestrzeni pod nagłówkiem */}
        <Reveal delay={120} className="flex flex-1 items-center">
          <ol className="w-full">
            {steps.map((step, i) => {
              const stepTitle = pickLocale(step.title, locale)
              const text = pickLocale(step.text, locale)
              return (
                <li
                  key={i}
                  className="group relative border-b border-dark-gold py-8 text-center md:py-9"
                >
                  {/* Nagłówek + numer (numer wyrównany do środka nagłówka) */}
                  <div className="relative">
                    <span
                      aria-hidden
                      className="absolute top-1/2 left-0 -translate-y-1/2 font-accent text-2xl italic text-gold lg:text-[2rem]"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {stepTitle && (
                      <h3 className="font-accent text-3xl leading-[1.1] italic text-dark md:text-4xl lg:text-5xl">
                        {stepTitle}
                      </h3>
                    )}
                  </div>

                  {/* Opis — przygaszony (opacity 0.25) domyślnie na lg, rozjaśnia się
                      do 1 na hover; na mobile (brak hovera) zawsze pełna widoczność. */}
                  {text && (
                    <p className="pt-4 text-base text-dark-gold opacity-100 transition-opacity duration-500 ease-out lg:opacity-25 lg:group-hover:opacity-100">
                      {text}
                    </p>
                  )}
                </li>
              )
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
