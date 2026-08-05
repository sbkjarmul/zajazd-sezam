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

// Desktop (Figma 1121:14): to samo zdjecie jedzenia co mobile, ale mniej
// zamglone — jedzenie wyraznie widoczne, kremowa poswiata tylko za tekstem
// (radial) + delikatne rozjasnienie gory/dolu (linear) pod header i wtopienie
// w sasiednie sekcje. Granatowy tekst zostaje czytelny nad poswiata.
const BISTRO_DESKTOP_GRADIENT =
  'radial-gradient(60% 46% at 50% 50%, rgba(246,245,239,0.6) 0%, rgba(246,245,239,0) 72%), ' +
  'linear-gradient(180deg, rgba(246,245,239,0.62) 0%, rgba(246,245,239,0.28) 24%, rgba(246,245,239,0.28) 76%, rgba(246,245,239,0.72) 100%)'

// Sekcja na ruby (--color-secondary). Bez obrazu — cała treść wyśrodkowana.
// Desktop (lg+): 800px wysokości, 80px góra/dół; wewnątrz justify-between —
// tytuł u góry, opis + CTA na dole. Button gold (accent) z białym tekstem.
// Tablet/mobile (<lg): naturalny stack, wyśrodkowany, mniejsze paddingi.
export function BistroBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
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

      {/* DESKTOP (Figma 1121:14) - pelnoekranowe zdjecie jedzenia z kremowa mgla,
          granatowy tekst wysrodkowany (eyebrow + tytul + CTA), BEZ opisu.
          `hidden! lg:flex!` bije `.snap-panels > section { display:flex }`. */}
      <section
        data-header-theme="light"
        className="bg-light text-ruby-light relative hidden! w-full flex-col overflow-hidden lg:flex! lg:h-[800px]"
      >
        <SectionBleedImage
          image={data.image}
          locale={locale}
          gradient={BISTRO_DESKTOP_GRADIENT}
          className="inset-0"
          parallax
        />
        <div className="layout-container relative z-10 flex h-full flex-col items-center justify-center gap-8 text-center">
          <Reveal className="flex max-w-[780px] flex-col items-center gap-5">
            {eyebrow && (
              <p className="text-ruby-light/70 wide:text-lg text-base tracking-normal uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <RevealText
                as="h2"
                className="text-ruby-light text-4xl leading-[1.05] font-normal tracking-[-0.03em] text-balance"
              >
                {title}
              </RevealText>
            )}
          </Reveal>

          {ctaLabel && (
            <Reveal delay={100}>
              <Link
                href="/bistro"
                className="bg-ruby-light inline-flex h-[60px] items-center justify-center rounded-full px-8 text-lg text-white transition-opacity hover:opacity-90"
              >
                {ctaLabel}
              </Link>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
