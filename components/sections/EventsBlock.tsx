import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealImage } from '@/components/RevealImage'
import { RevealText } from '@/components/RevealText'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { SectionBleedImage } from './SectionBleedImage'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['eventsBlock']
  locale: Locale
}

// Mobile: sekcja samowystarczalna - zdjecie wtapia sie w wlasne tlo (light) u
// gory i u dolu. Przejscie do Restauracji obsluguje osobny SectionConnector.
const IMPREZY_GRADIENT =
  'linear-gradient(180deg, var(--color-light) 3.26%, rgba(246,245,239,0) 30.81%, rgba(246,245,239,0) 75.94%, var(--color-light) 93.66%)'

// Dwa bloki obok siebie (od lg): [główny obraz] | [content].
//   content = nagłówek (góra) + rząd [mały obraz][opis + CTA] (dół).
// Mały obraz pokazywany dopiero od xl. Gdy ukryty (tablet/mobile) lub brak go
// w Sanity, opis+CTA (flex-1) automatycznie wypełnia cały rząd.
// Poniżej lg: bloki ułożone pionowo (content → obraz) — obraz pod tekstem
// dzięki order-last; na lg wraca do DOM order (obraz po lewej).
export function EventsBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <>
      {/* MOBILE (Figma 936:51) - panel snap: Imprezy (do lewej) + zdjecie u dolu.
          Tresc dosunieta do gory - tekst lezy na kremowym gradiencie, a na samym
          zdjeciu ląduje dopiero button. `lg:hidden!` bije snap. */}
      <section
        data-header-theme="light"
        className="bg-bg text-text relative flex w-full flex-col overflow-hidden lg:hidden!"
      >
        <div className="layout-container relative z-10 flex flex-col pt-[120px]">
          {/* Imprezy - do lewej */}
          <div className="flex flex-col gap-10">
            <Reveal className="flex flex-col gap-2">
              {eyebrow && <p className="text-base tracking-normal uppercase">{eyebrow}</p>}
              {title && (
                <h2 className="text-[40px] leading-[40px] font-normal tracking-[-3px] text-balance">
                  {title}
                </h2>
              )}
            </Reveal>
            <Reveal delay={100} className="flex flex-col gap-10">
              {description && <p className="text-base">{description}</p>}
              {ctaLabel && (
                <Link
                  href="/imprezy-okolicznosciowe"
                  className="bg-dark-ruby text-text-inverse inline-flex h-16 w-full items-center justify-center rounded-full px-6 text-xl transition-opacity hover:opacity-90"
                >
                  {ctaLabel}
                </Link>
              )}
            </Reveal>
          </div>
        </div>
        {/* Zdjecie in-flow, wypelnia dol i WYDLUZA sekcje ponad 100svh - jak w
            Hotelu: scrollujesz kawalek zeby zobaczyc pelne zdjecie, potem snap. */}
        <SectionBleedImage
          image={data.mainImage}
          locale={locale}
          gradient={IMPREZY_GRADIENT}
          className="relative z-0 -mt-12 min-h-[60svh] w-full flex-1"
        />
      </section>

      {/* DESKTOP (bez zmian - tylko bramkowanie widocznosci) */}
      <section data-header-theme="light" className="bg-bg hidden! pt-20 md:py-32 lg:flex!">
        <div className="layout-container flex flex-col gap-8 lg:flex-row">
          {/* Blok 1: główny obraz */}
          <Reveal
            delay={120}
            className="relative order-last -mx-4 aspect-[662/592] w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full lg:order-none lg:w-1/2 lg:shrink-0 lg:self-start"
          >
            <RevealImage
              image={data.mainImage}
              locale={locale}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>

          {/* Blok 2: nagłówek + rząd [mały obraz][opis + CTA] */}
          <Reveal className="flex flex-1 flex-col gap-8 lg:justify-between">
            {/* Nagłówek */}
            <div className="flex flex-col gap-4 md:gap-6">
              {eyebrow && (
                <p className="text-text wide:text-lg text-base tracking-normal uppercase">
                  {eyebrow}
                </p>
              )}
              {title && (
                <RevealText
                  as="h2"
                  className="text-text max-w-[11ch] text-3xl leading-none font-normal tracking-tight text-balance md:text-4xl md:tracking-[-0.03em]"
                >
                  {title}
                </RevealText>
              )}
            </div>

            {/* Rząd: mały obraz + opis/CTA. Mały obraz tylko od xl —
              gdy ukryty, opis+CTA (flex-1) wypełnia całą szerokość. */}
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end">
              {data.secondaryImage && (
                <div className="relative hidden aspect-square overflow-hidden xl:block xl:w-1/2 xl:shrink-0">
                  <RevealImage image={data.secondaryImage} locale={locale} sizes="25vw" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-6">
                {description && (
                  <p className="text-text-muted text-base leading-[1.2] md:text-lg">
                    {description}
                  </p>
                )}
                {ctaLabel && (
                  <Link
                    href="/imprezy-okolicznosciowe"
                    className="text-text-inverse inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-opacity hover:opacity-90 md:w-fit md:min-w-[220px]"
                    style={{ background: 'var(--color-dark-ruby)' }}
                  >
                    {ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
