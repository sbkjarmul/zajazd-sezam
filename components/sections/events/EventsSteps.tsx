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
//  - opis (16px, dark-gold) — DOMYŚLNIE UKRYTY na desktopie (opacity 0),
//    pojawia się (opacity 1) na hover kroku (CSS-only). Na mobile (brak hovera)
//    opis pełny.
export function EventsSteps({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const steps = data.steps ?? []
  if (!steps.length && !title) return null

  return (
    <section
      data-header-theme="light"
      className="bg-light relative flex min-h-[800px] w-full flex-col lg:h-[800px]"
    >
      <div className="layout-container flex flex-col pt-[120px] pb-16 md:pb-20">
        <Reveal>
          <header className="text-dark flex flex-col items-center gap-4 text-center">
            {eyebrow && (
              <p className="wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
            )}
            {title && (
              <h2 className="max-w-3xl text-3xl leading-none font-normal tracking-tight md:text-4xl md:tracking-[-0.03em]">
                {title}
              </h2>
            )}
          </header>
        </Reveal>

        {/* Lista kroków — 40px pod nagłówkiem (nie wyśrodkowana pionowo). */}
        <Reveal delay={120} className="mt-10">
          <ol className="w-full">
            {steps.map((step, i) => {
              const stepTitle = pickLocale(step.title, locale)
              const text = pickLocale(step.text, locale)
              return (
                <li
                  key={i}
                  className="group border-dark-gold relative border-b py-8 text-center md:py-9"
                >
                  {/* Nagłówek + numer. Na mobile numer stoi NAD tytułem (przy
                      lewej krawędzi wchodził na długie tytuły); od md wraca na
                      lewą krawędź, wyrównany do środka nagłówka. */}
                  <div className="relative">
                    <span
                      aria-hidden
                      className="font-accent text-gold mb-1 block text-2xl italic md:absolute md:top-1/2 md:left-0 md:mb-0 md:-translate-y-1/2 lg:text-[2rem]"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {stepTitle && (
                      <h3 className="font-accent text-dark text-3xl italic md:text-4xl lg:text-5xl">
                        {stepTitle}
                      </h3>
                    )}
                  </div>

                  {/* Opis — DOMYŚLNIE ZWINIĘTY na lg (grid-rows 0fr → wysokość 0, widać
                      tylko numer + tytuł). Na hover kroku wiersz ROZSZERZA się
                      (0fr → 1fr, robi miejsce), a opis pojawia się przez FADE (opacity
                      0 → 1) z opóźnieniem, żeby wjeżdżał po rozsunięciu — bez efektu
                      "reveal"/odsłaniania spod maski. Mobile (brak hovera) = widoczny. */}
                  {text && (
                    <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="text-dark-gold pt-4 text-base transition-opacity duration-300 ease-out lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:delay-200">
                          {text}
                        </p>
                      </div>
                    </div>
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
