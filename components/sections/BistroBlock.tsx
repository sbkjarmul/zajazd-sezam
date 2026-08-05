import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealText } from '@/components/RevealText'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { SectionBleedImage } from './SectionBleedImage'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['bistroBlock']
  locale: Locale
}

// Mobile (Figma 936:93): zdjecie na cala sekcje przymglone kremowa "mgla".
// Gora JASNA (light) - przejscie z ciemnego Hotelu obsluguje osobny connector
// (dark->light), wiec sam Bistro startuje na gorze na jasno. Srodek = light 50%
// (granatowy tekst czytelny), dol wraca do light (przejscie w jasne Opinie).
const BISTRO_GRADIENT =
  'linear-gradient(180deg, var(--color-light) 0%, rgba(246,245,239,0.75) 15.54%, rgba(246,245,239,0.5) 31.02%, rgba(246,245,239,0.5) 76.57%, var(--color-light) 96.6%)'

// Sekcja na ruby (--color-secondary). Bez obrazu — cała treść wyśrodkowana.
// Desktop (lg+): 800px wysokości, 80px góra/dół; wewnątrz justify-between —
// tytuł u góry, opis + CTA na dole. Button gold (accent) z białym tekstem.
// Tablet/mobile (<lg): naturalny stack, wyśrodkowany, mniejsze paddingi.
export function BistroBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <>
      {/* MOBILE (Figma 936:87) - zdjecie na cala sekcje + kremowa mgla, granatowy
          (ruby-light) tekst wysrodkowany, bez opisu. `lg:hidden!` bije
          `.snap-panels > section { display:flex }`. */}
      <section
        data-header-theme="light"
        className="bg-ruby-light text-ruby-light relative w-full overflow-hidden lg:hidden!"
      >
        <SectionBleedImage
          image={data.image}
          locale={locale}
          gradient={BISTRO_GRADIENT}
          className="inset-0"
          parallax
        />
        <div className="layout-container relative z-10 flex flex-col items-center gap-8 text-center">
          <Reveal className="flex flex-col items-center gap-4">
            {eyebrow && <p className="text-base tracking-normal uppercase">{eyebrow}</p>}
            {title && (
              <h2 className="text-[43px] leading-[40px] font-medium tracking-[-3px] text-balance">
                {title}
              </h2>
            )}
          </Reveal>
          {ctaLabel && (
            <Reveal delay={100} className="w-full">
              <Link
                href="/bistro"
                className="bg-ruby-light inline-flex h-16 w-full items-center justify-center rounded-full px-6 text-xl text-white transition-opacity hover:opacity-90"
              >
                {ctaLabel}
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* DESKTOP (bez zmian - tylko bramkowanie widocznosci) */}
      <section
        data-header-theme="dark"
        className="text-text-inverse hidden! py-20 md:py-24 lg:flex! lg:h-[800px]"
        style={{ background: 'var(--color-secondary)' }}
      >
        <div className="layout-container flex h-full flex-col items-center justify-between gap-12 text-center lg:gap-8">
          {/* Title block — góra */}
          <Reveal className="flex flex-col items-center gap-4">
            {eyebrow && (
              <p className="text-text-inverse wide:text-lg text-base tracking-normal uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <RevealText
                as="h2"
                className="text-text-inverse text-3xl leading-none font-normal tracking-tight text-balance md:text-5xl md:tracking-[-0.03em] lg:text-6xl"
              >
                {title}
              </RevealText>
            )}
          </Reveal>

          {/* Description + CTA — dół */}
          <Reveal delay={100} className="flex flex-col items-center gap-8">
            {description && (
              <p className="text-text-inverse/80 max-w-2xl text-base leading-[1.4] md:text-lg">
                {description}
              </p>
            )}
            {ctaLabel && (
              <Link
                href="/bistro"
                className="bg-accent text-text-inverse hover:bg-accent-hover inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-colors md:w-fit md:min-w-[220px]"
              >
                {ctaLabel}
              </Link>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
